#!/bin/bash
set -e

# Variables
DEPLOY_DIR="/var/www/public/www.raupulus.dev"
BACKUP_DIR="/var/www/backups/www.raupulus.dev"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== Iniciando despliegue de www.raupulus.dev ==="

# Crear backup del directorio actual
echo "Creando backup..."
mkdir -p "$BACKUP_DIR"
if [ -d "$DEPLOY_DIR/.output/public" ]; then
    cp -r "$DEPLOY_DIR/.output/public" "$BACKUP_DIR/public_$TIMESTAMP"
fi

# Generar el sitio
echo "Generando sitio estático..."
npm ci
npm run generate

# Copiar archivos generados
echo "Desplegando archivos..."
rsync -avz --delete .output/public/ "$DEPLOY_DIR/.output/public/"

# Verificar despliegue
echo "Verificando despliegue..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://raupulus.dev)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Despliegue exitoso (HTTP $HTTP_CODE)"

    # Limpiar backups antiguos (mantener últimos 5)
    ls -dt "$BACKUP_DIR"/public_* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
else
    echo "❌ Error en despliegue (HTTP $HTTP_CODE)"
    echo "Restaurando backup..."
    if [ -d "$BACKUP_DIR/public_$TIMESTAMP" ]; then
        rsync -avz --delete "$BACKUP_DIR/public_$TIMESTAMP/" "$DEPLOY_DIR/.output/public/"
    fi
    exit 1
fi

echo "=== Despliegue completado ==="
