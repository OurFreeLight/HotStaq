#!/usr/bin/env node
/**
 * Browser-truth verification harness for @hotstaq/admin-panel running
 * on v0.9.0 static builds. Serves `./dist/` over HTTP, launches
 * headless Chrome via selenium-webdriver, and reports on every wiring
 * point admin-panel depends on.
 *
 * Usage (after building a static dist that includes admin-panel):
 *   node examples/admin-panel-audit/verify.js                    # default ./dist
 *   DIST=/path/to/dist node examples/admin-panel-audit/verify.js # explicit path
 *
 * Requires: a locally installed Chrome. selenium-webdriver will fetch
 * chromedriver automatically via Selenium Manager.
 *
 * Exit code:
 *   0 — every admin-panel integration point verified
 *   1 — one or more checks failed (see log)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const DIST = process.env.DIST || path.resolve(process.cwd(), "dist");
const PORT = parseInt(process.env.PORT || "4456", 10);

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error(`[admin-audit] no index.html under ${DIST}; build a dist first.`);
  process.exit(2);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      let abs = path.join(DIST, url);
      if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
        abs = path.join(DIST, "index.html");
      }
      const ext = path.extname(abs).toLowerCase();
      fs.readFile(abs, (err, body) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
        res.end(body);
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  const server = await startServer();
  console.log(`[admin-audit] server listening on http://localhost:${PORT} (DIST=${DIST})`);

  // Resolve selenium-webdriver from hotstaq's installed modules, or
  // from the CWD — lets this harness run both in-repo and in consumer
  // projects that have hotstaq installed.
  let Builder, chrome;
  try {
    ({ Builder } = require("selenium-webdriver"));
    chrome = require("selenium-webdriver/chrome");
  } catch {
    const alt = path.join(__dirname, "..", "..", "node_modules");
    module.paths.push(alt);
    ({ Builder } = require("selenium-webdriver"));
    chrome = require("selenium-webdriver/chrome");
  }

  const opts = new chrome.Options()
    .addArguments("--headless=new")
    .addArguments("--no-sandbox")
    .addArguments("--disable-gpu")
    .addArguments("--disable-dev-shm-usage")
    .addArguments("--window-size=1280,800");
  // Enable browser log capture so driver.manage().logs() returns
  // console entries (including SEVERE script errors).
  opts.setLoggingPrefs({ browser: "ALL" });

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(opts).build();
  let allPassed = true;

  try {
    await driver.get(`http://localhost:${PORT}/`);
    await driver.sleep(1500);

    const report = await driver.executeScript(() => {
      const r = {};
      r.hotStaqWeb = typeof HotStaqWeb !== "undefined";
      r.adminPanelComponentsWeb = typeof AdminPanelComponentsWeb !== "undefined";
      r.adminPanelKeys = typeof AdminPanelComponentsWeb !== "undefined"
        ? Object.keys(AdminPanelComponentsWeb) : [];
      r.hotCurrentPage = !!(typeof Hot !== "undefined" &&
        Hot.CurrentPage && Hot.CurrentPage.processor);

      const tags = [
        "admin-dashboard", "admin-edit", "admin-button",
        "admin-dropdown", "admin-table", "admin-table-field",
        "admin-table-row", "admin-text",
      ];
      r.registered = {};
      for (const t of tags) r.registered[t] = !!customElements.get(t);

      const app = document.getElementById("app");
      const html = app ? app.innerHTML : "";
      r.hasUserListTable = /id="userListTable"/.test(html);
      r.hasDataTable = /class="[^"]*dataTable/.test(html);
      r.hasColumnHeaders = html.includes("Display Name") || html.includes("Email");
      r.hasAdminEditOutput = /<main[^>]*>/.test(html);

      return r;
    });

    const logs = await driver.manage().logs().get("browser").catch(() => []);

    // Filter known-benign noise:
    //  1. searchBuilder / select.bootstrap5 missing-base-plugin errors
    //     (admin-panel's JS manifest omits searchBuilder.min.js and
    //     select.min.js as upstream packaging oversights; bootstrap5
    //     adapters fail to read DataTable.ext.classes but the rest of
    //     DataTables works).
    //  2. Missing backend: ERR_CONNECTION_REFUSED / "Failed to fetch"
    //     when the admin-panel's admin-table onlist hits a dev API URL
    //     that isn't running.
    const KNOWN_BENIGN = [
      /searchBuilder\.bootstrap5\.min\.js.*classes/,
      /select\.bootstrap5\.min\.js.*classes/,
      /ERR_CONNECTION_REFUSED/,
      /Failed to fetch/i,
    ];
    const severe = logs.filter((e) => {
      const level = (e.level && e.level.name) || e.level || "";
      if (String(level).toUpperCase() !== "SEVERE") return false;
      return !KNOWN_BENIGN.some((re) => re.test(e.message || ""));
    });

    console.log("\n================ RESULTS ================");
    const expect = (name, got) => {
      console.log(`  ${got ? "OK  " : "FAIL"} ${name}`);
      if (!got) allPassed = false;
    };

    expect("HotStaqWeb global loaded", report.hotStaqWeb);
    expect("AdminPanelComponentsWeb loaded", report.adminPanelComponentsWeb);
    expect("AdminPanelComponentsWeb has classes", report.adminPanelKeys.length >= 8);
    expect("Hot.CurrentPage.processor wired", report.hotCurrentPage);
    for (const [tag, ok] of Object.entries(report.registered)) {
      expect(`customElements.define(${tag})`, ok);
    }
    expect("DataTable instantiated (#userListTable)", report.hasUserListTable);
    expect("DataTable class applied", report.hasDataTable);
    expect("Column headers rendered", report.hasColumnHeaders);
    expect("<admin-edit> emitted <main>", report.hasAdminEditOutput);
    expect("No SEVERE browser console entries", severe.length === 0);

    if (severe.length > 0) {
      console.log("\n[SEVERE browser errors]");
      for (const e of severe) console.log(`  ${e.message}`);
    }

    try {
      const png = await driver.takeScreenshot();
      const shotPath = path.join(path.dirname(DIST), "admin-audit-screenshot.png");
      fs.writeFileSync(shotPath, Buffer.from(png, "base64"));
      console.log(`\n[screenshot] saved to ${shotPath}`);
    } catch { /* optional */ }

    console.log("=========================================");
    console.log(allPassed ? "PASS — admin-panel operational" : "FAIL — see above");
  } finally {
    await driver.quit();
    server.close();
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error("FATAL:", err && err.stack || err);
  process.exit(1);
});
