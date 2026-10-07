#!/usr/bin/env bash
# ==============================================================================
# Health-check script para verificar endpoints de Laravel REST API V2
# ==============================================================================
set -euo pipefail

API_BASE="${API_BASE_URL:-https://api.raupulus.dev/api/v2}"
API_DOMAIN="${API_DOMAIN_URL:-https://api.raupulus.dev}"

echo "=================================================="
echo "Comprobando salud de la API: $API_BASE"
echo "=================================================="

PASS_COUNT=0
FAIL_COUNT=0

check_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="$3"
  local check_json="${4:-true}"

  printf "%-45s ... " "$name"
  
  local response
  local http_code
  local body

  response=$(curl -sS -w "\n%{http_code}" "$url" || echo -e "\n000")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -eq "$expected_status" ]; then
    if [ "$check_json" = "true" ]; then
      if echo "$body" | grep -q '"success":true'; then
        echo -e "\033[32mOK (HTTP $http_code, success=true)\033[0m"
        PASS_COUNT=$((PASS_COUNT + 1))
      else
        echo -e "\033[33mAVISO (HTTP $http_code pero no contiene success=true)\033[0m"
        PASS_COUNT=$((PASS_COUNT + 1))
      fi
    else
      echo -e "\033[32mOK (HTTP $http_code)\033[0m"
      PASS_COUNT=$((PASS_COUNT + 1))
    fi
  else
    echo -e "\033[31mFALLO (esperado $expected_status, obtenido $http_code)\033[0m"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

# 1. CSRF Cookie de Sanctum
check_endpoint "Sanctum CSRF Cookie" "$API_DOMAIN/sanctum/csrf-cookie" 204 false

# 2. Datos de la plataforma
check_endpoint "Plataforma Portfolio" "$API_BASE/platforms/portfolio" 200 true

# 3. Listado de contenidos tipo proyecto
check_endpoint "Listado de Proyectos" "$API_BASE/platforms/portfolio/contents?type=project&limit=3" 200 true

echo "=================================================="
echo "Resultados: $PASS_COUNT exitosos, $FAIL_COUNT fallidos"
echo "=================================================="

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
