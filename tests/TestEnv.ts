import "mocha";

/**
 * Central environment gating for HotStaq's full test suite.
 *
 * `npm test` mixes fast, self-contained unit/API tests with heavy integration
 * tests that require external infrastructure the default headless CI runner
 * does not provide:
 *
 *   - Browser tests need a real Chrome + Selenium/webdriver
 *     (tests/browser/*, tests/components/ComponentTests, some tests/hotsite/*).
 *   - Database tests need a running MySQL / Postgres / InfluxDB
 *     (tests/db/*).
 *   - App-generation tests need Docker + npm-registry access
 *     (tests/build/*, tests/create/*).
 *
 * Rather than delete those tests, they are guarded behind opt-in environment
 * flags so they SKIP cleanly when the infrastructure is absent (e.g. CI) and
 * RUN unchanged when a developer provides the services locally. This keeps the
 * suite green in a plain node container while preserving every test.
 *
 * To run a gated group locally, export the matching flag before `npm test`:
 *
 *   RUN_BROWSER_TESTS=1       # Chrome + Selenium available (or TESTING_REMOTE_SERVER set)
 *   RUN_DB_TESTS=1            # MySQL / Postgres / Influx reachable via .env config
 *   RUN_INTEGRATION_TESTS=1   # Docker + npm registry available (create/build app tests)
 */

const isEnabled = (name: string): boolean =>
{
	const value: string = process.env[name];

	return (value === "1" || value === "true");
};

/**
 * Browser/Selenium tests are enabled when RUN_BROWSER_TESTS is set, or when a
 * remote Selenium server has been configured via TESTING_REMOTE_SERVER.
 */
export const runBrowserTests: boolean = isEnabled ("RUN_BROWSER_TESTS") || (process.env["TESTING_REMOTE_SERVER"] != null);

/**
 * Database tests (MySQL / Postgres / Influx) are enabled when RUN_DB_TESTS is set.
 */
export const runDbTests: boolean = isEnabled ("RUN_DB_TESTS");

/**
 * App generation tests (create/build an app, Docker) are enabled when
 * RUN_INTEGRATION_TESTS is set.
 */
export const runIntegrationTests: boolean = isEnabled ("RUN_INTEGRATION_TESTS");

/**
 * `describe` for browser-only suites — becomes `describe.skip` when browser
 * infrastructure is unavailable.
 */
export const describeBrowser: Mocha.SuiteFunction = (runBrowserTests ? describe : describe.skip) as Mocha.SuiteFunction;

/**
 * `describe` for database suites — becomes `describe.skip` when no database is
 * available.
 */
export const describeDb: Mocha.SuiteFunction = (runDbTests ? describe : describe.skip) as Mocha.SuiteFunction;

/**
 * `describe` for app-generation/Docker suites — becomes `describe.skip` when
 * that infrastructure is unavailable.
 */
export const describeIntegration: Mocha.SuiteFunction = (runIntegrationTests ? describe : describe.skip) as Mocha.SuiteFunction;
