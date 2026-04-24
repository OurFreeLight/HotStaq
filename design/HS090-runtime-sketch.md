# v0.9.0 Runtime Sketch — Router + Mount + Interception

**Status:** Draft • **Tickets covered:** HS090-10, HS090-11, HS090-12, HS090-13, HS090-14
**Depends on:** HS090-1, HS090-3

Compact cross-ticket design — the runtime pieces interlock and are easier to
reason about in one place. Each ticket below carves out its own PR.

## Module Layout

```
src/runtime/
├── navigate.ts      — HS090-10  Hot.navigate(), popstate wiring
├── mount.ts         — HS090-11  template clone, preamble invoke, script exec
├── swap.ts          — HS090-12  content-region replace + optional morph
├── intercept.ts     — HS090-13  click/submit listener, data-spa-ignore
├── history.ts       — HS090-14  scroll restoration, back/forward
├── ctx.ts           — builds HotCtx per navigation (HS090-3 rewrite target)
└── index.ts         — wires everything, exposes window.Hot.navigate
```

## Runtime Bootstrap (end of app.js)

```ts
import { installIntercept } from './intercept';
import { installHistory } from './history';
import { Hot } from './ctx';

// ROUTES is injected by the build: { "/dashboard": { preamble, scripts, templateId, preload, chunkUrl? }, ... }
Hot.routes = ROUTES;

installHistory();
installIntercept();

// Initial mount
Hot.navigate(window.location.pathname + window.location.search, { replace: true });
```

## HS090-10 — Hot.navigate()

```ts
async navigate(url: string, opts: { replace?: boolean; preserveScroll?: boolean } = {}) {
    if (Hot.onBeforeNavigate && !await Hot.onBeforeNavigate(url)) return;

    const route = resolveRoute(url);
    if (!route) return fullPageNav(url);

    // Lazy chunk load if needed
    if (route.preload !== 'eager' && !route.loaded) {
        await loadChunk(route.chunkUrl);
    }

    const ctx = buildCtx(url);
    if (opts.replace) history.replaceState({ scroll: 0 }, '', url);
    else history.pushState({ scroll: 0 }, '', url);

    await mount(route, ctx, opts);
    Hot.onAfterNavigate?.(url);
    document.dispatchEvent(new CustomEvent('hot:navigated', { detail: { url } }));
}
```

Event `hot:navigated` is the public extension point — analytics, toast clear,
focus reset all hook here without monkeypatching history.

## HS090-11 — Mount

```ts
async function mount(route, ctx, opts) {
    const tpl = document.getElementById(route.templateId);
    if (!tpl) throw new Error(`missing template ${route.templateId}`);

    // 1. unmount previous
    for (const fn of currentMountedHooks) await safe(fn.unmount);
    currentMountedHooks = [];

    // 2. clone + run preamble (preamble can use ctx.echo() to inject HTML)
    const frag = tpl.content.cloneNode(true) as DocumentFragment;
    const preambleBuf: string[] = [];
    ctx._echoBuffer = preambleBuf;
    await route.preamble(ctx);
    const preambleHtml = preambleBuf.join('');

    // 3. swap into region
    swap(document.getElementById('hot-content'), frag, preambleHtml, opts);

    // 4. exec inline scripts — new <script> nodes so they run (see HotStaq today)
    for (const src of route.scripts) {
        const s = document.createElement('script');
        s.textContent = src;
        document.getElementById('hot-content').appendChild(s);
    }

    // 5. fire mounted event
    document.dispatchEvent(new CustomEvent('hot:mounted', { detail: { route: route.path } }));
}
```

`currentMountedHooks` is populated by preambles / scripts that want to run
cleanup on navigate-away:

```js
Hot.onUnmount(() => { /* close modal, cancel fetch */ });
```

## HS090-12 — Content-Region Swap

Default is simple `innerHTML` replacement of `#hot-content`. Opt-in morph
via:

```yaml
# HotSite.yaml
web:
  MyApp:
    swapMode: morph    # default: "replace"
```

When `morph` is active, we import `idiomorph` (smallest of the morph libs,
~3kb gzipped) lazily at bundle time and diff outgoing vs incoming fragments.
Inputs preserve focus and partial values. Degrades to `replace` if target
regions don't align.

## HS090-13 — Link + Form Interception

```ts
document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || a.hasAttribute('data-spa-ignore')) return;
    if (a.target === '_blank' || a.origin !== location.origin) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;     // user wants new tab
    e.preventDefault();
    Hot.navigate(a.pathname + a.search);
});

document.addEventListener('submit', async e => {
    const f = e.target as HTMLFormElement;
    if (f.hasAttribute('data-spa-ignore')) return;
    if (f.getAttribute('method')?.toLowerCase() !== 'post') return;  // let native GET navigate

    e.preventDefault();
    const res = await fetch(f.action, { method: 'POST', body: new FormData(f), redirect: 'manual' });
    if (res.type === 'opaqueredirect') return Hot.navigate(res.url);
    // else: response payload renders into frame target (future ticket)
});
```

`data-spa-ignore` already in wide use (register link, forgot-password link,
OIDC interaction forms). Kept verbatim.

## HS090-14 — History + Scroll

```ts
window.addEventListener('popstate', async e => {
    await Hot.navigate(location.pathname + location.search, { preserveScroll: true });
    window.scrollTo(0, e.state?.scroll ?? 0);
});

// Save scroll on navigate
Hot.beforeNavigate = () => {
    history.replaceState({ ...history.state, scroll: window.scrollY }, '');
};
```

Forward navigations scroll-to-top unless `preserveScroll: true` is passed
(used by popstate, by deep-link fragment hops, and opt-in via Hot.navigate).

## What this unblocks

- FreelightAuth pilot (HS090-21) can use the full runtime as soon as
  HS090-10 / HS090-11 land. Auth is small: login, register, forgot, admin
  users — intercept + mount + history cover it.
- DAO migration uses morph to keep sidebar / topbar stable during
  intra-section navigation. Big UX win.
- Freelight campaign platform needs morph for the dashboard and posts
  pages specifically.

## Out of Scope

- Turbo-frame-style sub-region navigation (returning HTML into a named frame).
  Useful for future tickets; adds complexity this release can skip.
- View transitions API integration. Nice-to-have follow-up.
- Service-worker offline caching. Separate effort.
