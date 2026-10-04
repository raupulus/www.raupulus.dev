# Scripts auxiliares y comandos reproducibles — Auditoría externa deepsek-externo

Todos los comandos se ejecutaron desde la raíz del repositorio. No se instaló nada en `package.json`; las
herramientas se usaron con `npx --yes` (Lighthouse) o las ya presentes en el proyecto.

## Entorno y estado

```bash
date +%F
git rev-parse HEAD && git branch --show-current && git status --porcelain
node -v && pnpm -v
curl -sSI https://raupulus.dev/
curl -sSI https://api.raupulus.dev/
```

## Puertas de calidad (pnpm)

```bash
pnpm run lint          # 0 errores, 38 warnings → evidencias/build/lint.txt
pnpm exec vue-tsc --noEmit   # 0 errores → evidencias/build/vue-tsc.txt
pnpm run test:run      # 45 tests OK → evidencias/build/test-run.txt
pnpm run test:coverage # FALLA: falta @vitest/coverage-v8 → evidencias/build/coverage.txt
pnpm run generate      # 212 rutas → evidencias/build/generate.txt
```

## Servir el build sin fallback SPA

```bash
npx --yes serve@14 .output/public -l 4173
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:4173/
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:4173/no-existe-xyz   # 404 (real)
```

## Dependencias

```bash
pnpm audit --json > evidencias/dependencias/pnpm-audit.json
pnpm outdated -r  > evidencias/dependencias/outdated.txt
```

## Producción (pasivo, bajo volumen)

```bash
# Soft-404: todas devuelven 200 con la portada
for p in "no-existe-$(date +%s)" ".env" ".git/HEAD" "package.json" "cachedRoutes.json" ".well-known/security.txt"; do
  printf "/%s -> " "$p"; curl -sS -o /dev/null -w "%{http_code}\n" "https://raupulus.dev/$p"
done

# Cabeceras
curl -sSI https://raupulus.dev/ | grep -iE "content-security|x-content|x-frame|referrer|permissions|strict-transport"
curl -sSI https://api.raupulus.dev/ | grep -iE "set-cookie|access-control"

# DNS/TLS
dig +short A raupulus.dev; dig +short AAAA raupulus.dev
dig +short CAA raupulus.dev
dig +short TXT raupulus.dev; dig +short TXT _dmarc.raupulus.dev
openssl s_client -connect raupulus.dev:443 -servername raupulus.dev </dev/null 2>/dev/null \
  | openssl x509 -noout -dates -issuer -subject
```

## Lighthouse (1 ejecución por URL/estrategia)

```bash
npx --yes lighthouse https://raupulus.dev/ \
  --output=json --output-path=evidencias/lighthouse/prod-home-mobile.json \
  --chrome-flags="--headless=new --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo
# (idéntico con --preset=desktop para escritorio; resto de URLs en evidencias/lighthouse/)
```

## PoC de sanitización (SEC-003 / SEC-004)

Ejecutado con el `isomorphic-dompurify` del propio proyecto (sin instalar nada):

```bash
node --input-type=module -e '
import DOMPurify from "isomorphic-dompurify";
const cfg={ALLOWED_TAGS:["p","br","a","span","div","img","table","thead","tbody","tr","th","td"],
  ALLOWED_ATTR:["href","target","rel","src","alt","title","class","id","width","height","style","colspan","rowspan"],
  ALLOW_DATA_ATTR:false};
const raw={ADD_TAGS:["iframe","video","audio","source"],
  ADD_ATTR:["allow","allowfullscreen","frameborder","scrolling","autoplay","controls","loop","muted"],
  ALLOW_DATA_ATTR:false};
const t=["<a href=\"javascript:alert(1)\">x</a>","<img src=x onerror=alert(1)>",
  "<div style=\"position:fixed;inset:0;z-index:99999\">overlay</div>",
  "<span id=\"__nuxt\">clobber</span>","<a href=\"https://x\" target=\"_blank\">t</a>"];
for(const s of t){console.log(DOMPurify.sanitize(s,cfg));}
console.log(DOMPurify.sanitize("<iframe src=\"https://evil.example\"></iframe>",raw));
'
```

## Inspección del build

```bash
find .output/public -name "*.html" | wc -l                  # 44
grep -oE '/projects/[a-z0-9-]+' .output/public/projects/index.html | sort -u | wc -l   # 0 (SEO-001)
grep -oE '<link rel="canonical"[^>]*>' .output/public/index.html
grep -oE '/_nuxt/[A-Za-z0-9_.-]+\.js' .output/public/index.html | sort -u   # JS inicial (PERF-001)
grep -rEIl "localhost|127\.0\.0\.1" .output/public | head    # config local del build (esperado)
```

## Secretos

```bash
grep -rInE 'AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY|sk_live_|ghp_[A-Za-z0-9]{20,}' \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.output --exclude-dir=.nuxt .   # 0
git log --all --diff-filter=A --name-only --pretty=format: | grep -E '\.env'   # solo .env.example
git log --all --format='%ae%n%ce' | sort -u | sed -E 's/.*@/@/' | sort | uniq -c   # @gmail.com presente
```
