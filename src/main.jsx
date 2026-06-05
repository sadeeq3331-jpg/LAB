<!doctype html>
<html lang="en">
  <head><script defer data-preview-inject="true" data-app-id="6a21639187c236d8d5df38a0" data-preview-type="sandbox" data-rum-app-id="db50c921-10c3-4f12-bccb-950fa174b708" data-rum-client-token="pubfe8a4f2972b412b4556fd67e77f82cb4" data-dd-site="datadoghq.com" src="https://app.base44.com/builder-bridge.js?t=1780641447"></script>
    <script>
    (function() {
        var IGNORE = { SCRIPT: 1, STYLE: 1, LINK: 1, META: 1, NOSCRIPT: 1, TEMPLATE: 1 };
        const fire = () => window.parent.postMessage({ type: 'IFRAME_CONTENT_READY' }, '*');
        function check() {
            var body = document.body;
            if (!body) return false;
            for (var idx = 0; idx < body.children.length; idx++) {
                if (!IGNORE[body.children[idx].tagName]) return true;
            }
            return false;
        }
        function start() {
            if (check()) { fire(); return; }
            var observer = new MutationObserver(function() {
                if (check()) { fire(); observer.disconnect(); }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
        if (document.body) { start(); }
        else { document.addEventListener('DOMContentLoaded', start, { once: true }); }
    })();
    </script>
    <script>
    (function() {
        if (window.self === window.top) return;
        var APP_ID = "6a21639187c236d8d5df38a0";
        var PREVIEW_TYPE = "sandbox";
        var on404 = false;
        var booted = false;
        function detect() { return !!document.querySelector('[data-source-location^="PageNotFound:"]'); }
        function payload() { return { app_id: APP_ID, preview_type: PREVIEW_TYPE, url_path: window.location.pathname }; }
        function tick() {
            var now = detect();
            if (now && !on404) {
                on404 = true;
                window.parent.postMessage({ type: 'PREVIEW_PAGE_NOT_FOUND', payload: payload() }, '*');
            } else if (!now && (on404 || !booted)) {
                // On first tick of a fresh document, emit a cleared signal even when
                // not currently on a 404 — the parent may have latched is404=true from
                // a previous document at the same URL (e.g. after an iframe reload).
                on404 = false;
                window.parent.postMessage({ type: 'PREVIEW_PAGE_NOT_FOUND_CLEARED', payload: payload() }, '*');
            }
            booted = true;
        }
        function start() {
            tick();
            new MutationObserver(tick).observe(document.body, { childList: true, subtree: true });
        }
        if (document.body) { start(); }
        else { document.addEventListener('DOMContentLoaded', start, { once: true }); }
    })();
    </script>
    <script>
    (function() {
        if (window.self === window.top) return;
        function fire() { window.parent.postMessage({ type: 'REACT_ROOT_HAS_CHILDREN' }, '*'); }
        function findRoot() {
            return document.getElementById('root')
                || document.getElementById('app')
                || document.querySelector('[data-react-root]');
        }
        // One-shot: wait for DOMContentLoaded (static HTML parsed by then, so the
        // Base44 convention <div id="root"> is either present or not coming),
        // observe the root's childList until the first element child appears,
        // then fire and disconnect. No tree-wide subtree observer.
        function start() {
            var root = findRoot();
            if (!root) return;
            if (root.childElementCount > 0) { fire(); return; }
            var obs = new MutationObserver(function() {
                if (root.childElementCount > 0) { fire(); obs.disconnect(); }
            });
            obs.observe(root, { childList: true });
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start, { once: true });
        } else { start(); }
    })();
    </script>
    <script>
    (function() {
        if (window.self === window.top) return;
        function postUnsupported(reason) {
            window.parent.postMessage({
                type: 'IFRAME_FIRST_CONTENTFUL_PAINT_UNSUPPORTED',
                payload: { reason: reason, userAgent: navigator.userAgent }
            }, '*');
        }
        if (typeof PerformanceObserver === 'undefined') {
            postUnsupported('no_performance_observer');
            return;
        }
        try {
            var obs = new PerformanceObserver(function(list) {
                var entries = list.getEntries();
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].name === 'first-contentful-paint') {
                        obs.disconnect();
                        window.parent.postMessage({ type: 'IFRAME_FIRST_CONTENTFUL_PAINT' }, '*');
                        return;
                    }
                }
            });
            obs.observe({ type: 'paint', buffered: true });
        } catch (e) {
            postUnsupported('observe_threw:' + (e && e.name ? e.name : 'Error'));
        }
    })();
    </script>
    <script>
    (function() {
        if (window.self === window.top) return;
        var APP_ID = "6a21639187c236d8d5df38a0";
        var PREVIEW_TYPE = "sandbox";
        var DEPS_PATH = '/node_modules/.vite/deps/';
        var fired = false;
        function isViteDep(url) {
            return typeof url === 'string' && url.indexOf(DEPS_PATH) !== -1;
        }
        function looksFailed(entry) {
            // HTTP failure status (Chrome 109+).
            if (entry.responseStatus && entry.responseStatus >= 400) return true;
            // Aborted / blocked / network-error: request ran, nothing decoded.
            // decodedBodySize === 0 distinguishes from cache hits (Safari has no
            // deliveryType, so we can't rely on it to exclude cached responses).
            return entry.transferSize === 0
                && entry.decodedBodySize === 0
                && entry.duration > 0
                && entry.responseEnd > 0;
        }
        function report(entry) {
            if (fired) return;
            fired = true;
            window.parent.postMessage({
                type: 'SANDBOX_VITE_DEPS_404',
                payload: {
                    app_id: APP_ID,
                    preview_type: PREVIEW_TYPE,
                    url: entry.name,
                    initiator_type: entry.initiatorType,
                    response_status: entry.responseStatus
                }
            }, '*');
        }
        new PerformanceObserver(function(list) {
            var entries = list.getEntries();
            for (var i = 0; i < entries.length; i++) {
                if (isViteDep(entries[i].name) && looksFailed(entries[i])) {
                    report(entries[i]);
                    return;
                }
            }
        }).observe({ type: 'resource', buffered: true });
    })();
    </script>
    <script>
    (function() {
        if (window.self === window.top) return;
        if (typeof performance === 'undefined' || typeof performance.getEntriesByType !== 'function') return;
        var DEPS_PATH = '/node_modules/.vite/deps/';
        var QUIESCENCE_MS = 1500;
        var POLL_MS = 500;
        var fired = false;
        var intervalId = setInterval(function() {
            if (fired) return;
            var entries = performance.getEntriesByType('resource');
            var lastDepEnd = 0;
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].name.indexOf(DEPS_PATH) === -1) continue;
                if (entries[i].responseEnd > lastDepEnd) lastDepEnd = entries[i].responseEnd;
            }
            if (lastDepEnd === 0) return;
            if (performance.now() - lastDepEnd >= QUIESCENCE_MS) {
                fired = true;
                clearInterval(intervalId);
                window.parent.postMessage({ type: 'IFRAME_VITE_DEPS_SETTLED' }, '*');
            }
        }, POLL_MS);
    })();
    </script>
        <script type="module">
        try {
            const { createHotContext } = await import("/@vite/client");
            const hot = createHotContext("/__builder-bridge-hmr");
            hot.on("vite:ws:connect", () => window.parent.postMessage({ type: "SANDBOX_WS_CONNECT" }, "*"));
            hot.on("vite:ws:disconnect", () => window.parent.postMessage({ type: "SANDBOX_WS_DISCONNECT" }, "*"));
        } catch (e) {
            window.parent.postMessage({ type: "SANDBOX_WS_ATTACH_FAILED", error: String(e) }, "*");
        }
        </script>
    <script type="module">import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;</script>

    <script type="module" src="/@vite/client"></script>

    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="https://base44.com/logo_v2.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="manifest" href="/manifest.json" />
    <title>Base44 APP</title>
      <!-- Tailwind CSS CDN for visual editing -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="/node_modules/@base44/vite-plugin/dist/injections/unhandled-errors-handlers.js" type="module"></script>
    <script src="/node_modules/@base44/vite-plugin/dist/injections/sandbox-hmr-notifier.js" type="module"></script>
    <script src="/node_modules/@base44/vite-plugin/dist/injections/navigation-notifier.js" type="module"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script src="/node_modules/@base44/vite-plugin/dist/injections/sandbox-mount-observer.js" type="module"></script>
    <script type="module">if (window.self !== window.top) {
  const mode = new URLSearchParams(location.search).get("sandbox-bridge");
  const url = mode === "local"
    ? "https://localhost:3201/index.mjs"
    : "/node_modules/@base44/vite-plugin/dist/statics/index.mjs";
  import(url)
    .then(mod => {
      if (typeof mod.setupVisualEditAgent === "function") mod.setupVisualEditAgent();
    })
    .catch(e => console.error("[visual-edit-agent] Failed to load:", e));
}</script>
  </body>
</html>
