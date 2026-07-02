#!/usr/bin/env bash
# Entra a la consola del contenedor de desarrollo.
# Si no está corriendo, lo levanta primero.
set -euo pipefail

CONTAINER_NAME="vforge-dev"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! podman inspect "${CONTAINER_NAME}" &>/dev/null; then
  echo "Contenedor no existe. Ejecutá: ./sandbox/start.sh"
  exit 1
fi

STATE=$(podman inspect --format '{{.State.Status}}' "${CONTAINER_NAME}")
if [[ "${STATE}" != "running" ]]; then
  echo "==> Reiniciando contenedor..."
  podman start "${CONTAINER_NAME}"
fi

exec podman exec -it "${CONTAINER_NAME}" bash
