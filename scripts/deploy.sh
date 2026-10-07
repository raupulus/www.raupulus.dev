#!/bin/bash
set -euo pipefail

# Variables
DEPLOY_BASE="/var/www"
RELEASES_DIR="$DEPLOY_BASE/releases"
SYMLINK_PATH="$DEPLOY_BASE/public/www.raupulus.dev"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_PATH="$RELEASES_DIR/www.raupulus.dev_$TIMESTAMP"
BACKUP_DIR="$DEPLOY_BASE/backups/www.raupulus.dev"

echo "=== Iniciando despliegue atómico de www.raupulus.dev ==="

# Generar el sitio estático
echo "Instalando dependencias y generando sitio estático..."
corepack enable pnpm || true
pnpm install --frozen-lockfile
NODE_ENV=production pnpm generate
node scripts/assemble-static.mjs

# Verificar integridad del build estático
if [ ! -f .output/public/index.html ]; then
    echo "❌ Error fatal: .output/public/index.html no existe." >&2
    exit 1
fi

CSS_COUNT=$(find .output/public/_nuxt -name "*.css" 2>/dev/null | wc -l || echo 0)
JS_COUNT=$(find .output/public/_nuxt -name "*.js" 2>/dev/null | wc -l || echo 0)
if [ "$CSS_COUNT" -eq 0 ] || [ "$JS_COUNT" -eq 0 ]; then
    echo "❌ Error fatal: No se han encontrado bundles CSS ($CSS_COUNT) o JS ($JS_COUNT) en .output/public/_nuxt." >&2
    exit 1
fi

FONTS_COUNT=$(find .output/public/_fonts -name "*.woff2" 2>/dev/null | wc -l || echo 0)
if [ "$FONTS_COUNT" -eq 0 ]; then
    echo "❌ Error fatal: No se han encontrado fuentes en .output/public/_fonts." >&2
    exit 1
fi

ROUTES_COUNT=$(find .output/public/projects -name "index.html" 2>/dev/null | wc -l || echo 0)
if [ "$ROUTES_COUNT" -le 1 ] && [ -z "${ALLOW_EMPTY_PROJECTS:-}" ]; then
    echo "❌ Error fatal: El build estático no contiene rutas de proyectos ($ROUTES_COUNT encontradas)." >&2
    exit 1
fi
echo "✅ Build verificado: $ROUTES_COUNT páginas de proyectos, $CSS_COUNT bundles CSS, $JS_COUNT bundles JS y $FONTS_COUNT fuentes."

# Crear directorio de release
echo "Creando release en $RELEASE_PATH..."
mkdir -p "$RELEASES_DIR"
mkdir -p "$BACKUP_DIR"

# Guardar referencia del target anterior si existe
PREV_RELEASE=""
if [ -L "$SYMLINK_PATH" ]; then
    PREV_RELEASE=$(readlink "$SYMLINK_PATH" || true)
fi

# Copiar archivos a la nueva release
rsync -avz --delete .output/public/ "$RELEASE_PATH/"

# Conmutar enlace simbólico de forma atómica
echo "Conmutando enlace simbólico a la nueva release..."
ln -sfn "$RELEASE_PATH" "${SYMLINK_PATH}_tmp"
mv -Tf "${SYMLINK_PATH}_tmp" "$SYMLINK_PATH"

# Purgar caché de Cloudflare si se dispone de credenciales
if [ -n "${CLOUDFLARE_ZONE_ID:-}" ] && [ -n "${CLOUDFLARE_API_TOKEN:-}" ]; then
    echo "Purgando caché de Cloudflare..."
    curl -fsS -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}' || echo "⚠️ Aviso: No se pudo purgar la caché de Cloudflare"
fi

# Smoke tests de múltiples rutas
echo "Ejecutando smoke tests de producción..."
FAILED_TESTS=0

check_status() {
    local url="$1"
    local expected="$2"
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    if [ "$code" = "$expected" ]; then
        echo "  [OK] $url -> HTTP $code"
    else
        echo "  [FALLO] $url -> esperado $expected, obtenido $code" >&2
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

check_status "https://raupulus.dev/" "200"
check_status "https://raupulus.dev/about/" "200"
check_status "https://raupulus.dev/projects/" "200"
check_status "https://raupulus.dev/sitemap.xml" "200"
check_status "https://raupulus.dev/favicon.ico" "200"

SAMPLE_CSS=$(find "$RELEASE_PATH/_nuxt" -name "*.css" 2>/dev/null | head -n 1 | xargs -n 1 basename || true)
if [ -n "$SAMPLE_CSS" ]; then
    check_status "https://raupulus.dev/_nuxt/$SAMPLE_CSS" "200"
fi

SAMPLE_FONT=$(find "$RELEASE_PATH/_fonts" -name "*.woff2" 2>/dev/null | head -n 1 | xargs -n 1 basename || true)
if [ -n "$SAMPLE_FONT" ]; then
    check_status "https://raupulus.dev/_fonts/$SAMPLE_FONT" "200"
fi

check_status "https://raupulus.dev/non-existent-probe-route-404" "404"

if [ "$FAILED_TESTS" -eq 0 ]; then
    echo "✅ Todos los smoke tests han pasado con éxito"

    # Limpiar releases antiguas (mantener las 5 más recientes)
    ls -dt "$RELEASES_DIR"/www.raupulus.dev_* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
    echo "=== Despliegue completado con éxito ==="
else
    echo "❌ Error en smoke tests ($FAILED_TESTS fallos). Ejecutando rollback..." >&2
    if [ -n "$PREV_RELEASE" ] && [ -d "$PREV_RELEASE" ]; then
        ln -sfn "$PREV_RELEASE" "${SYMLINK_PATH}_tmp"
        mv -Tf "${SYMLINK_PATH}_tmp" "$SYMLINK_PATH"
        echo "✅ Rollback ejecutado a $PREV_RELEASE"
    fi
    exit 1
fi
