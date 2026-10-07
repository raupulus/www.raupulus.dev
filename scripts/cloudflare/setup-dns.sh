#!/usr/bin/env bash
# ==============================================================================
# Script de configuración de seguridad perimetral en Cloudflare para raupulus.dev
# Configura TLS 1.3, Always Use HTTPS, Automatic HTTPS Rewrites y HSTS
# ==============================================================================
set -euo pipefail

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] || [ -z "${CLOUDFLARE_ZONE_ID:-}" ]; then
  echo "Error: Se requieren las variables de entorno CLOUDFLARE_API_TOKEN y CLOUDFLARE_ZONE_ID" >&2
  echo "Uso: CLOUDFLARE_API_TOKEN='...' CLOUDFLARE_ZONE_ID='...' ./scripts/cloudflare/setup-dns.sh" >&2
  exit 1
fi

CF_API="https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID"
AUTH_HEADER="Authorization: Bearer $CLOUDFLARE_API_TOKEN"

echo "=== 1. Activando 'Always Use HTTPS' ==="
curl -fsS -X PATCH "$CF_API/settings/always_use_https" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data '{"value":"on"}' | grep -q '"success":true' && echo "✓ Always Use HTTPS activado" || echo "✗ Fallo al activar Always Use HTTPS"

echo "=== 2. Configurando versión mínima de TLS a 1.3 ==="
curl -fsS -X PATCH "$CF_API/settings/min_tls_version" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data '{"value":"1.3"}' | grep -q '"success":true' && echo "✓ TLS mínimo 1.3 fijado" || echo "✗ Fallo al fijar TLS 1.3"

echo "=== 3. Activando Automatic HTTPS Rewrites ==="
curl -fsS -X PATCH "$CF_API/settings/automatic_https_rewrites" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data '{"value":"on"}' | grep -q '"success":true' && echo "✓ Automatic HTTPS Rewrites activado" || echo "✗ Fallo al activar Automatic HTTPS Rewrites"

echo "=== 4. Configurando HSTS (Strict-Transport-Security con preload) ==="
curl -fsS -X PATCH "$CF_API/settings/security_header" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data '{
    "value": {
      "strict_transport_security": {
        "enabled": true,
        "max_age": 63072000,
        "include_subdomains": true,
        "nosniff": true
      }
    }
  }' | grep -q '"success":true' && echo "✓ HSTS configurado (max-age=63072000, subdomains, nosniff)" || echo "✗ Fallo al configurar HSTS"

echo ""
echo "Configuración perimetral en Cloudflare completada con éxito."
