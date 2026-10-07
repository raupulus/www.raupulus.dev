#!/usr/bin/env bash
# ==============================================================================
# Script seguro para reemplazar correos históricos en git usando git-filter-repo
# Sustituye cualquier dirección de correo personal antigua por: public@raupulus.dev
# ==============================================================================
set -euo pipefail

PUBLIC_EMAIL="public@raupulus.dev"
OLD_EMAIL="${1:-${OLD_EMAIL:-}}"

if [ -z "$OLD_EMAIL" ]; then
  echo "Uso: OLD_EMAIL='correo-a-reemplazar' $0" >&2
  echo "Ejemplo: OLD_EMAIL='antiguo@dominio.com' $0" >&2
  exit 1
fi

if ! command -v git-filter-repo &>/dev/null; then
  echo "Error: git-filter-repo no está instalado." >&2
  echo "Instálalo con: pip install git-filter-repo (o brew install git-filter-repo)" >&2
  exit 1
fi

# Verificar árbol de trabajo limpio
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Tienes cambios sin commitear en el repositorio. Haz commit o stash antes." >&2
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
BACKUP_BRANCH="backup-before-rewrite-$(date +%Y%m%d_%H%M%S)"

echo "=== Creando rama de respaldo: $BACKUP_BRANCH ==="
git branch "$BACKUP_BRANCH"

echo "=== Creando archivo mailmap temporal ==="
TMP_MAILMAP=$(mktemp)
trap 'rm -f "$TMP_MAILMAP"' EXIT

echo "<$PUBLIC_EMAIL> <$OLD_EMAIL>" > "$TMP_MAILMAP"

echo "=== Reescribiendo autoría en todo el historial ==="
git filter-repo --mailmap "$TMP_MAILMAP" --force

echo "=== Verificando que no queden referencias al correo antiguo ==="
REMAINING_COUNT=$(git log --all --author="$OLD_EMAIL" --oneline | wc -l || echo 0)

if [ "$REMAINING_COUNT" -eq 0 ]; then
  echo "✓ Éxito: 0 commits encontrados con el correo antiguo."
  echo "✓ Todos los commits han sido actualizados a: $PUBLIC_EMAIL"
  echo ""
  echo "Si todo es correcto y deseas actualizar el repositorio remoto:"
  echo "  git push origin --force --all"
  echo "  git push origin --force --tags"
  echo ""
  echo "Para descartar los cambios y restaurar el respaldo:"
  echo "  git reset --hard $BACKUP_BRANCH"
else
  echo "Aviso: Todavía se detectan $REMAINING_COUNT commits con el correo antiguo." >&2
fi
