# Scripts auxiliares de la auditoría

Scripts ejecutados desde un directorio temporal **fuera del repositorio**, para no contaminar `npm run lint` ni la
suite de Vitest. Para reproducirlos:

```bash
mkdir -p /tmp/auditoria && cd /tmp/auditoria && npm init -y
npm i playwright@1 @axe-core/playwright@4 lighthouse@12 serve@14 linkinator@6 isomorphic-dompurify@3
npx playwright install chromium webkit firefox
```

Builds servidos durante la auditoría:

- **A (equivalente a producción):** copia del árbol de trabajo con un `.env` de producción (`APP_URL=https://raupulus.dev`, `API_BASE_URL=https://api.raupulus.dev/api/v2`) → `npx serve .output/public -l 4173`.
- **B (con datos):** build del repositorio con el `.env` local (API en `localhost:8000` con 16 proyectos) → `npx serve .output/public -l 3020` (origen permitido por el CORS de la API local).

Versiones: Playwright 1.63.0 (Chromium y WebKit; Firefox 155 no arranca en macOS 27), Lighthouse 12.8.2, axe-core 4 y serve 14.

## `matrix.mjs`

```js
// Matriz responsive + consola + red + cookies + SEO DOM por ruta, viewport y motor.
// Uso: node matrix.mjs <baseUrl> <outJson> <shotsDir> [engines] [paths]
import { chromium, webkit, firefox } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [, , baseUrl, outJson, shotsDir, enginesArg, pathsArg] = process.argv;
const engines = (enginesArg || 'chromium,webkit,firefox').split(',');
const paths = (pathsArg || '/,/projects,/about,/webs,/social,/contact,/privacy,/blog').split(',');
const viewports = [
    [320, 568],
    [360, 800],
    [375, 667],
    [390, 844],
    [412, 915],
    [430, 932],
    [768, 1024],
    [820, 1180],
    [1024, 1366],
    [1024, 768],
    [1280, 800],
    [1366, 768],
    [1440, 900],
    [1920, 1080],
    [2560, 1440],
];
const fullShots = new Set(['360x800', '390x844', '768x1024', '1440x900']);
fs.mkdirSync(shotsDir, { recursive: true });
const launchers = { chromium, webkit, firefox };
const host = new URL(baseUrl).host;
const results = [];
fs.writeFileSync(outJson, '');

for (const engine of engines) {
    const browser = await launchers[engine].launch();
    for (const p of paths) {
        for (const [w, h] of viewports) {
            const ctx = await browser.newContext({
                viewport: { width: w, height: h },
                hasTouch: w < 1024,
                isMobile: engine === 'chromium' && w < 768,
                locale: 'es-ES',
            });
            const page = await ctx.newPage();
            try {
                const rec = {
                    engine,
                    path: p,
                    viewport: `${w}x${h}`,
                    console: [],
                    pageErrors: [],
                    failed: [],
                    badStatus: [],
                    thirdParty: new Set(),
                };
                page.on('console', (m) => {
                    if (['error', 'warning'].includes(m.type()))
                        rec.console.push(`${m.type()}: ${m.text().slice(0, 300)}`);
                });
                page.on('pageerror', (e) => rec.pageErrors.push(String(e).slice(0, 300)));
                page.on('requestfailed', (r) => rec.failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 200)}`));
                page.on('response', (r) => {
                    if (r.status() >= 400) rec.badStatus.push(`${r.status()} ${r.url().slice(0, 200)}`);
                });
                page.on('request', (r) => {
                    try {
                        const u = new URL(r.url());
                        if (u.host !== host && u.protocol.startsWith('http')) rec.thirdParty.add(u.host);
                    } catch {
                        /* */
                    }
                });
                try {
                    const resp = await page.goto(baseUrl + p, { waitUntil: 'load', timeout: 30000 });
                    rec.status = resp?.status();
                } catch (e) {
                    rec.navError = String(e).slice(0, 200);
                }
                await page.waitForTimeout(1200);
                rec.overflow = await page.evaluate(() => {
                    const de = document.documentElement;
                    const vw = window.innerWidth;
                    const off = [];
                    for (const el of document.querySelectorAll('body *')) {
                        const r = el.getBoundingClientRect();
                        if (r.width && r.right > vw + 1) {
                            const cs = getComputedStyle(el);
                            if (cs.position === 'fixed' && cs.visibility === 'hidden') continue;
                            let hiddenByAncestor = false;
                            for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
                                const s = getComputedStyle(a);
                                if (/(hidden|clip|auto|scroll)/.test(s.overflowX)) {
                                    hiddenByAncestor = true;
                                    break;
                                }
                            }
                            if (!hiddenByAncestor)
                                off.push({
                                    tag: el.tagName.toLowerCase(),
                                    cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 80),
                                    text: (el.textContent || '').trim().slice(0, 40),
                                    right: Math.round(r.right),
                                });
                        }
                    }
                    return {
                        scrollWidth: de.scrollWidth,
                        clientWidth: de.clientWidth,
                        hasHScroll: de.scrollWidth > de.clientWidth + 1,
                        offenders: off.slice(0, 8),
                    };
                });
                if (rec.viewport === '1280x800' || rec.viewport === '390x844') {
                    rec.seo = await page.evaluate(() => {
                        const q = (s) => [...document.querySelectorAll(s)];
                        const meta = (k) =>
                            q(`meta[name="${k}"],meta[property="${k}"]`).map((m) => m.getAttribute('content'));
                        return {
                            title: document.title,
                            titles: q('title').length,
                            description: meta('description'),
                            canonical: q('link[rel="canonical"]').map((l) => l.href),
                            ogTitle: meta('og:title'),
                            ogImage: meta('og:image'),
                            ogUrl: meta('og:url'),
                            twitterCard: meta('twitter:card'),
                            robots: meta('robots'),
                            h1: q('h1').map((h) => h.textContent.trim().replace(/\s+/g, ' ')),
                            headings: q('h1,h2,h3,h4,h5,h6').map((h) => h.tagName),
                            imgsNoAlt: q('img')
                                .filter((i) => !i.hasAttribute('alt'))
                                .map((i) => i.src.slice(0, 120)),
                            imgsNoDims: q('img')
                                .filter((i) => !i.getAttribute('width') || !i.getAttribute('height'))
                                .map((i) => i.src.slice(0, 120)),
                            lang: document.documentElement.lang,
                            cookies: document.cookie,
                            ls: Object.keys(localStorage),
                        };
                    });
                    rec.cookiesAll = (await ctx.cookies()).map((c) => `${c.domain} ${c.name}`);
                }
                const vp = rec.viewport;
                const name = `${p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '')}__${vp}__${engine}.jpg`;
                if (process.env.SHOTS === '1' && fullShots.has(vp) && (engine === 'chromium' || vp === '390x844')) {
                    await page
                        .screenshot({ path: path.join(shotsDir, name), fullPage: true, type: 'jpeg', quality: 35 })
                        .catch(() => {});
                    rec.shot = name;
                }
                rec.thirdParty = [...rec.thirdParty];
                fs.appendFileSync(outJson, JSON.stringify(rec) + '\n');
                await ctx.close();
            } catch (err) {
                fs.appendFileSync(
                    outJson,
                    JSON.stringify({ engine, path: p, viewport: `${w}x${h}`, fatal: String(err).slice(0, 300) }) + '\n',
                );
            }
        }
    }
    await browser.close();
}
console.log('OK');
```

## `analyze-matrix.mjs`

```js
import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
console.log('registros:', r.length);
// Desbordamiento horizontal
const over = r.filter((x) => x.overflow?.hasHScroll);
console.log('\n== Scroll horizontal ==', over.length);
const byPath = {};
for (const x of over) {
    (byPath[x.path] ??= []).push(`${x.engine[0]}:${x.viewport}(${x.overflow.scrollWidth})`);
}
for (const [p, v] of Object.entries(byPath)) console.log(p, v.join(' '));
// Ofensores (sin scroll pero con elementos fuera) agrupados
const off = {};
for (const x of r.filter((y) => !y.fatal))
    for (const o of x.overflow?.offenders ?? []) {
        const k = `${x.path} | ${o.tag}.${o.cls.split(' ').slice(0, 3).join('.')} "${o.text}"`;
        (off[k] ??= new Set()).add(x.viewport.split('x')[0]);
    }
console.log('\n== Elementos que sobresalen del viewport (sin ancestro con overflow) ==');
for (const [k, v] of Object.entries(off).slice(0, 40))
    console.log(k, '→ anchos:', [...v].sort((a, b) => a - b).join(','));
// Consola
const cons = {};
for (const x of r.filter((y) => !y.fatal))
    for (const c of [...x.console, ...x.pageErrors.map((e) => 'PAGEERROR ' + e)]) {
        const k = c
            .replace(/\/_ipx\/[^"]+/g, '/_ipx/…')
            .replace(/gallery\/\d+/g, 'gallery/N')
            .slice(0, 160);
        (cons[k] ??= new Set()).add(`${x.engine}`);
    }
console.log('\n== Mensajes de consola (únicos) ==');
for (const [k, v] of Object.entries(cons)) console.log([...v].join(','), '|', k);
// Peticiones fallidas / 4xx
const bad = {};
for (const x of r.filter((y) => !y.fatal))
    for (const b of [...x.badStatus, ...x.failed]) {
        const k = b
            .replace(/\?.*$/, '')
            .replace(/_p=\d+/, '')
            .slice(0, 140);
        (bad[k] ??= new Set()).add(x.engine);
    }
console.log('\n== Peticiones fallidas o >=400 (únicas) ==');
for (const [k, v] of Object.entries(bad)) console.log([...v].join(','), '|', k);
// Navegación
const nav = r.filter((x) => x.navError);
console.log(
    '\n== Errores de navegación ==',
    nav.length,
    nav
        .slice(0, 5)
        .map((x) => `${x.engine} ${x.path} ${x.viewport} ${x.navError}`)
        .join('\n'),
);
// Terceros
const tp = new Set();
r.filter((y) => !y.fatal).forEach((x) => x.thirdParty.forEach((h) => tp.add(h)));
console.log('\n== Dominios de terceros ==', [...tp].join(', '));
// SEO DOM
console.log('\n== SEO DOM (chromium 1280) ==');
for (const x of r.filter((y) => y.engine === 'chromium' && y.viewport === '1280x800'))
    console.log(
        x.path,
        JSON.stringify({
            t: x.seo.title,
            h1: x.seo.h1,
            hs: x.seo.headings.join(''),
            noAlt: x.seo.imgsNoAlt.length,
            noDims: x.seo.imgsNoDims.length,
            ls: x.seo.ls,
        }),
    );
```

## `scenarios.mjs`

```js
// Escenarios funcionales: consentimiento/terceros, modal de proyecto + historial, metadatos, producción.
import { chromium } from 'playwright';
import fs from 'node:fs';

const [, , base, out] = process.argv;
const log = [];
const note = (k, v) => {
    log.push({ k, v });
    console.log(k, JSON.stringify(v).slice(0, 400));
};
const browser = await chromium.launch();

async function fresh(vp = { width: 1280, height: 800 }) {
    const ctx = await browser.newContext({ viewport: vp, locale: 'es-ES' });
    const page = await ctx.newPage();
    const ev = { console: [], errors: [], failed: [], hosts: new Set(), bad: [] };
    page.on('console', (m) => {
        if (['error', 'warning'].includes(m.type())) ev.console.push(`${m.type()}: ${m.text().slice(0, 250)}`);
    });
    page.on('pageerror', (e) => ev.errors.push(String(e).slice(0, 250)));
    page.on('requestfailed', (r) => ev.failed.push(`${r.failure()?.errorText} ${r.method()} ${r.url().slice(0, 160)}`));
    page.on('response', (r) => {
        if (r.status() >= 400) ev.bad.push(`${r.status()} ${r.request().method()} ${r.url().slice(0, 160)}`);
    });
    page.on('request', (r) => {
        try {
            ev.hosts.add(new URL(r.url()).host);
        } catch {
            /* */
        }
    });
    return { ctx, page, ev };
}
const dump = (ev) => ({
    console: ev.console.slice(0, 15),
    errors: ev.errors,
    failed: ev.failed.slice(0, 15),
    bad: ev.bad.slice(0, 15),
    hosts: [...ev.hosts],
});

// 1) Terceros y cookies ANTES del consentimiento, en home y contacto
for (const p of ['/', '/contact', '/projects']) {
    const { ctx, page, ev } = await fresh();
    await page.goto(base + p, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => note('nav-error', String(e)));
    await page.waitForTimeout(2500);
    const cookies = (await ctx.cookies()).map(
        (c) =>
            `${c.domain} ${c.name} exp=${c.expires > 0 ? new Date(c.expires * 1000).toISOString().slice(0, 10) : 'session'}`,
    );
    const banner = await page.evaluate(() => {
        const b = document.querySelector('.cookieControl__Bar, .cookieControl');
        return b ? b.innerText.replace(/\s+/g, ' ').slice(0, 300) : null;
    });
    const buttons = await page.$$eval('.cookieControl__Bar button, .cookieControl button', (bs) =>
        bs.map((b) => b.innerText.trim()).filter(Boolean),
    );
    note(`preconsent ${p}`, { cookies, banner, buttons, ...dump(ev) });
    await ctx.close();
}

// 2) Aceptar todas y ver qué cambia
{
    const { ctx, page, ev } = await fresh();
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    const btn = page.locator('.cookieControl__Bar button', { hasText: /Aceptar/i }).first();
    if (await btn.count()) {
        await btn.click();
        await page.waitForTimeout(3000);
    }
    const cookies = (await ctx.cookies()).map((c) => `${c.domain} ${c.name}`);
    const consent = await page.evaluate(() =>
        (window.dataLayer || []).filter((x) => x && x[0] === 'consent').map((x) => JSON.stringify([...x])),
    );
    note('postconsent-accept', { cookies, consent, hosts: [...ev.hosts] });
    // Revocar: abrir control y rechazar
    const ctrl = page.locator('.cookieControl__ControlButton');
    if (await ctrl.count()) {
        await ctrl.click();
        await page.waitForTimeout(800);
        const decline = page.locator('.cookieControl__Modal button', { hasText: /Rechazar|Decline/i }).first();
        if (await decline.count()) {
            await decline.click();
            await page.waitForTimeout(2000);
        }
        const cookies2 = (await ctx.cookies()).map((c) => `${c.domain} ${c.name}`);
        const consent2 = await page.evaluate(() =>
            (window.dataLayer || []).filter((x) => x && x[0] === 'consent').map((x) => JSON.stringify([...x])),
        );
        note('after-revoke', { cookies: cookies2, consent: consent2 });
    } else note('after-revoke', 'sin botón de control');
    await ctx.close();
}

// 3) Modal de proyecto, historial y bloqueo de scroll (solo si hay proyectos)
{
    const { ctx, page, ev } = await fresh();
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.goto(base + '/projects', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const cards = await page.locator('.box-grid-projects [class*="box-"]').count();
    note('projects-cards', { cards, h1: await page.locator('h1').allInnerTexts() });
    if (cards) {
        const target = page
            .locator('.box-grid-projects .box-vertical, .box-grid-projects .box-horizontal')
            .first()
            .locator('button, a, [role=button], img')
            .first();
        await target.click({ timeout: 5000 }).catch((e) => note('card-click-error', String(e).slice(0, 200)));
        await page.waitForTimeout(3000);
        const st1 = await page.evaluate(() => ({
            url: location.pathname,
            title: document.title,
            bodyClass: document.body.className,
            modal: !!document.querySelector('.modal-project-show'),
            focus: document.activeElement?.className?.toString().slice(0, 60),
            histState: JSON.stringify(history.state).slice(0, 120),
            metaDesc: document.querySelector('meta[name=description]')?.content?.slice(0, 80),
            ogUrl: document.querySelector('meta[property="og:url"]')?.content,
        }));
        note('modal-open', st1);
        // Tab dentro del modal: ¿se escapa el foco?
        const tabs = [];
        for (let i = 0; i < 6; i++) {
            await page.keyboard.press('Tab');
            tabs.push(
                await page.evaluate(() => {
                    const a = document.activeElement;
                    return `${a.tagName.toLowerCase()}.${(a.className || '').toString().slice(0, 30)} inModal=${!!a.closest('.modal-project-show')}`;
                }),
            );
        }
        note('modal-tab-order', tabs);
        // Botón atrás del navegador con el modal abierto
        await page.goBack();
        await page.waitForTimeout(2500);
        const st2 = await page.evaluate(() => ({
            url: location.pathname,
            title: document.title,
            bodyClass: document.body.className,
            modal: !!document.querySelector('.modal-project-show'),
            scrollH: document.documentElement.scrollHeight,
            canScroll: (() => {
                window.scrollTo(0, 400);
                return window.scrollY;
            })(),
        }));
        note('after-back-1', st2);
        await page.goBack();
        await page.waitForTimeout(2500);
        const st3 = await page.evaluate(() => ({
            url: location.pathname,
            title: document.title,
            bodyClass: document.body.className,
            ogUrl: document.querySelector('meta[property="og:url"]')?.content,
            desc: document.querySelector('meta[name=description]')?.content?.slice(0, 80),
            canScroll: (() => {
                window.scrollTo(0, 400);
                return window.scrollY;
            })(),
        }));
        note('after-back-2', st3);
        // Escape cierra modal: ¿URL y meta se restauran?
        await page.goto(base + '/projects', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
        await page
            .locator('.box-grid-projects .box-vertical, .box-grid-projects .box-horizontal')
            .first()
            .locator('button, a, [role=button], img')
            .first()
            .click()
            .catch(() => {});
        await page.waitForTimeout(2500);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(800);
        note(
            'after-escape',
            await page.evaluate(() => ({
                url: location.pathname,
                title: document.title,
                bodyClass: document.body.className,
                modal: !!document.querySelector('.modal-project-show'),
            })),
        );
        // Navegación a otra página tras abrir proyecto: ¿meta residuales?
        await page
            .locator('header a[href="/about"]')
            .first()
            .click()
            .catch(() => {});
        await page.waitForTimeout(2000);
        note(
            'about-after-project',
            await page.evaluate(() => ({
                url: location.pathname,
                title: document.title,
                ogUrl: [...document.querySelectorAll('meta[property="og:url"]')].map((m) => m.content),
                ogImage: [...document.querySelectorAll('meta[property="og:image"]')].map((m) => m.content),
                keywords: document.querySelector('meta[name=keywords]')?.content?.slice(0, 60),
                bodyClass: document.body.className,
            })),
        );
    }
    // Deep link directo a un proyecto
    await page.goto(base + '/projects/weather-station-raspberry-pi', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    note(
        'deeplink-project',
        await page.evaluate(() => ({
            url: location.pathname,
            title: document.title,
            modal: !!document.querySelector('.modal-project-show'),
            modalTitle: document.querySelector('.modal-project-title-page')?.textContent?.trim(),
            blocks: document.querySelectorAll('.modal-project-show-body-content > *').length,
        })),
    );
    await page
        .goto(base + '/projects/proyecto-inexistente-xyz', { waitUntil: 'networkidle' })
        .then((r) => note('nonexistent-status', r?.status()))
        .catch(() => {});
    await page.waitForTimeout(2500);
    note(
        'nonexistent-project',
        await page.evaluate(() => ({
            url: location.pathname,
            title: document.title,
            h1: [...document.querySelectorAll('h1')].map((h) => h.innerText),
            modal: !!document.querySelector('.modal-project-show'),
        })),
    );
    note('scenario3-events', dump(ev));
    await ctx.close();
}

// 4) Menú móvil y teclado
{
    const { ctx, page } = await fresh({ width: 375, height: 667 });
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    const firstTabs = [];
    for (let i = 0; i < 4; i++) {
        await page.keyboard.press('Tab');
        firstTabs.push(
            await page.evaluate(() => {
                const a = document.activeElement;
                return `${a.tagName.toLowerCase()} "${(a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30)}"`;
            }),
        );
    }
    note('first-tabs-mobile', firstTabs);
    await page.locator('button[aria-controls="mobile-menu"]').click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    note('mobile-menu-escape', { stillOpen: await page.locator('#mobile-menu').count() });
    await ctx.close();
}

fs.writeFileSync(out, JSON.stringify(log, null, 1));
await browser.close();
```

## `prod-check.mjs`

```js
// Comprobación pasiva de producción: errores de consola, peticiones fallidas y estado visible.
import { chromium } from 'playwright';
import fs from 'node:fs';
const out = process.argv[2];
const browser = await chromium.launch();
const res = [];
for (const p of [
    '/',
    '/projects/',
    '/projects/weather-station-raspberry-pi/',
    '/about/',
    '/contact/',
    '/no-existe-auditoria/',
]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
    const page = await ctx.newPage();
    const ev = { console: [], errors: [], failed: [], bad: [], hosts: new Set() };
    page.on('console', (m) => {
        if (['error', 'warning'].includes(m.type())) ev.console.push(`${m.type()}: ${m.text().slice(0, 220)}`);
    });
    page.on('pageerror', (e) => ev.errors.push(String(e).slice(0, 220)));
    page.on('requestfailed', (r) => ev.failed.push(`${r.failure()?.errorText} ${r.method()} ${r.url().slice(0, 150)}`));
    page.on('response', (r) => {
        if (r.status() >= 300 && r.status() !== 304)
            ev.bad.push(`${r.status()} ${r.request().method()} ${r.url().slice(0, 150)}`);
    });
    page.on('request', (r) => {
        try {
            ev.hosts.add(new URL(r.url()).host);
        } catch {
            /* */
        }
    });
    const r = await page
        .goto('https://raupulus.dev' + p, { waitUntil: 'networkidle', timeout: 45000 })
        .catch((e) => ({ status: () => String(e).slice(0, 80) }));
    await page.waitForTimeout(3000);
    const state = await page.evaluate(() => ({
        title: document.title,
        h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim().slice(0, 60)),
        visibleText: document.body.innerText.replace(/\s+/g, ' ').slice(0, 300),
        projectCards: document.querySelectorAll('[class*="project"]').length,
        techImgs: document.querySelectorAll('img[src*="technolog"], img[alt*="Tecnolog"]').length,
        cvLink: [...document.querySelectorAll('a')].map((a) => a.href).filter((h) => /cv|curriculum/i.test(h)),
    }));
    if (p === '/projects/')
        await page.screenshot({
            path: out.replace('.json', '-projects.jpg'),
            fullPage: false,
            type: 'jpeg',
            quality: 50,
        });
    res.push({
        path: p,
        status: r?.status?.(),
        ...state,
        console: ev.console.slice(0, 12),
        errors: ev.errors.slice(0, 6),
        failed: ev.failed.slice(0, 12),
        redirectsOrErrors: ev.bad.slice(0, 15),
        hosts: [...ev.hosts],
    });
    await ctx.close();
    await new Promise((r) => setTimeout(r, 1500));
}
fs.writeFileSync(out, JSON.stringify(res, null, 1));
await browser.close();
console.log(JSON.stringify(res, null, 1).slice(0, 9000));
```

## `axe.mjs`

```js
// axe-core (WCAG 2.0/2.1/2.2 A y AA) por ruta y estado.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'node:fs';

const [, , base, out] = process.argv;
const paths = ['/', '/projects', '/about', '/webs', '/social', '/contact', '/privacy', '/blog'];
const browser = await chromium.launch();
const results = [];
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function run(label, vp, prepare) {
    const ctx = await browser.newContext({ viewport: vp, locale: 'es-ES' });
    const page = await ctx.newPage();
    try {
        await prepare(page);
        const r = await new AxeBuilder({ page }).withTags(tags).analyze();
        results.push({
            label,
            viewport: `${vp.width}x${vp.height}`,
            violations: r.violations.map((v) => ({
                id: v.id,
                impact: v.impact,
                tags: v.tags.filter((t) => t.startsWith('wcag')),
                help: v.help,
                nodes: v.nodes.length,
                sample: v.nodes
                    .slice(0, 3)
                    .map((n) => ({ target: n.target.join(' '), summary: (n.failureSummary || '').slice(0, 200) })),
            })),
            incomplete: r.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        });
    } catch (e) {
        results.push({ label, error: String(e).slice(0, 300) });
    }
    await ctx.close();
    process.stdout.write('.');
}

for (const p of paths) {
    for (const vp of [
        { width: 1280, height: 800 },
        { width: 390, height: 844 },
    ]) {
        await run(`${p} inicial`, vp, async (page) => {
            await page.goto(base + p, { waitUntil: 'load' });
            await page.waitForTimeout(2500);
        });
    }
}
await run('/ menú móvil abierto', { width: 390, height: 844 }, async (page) => {
    await page.goto(base + '/', { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    await page.locator('button[aria-controls="mobile-menu"]').click();
    await page.waitForTimeout(600);
});
await run('/projects modal abierto', { width: 1280, height: 800 }, async (page) => {
    await page.goto(base + '/projects/weather-station-raspberry-pi', { waitUntil: 'load' });
    await page.waitForTimeout(4000);
});
await run('/about galería abierta', { width: 1280, height: 800 }, async (page) => {
    await page.goto(base + '/about', { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    await page.locator('button[aria-label^="Ampliar imagen 1"]').click();
    await page.waitForTimeout(1000);
});
await run('/contact formulario con errores', { width: 1280, height: 800 }, async (page) => {
    await page.goto(base + '/contact', { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: /Enviar Mensaje/i }).click();
    await page.waitForTimeout(600);
});
await run('/contact modal de confirmación', { width: 1280, height: 800 }, async (page) => {
    await page.goto(base + '/contact', { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    await page.fill('#name', 'Persona de Prueba');
    await page.fill('#email', ['prueba', 'example.com'].join('@')); // dominio reservado RFC 2606, nunca se envía await page.fill('#subject', 'Asunto de prueba largo');
    await page.locator('[role=textbox][contenteditable]').click();
    await page.keyboard.type('Mensaje de prueba con más de treinta caracteres para validar.');
    await page.check('#privacity');
    await page.getByRole('button', { name: /Enviar Mensaje/i }).click();
    await page.waitForTimeout(800);
});
fs.writeFileSync(out, JSON.stringify(results, null, 1));
await browser.close();
console.log('\nOK', results.length);
```

## `poc-sanitize.mjs`

```js
// PoC local: misma configuración que utils/sanitize.ts (isomorphic-dompurify)
import DOMPurify from 'isomorphic-dompurify';
const cfgHtml = {
    ALLOWED_TAGS: [
        'p',
        'br',
        'b',
        'i',
        'em',
        'strong',
        'a',
        'ul',
        'ol',
        'li',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'code',
        'pre',
        'span',
        'div',
        'img',
        'figure',
        'figcaption',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'mark',
        'del',
        'ins',
        'sub',
        'sup',
        'hr',
        'dl',
        'dt',
        'dd',
    ],
    ALLOWED_ATTR: [
        'href',
        'target',
        'rel',
        'src',
        'alt',
        'title',
        'class',
        'id',
        'width',
        'height',
        'style',
        'colspan',
        'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
};
const cfgRaw = {
    ADD_TAGS: ['iframe', 'video', 'audio', 'source'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'autoplay', 'controls', 'loop', 'muted'],
    ALLOW_DATA_ATTR: false,
};
const payloads = {
    script: '<script>alert(1)</script>',
    'img onerror': '<img src=x onerror=alert(1)>',
    'a javascript:': '<a href="javascript:alert(1)">x</a>',
    'style overlay (suplantación visual)':
        '<div style="position:fixed;inset:0;z-index:9999;background:#fff">Falso aviso: introduce tu contraseña</div>',
    'target _blank sin rel': '<a href="https://evil.example" target="_blank">x</a>',
    'id clobbering': '<img id="__NUXT__" src="x"><a id="location" href="https://evil.example">x</a>',
    'iframe arbitrario (raw)':
        '<iframe src="https://evil.example/phish" style="position:fixed;inset:0;width:100vw;height:100vh;border:0"></iframe>',
    'iframe javascript: (raw)': '<iframe src="javascript:alert(document.domain)"></iframe>',
    'iframe srcdoc (raw)': '<iframe srcdoc="<script>parent.alert(1)</script>"></iframe>',
    'código HTML en BlockCode':
        '&lt;div class="x"&gt; vs <div class="x">hola</div> <?php echo 1; ?> <script>let a=1</script>',
};
for (const [k, v] of Object.entries(payloads)) {
    console.log(
        `\n# ${k}\n  entrada : ${v}\n  html    : ${DOMPurify.sanitize(v, cfgHtml)}\n  raw     : ${DOMPurify.sanitize(v, cfgRaw)}`,
    );
}
```

## `contrast.mjs`

```js
const hex = (h) =>
    h
        .replace('#', '')
        .match(/../g)
        .map((x) => parseInt(x, 16) / 255);
const lum = (c) => {
    const [r, g, b] = hex(c).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const blend = (fg, a, bg) =>
    '#' +
    hex(fg)
        .map((v, i) =>
            Math.round((v * a + hex(bg)[i] * (1 - a)) * 255)
                .toString(16)
                .padStart(2, '0'),
        )
        .join('');
const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return ((x + 0.05) / (y + 0.05)).toFixed(2);
};
const T = {
    background: '#091421',
    'surface-container-lowest': '#050f1c',
    'surface-container-low': '#121c2a',
    'surface-container': '#16202e',
    'surface-container-high': '#212b39',
    'surface-container-highest': '#2b3544',
};
const F = {
    'on-surface': '#d9e3f6',
    'on-surface-variant': '#c1c7d2',
    primary: '#a3c9ff',
    secondary: '#ffb691',
    tertiary: '#4cd6ff',
    outline: '#8b919c',
    'outline-variant': '#414751',
    error: '#ffb4ab',
    'primary-container': '#3272b8',
};
console.log('| Texto \\ Fondo | ' + Object.keys(T).join(' | ') + ' |');
console.log('|' + '---|'.repeat(Object.keys(T).length + 1));
for (const [fn, fv] of Object.entries(F))
    console.log(
        `| ${fn} | ` +
            Object.values(T)
                .map((bv) => {
                    const r = ratio(fv, bv);
                    return (r >= 4.5 ? '' : r >= 3 ? '⚠️ ' : '❌ ') + r;
                })
                .join(' | ') +
            ' |',
    );
console.log('\nPares especiales:');
console.log('on-primary sobre primary (botones):', ratio('#00315c', '#a3c9ff'));
console.log('on-primary sobre primary-container (hover/gradiente):', ratio('#00315c', '#3272b8'));
console.log('outline-variant sobre background (footer):', ratio('#414751', '#091421'));
console.log('outline sobre surface-container-high (labels formulario):', ratio('#8b919c', '#212b39'));
console.log(
    'primary/20 icono decorativo sobre surface-container-high:',
    ratio(blend('#a3c9ff', 0.2, '#212b39'), '#212b39'),
);
console.log('Modal proyecto: #f1f1f1 sobre var(--primary)#3272B8 título:', ratio('#f1f1f1', '#3272b8'));
console.log('Modal proyecto: texto #222 sobre #f1f1f1:', ratio('#222222', '#f1f1f1'));
console.log('Cookie banner: #fff sobre #000:', ratio('#ffffff', '#000000'));
console.log('placeholder outline sobre surface-container-lowest:', ratio('#8b919c', '#050f1c'));
console.log('error sobre surface-container-high:', ratio('#ffb4ab', '#212b39'));
console.log(
    'outline-variant (borde inputs) sobre surface-container-lowest (no-texto 3:1):',
    ratio('#414751', '#050f1c'),
);
```

## `headinfo.mjs`

```js
import fs from 'node:fs';
for (const f of process.argv.slice(2)) {
    const h = fs.readFileSync(f, 'utf8');
    const all = (re) => [...h.matchAll(re)].map((m) => m[1]);
    const title = all(/<title>([^<]*)<\/title>/g);
    const desc = all(/<meta name="description" content="([^"]*)"/g);
    const canon = all(/<link rel="canonical" href="([^"]*)"/g);
    const ogimg = all(/<meta property="og:image" content="([^"]*)"/g);
    const ogurl = all(/<meta property="og:url" content="([^"]*)"/g);
    const tw = all(/<meta name="twitter:card" content="([^"]*)"/g);
    const robots = all(/<meta name="robots" content="([^"]*)"/g);
    const h1 = all(/<h1[^>]*>([\s\S]*?)<\/h1>/g).map((x) =>
        x
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim(),
    );
    const ld = (h.match(/application\/ld\+json/g) || []).length;
    const text = h
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<style[\s\S]*?<\/style>/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ');
    console.log(
        JSON.stringify({
            f: f.split('/').pop(),
            bytes: h.length,
            title,
            descN: desc.length,
            desc0: (desc[0] || '').slice(0, 70),
            canon,
            ogurl,
            ogimg,
            tw,
            robots,
            h1,
            ld,
            words: text.split(' ').length,
        }),
    );
}
```

## `bundle.mjs`

```js
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
const root = process.argv[2];
const br = (b) => zlib.brotliCompressSync(b).length,
    gz = (b) => zlib.gzipSync(b).length;
const kb = (n) => (n / 1024).toFixed(1);
let tot = { raw: 0, br: 0 };
const files = fs.readdirSync(path.join(root, '_nuxt')).filter((f) => fs.statSync(path.join(root, '_nuxt', f)).isFile());
const rows = files
    .map((f) => {
        const b = fs.readFileSync(path.join(root, '_nuxt', f));
        return { f, raw: b.length, br: br(b) };
    })
    .sort((a, b) => b.raw - a.raw);
for (const r of rows) {
    tot.raw += r.raw;
    tot.br += r.br;
}
console.log('TOTAL _nuxt:', files.length, 'archivos', kb(tot.raw), 'KB raw', kb(tot.br), 'KB br');
console.log('Top 8:');
rows.slice(0, 8).forEach((r) => console.log(' ', r.f, kb(r.raw), 'KB raw /', kb(r.br), 'KB br'));
for (const page of ['index.html', 'projects/index.html', 'contact/index.html', 'about/index.html']) {
    const h = fs.readFileSync(path.join(root, page), 'utf8');
    const js = [...new Set([...h.matchAll(/(?:src|href)="(\/_nuxt\/[^"]+\.js)"/g)].map((m) => m[1]))];
    const css = [...new Set([...h.matchAll(/href="(\/_nuxt\/[^"]+\.css)"/g)].map((m) => m[1]))];
    const sum = (arr) =>
        arr.reduce(
            (a, f) => {
                const b = fs.readFileSync(path.join(root, f));
                return { raw: a.raw + b.length, br: a.br + br(b) };
            },
            { raw: 0, br: 0 },
        );
    const sj = sum(js),
        sc = sum(css);
    const hb = Buffer.from(h);
    const inlineStyle = [...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((a, m) => a + m[1].length, 0);
    console.log(
        `${page}: HTML ${kb(hb.length)} KB (${kb(br(hb))} br, CSS inline ${kb(inlineStyle)} KB) | JS inicial ${js.length} archivos ${kb(sj.raw)} KB raw / ${kb(sj.br)} KB br | CSS ${css.length} ${kb(sc.raw)} KB raw`,
    );
}
```

## `lh.sh`

```bash
#!/bin/bash
# Lighthouse: N ejecuciones por URL y estrategia; guarda JSON resumido de cada ejecución.
# Uso: lh.sh <etiqueta> <runs> <url>...
SP=/private/tmp/claude-501/-Users-fryntiz-git-3-Raupulus-www-raupulus-dev/b30b5516-d078-4d27-954d-d0d1132b3426/scratchpad
OUT=$SP/lh; mkdir -p $OUT
label=$1; runs=$2; shift 2
export TMPDIR=$SP/tmpff
for url in "$@"; do
  slug=$(echo "$url" | sed -E 's#https?://##; s#[/:.]+#_#g; s#_$##')
  for strat in mobile desktop; do
    for i in $(seq 1 $runs); do
      f=$OUT/${label}__${slug}__${strat}__$i.json
      [ -s "$f" ] && continue
      extra=""; [ "$strat" = desktop ] && extra="--preset=desktop"
      npx lighthouse "$url" $extra --output=json --output-path="$f" --quiet --chrome-flags="--headless=new --no-first-run" --max-wait-for-load=45000 >/dev/null 2>>$OUT/errors.log || echo "fallo $f" >> $OUT/errors.log
      sleep 2
    done
  done
done
echo "hecho $label"
```
