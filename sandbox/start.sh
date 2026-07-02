#!/usr/bin/env bash
# Levanta el contenedor de desarrollo en segundo plano.
# Accedé con: podman exec -it vforge-dev bash
# O desde Cockpit → Containers → vforge-dev → Console
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VFORGE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
IMAGE_NAME="vforge-sandbox"
CONTAINER_NAME="vforge-dev"
TEST_PROJECT="${VFORGE_ROOT}/test-project"

# Build plugin
echo "==> Building vforge plugin..."
cd "${VFORGE_ROOT}"
bun run build

# Ensure test project is writable
chmod 777 "${TEST_PROJECT}"

# Rebuild image
echo "==> Building sandbox image..."
podman build -t "${IMAGE_NAME}" -f "${SCRIPT_DIR}/Containerfile" "${SCRIPT_DIR}"

# Detener y eliminar contenedor previo si existe
podman rm -f "${CONTAINER_NAME}" 2>/dev/null || true

# Arrancar como demonio con bash como entrypoint (no opencode)
echo "==> Starting dev container (background)..."
podman run -d \
  --name "${CONTAINER_NAME}" \
  --userns=keep-id \
  -v "${VFORGE_ROOT}:/vforge:ro,z" \
  -v "${VFORGE_ROOT}/dist:/sandbox/.config/opencode/plugins/vforge:ro,z" \
  -v "${VFORGE_ROOT}/dist/skills:/sandbox/.config/opencode/skills:ro,z" \
  -v "${TEST_PROJECT}:/project:rw,z" \
  --entrypoint bash \
  "${IMAGE_NAME}" \
  -c "while true; do sleep 30; done"

echo ""
echo "Contenedor 'vforge-dev' corriendo en background."
echo ""
echo "Para entrar desde terminal:"
echo "  podman exec -it vforge-dev bash"
echo ""
echo "Desde adentro, para correr opencode:"
echo "  opencode                          # TUI interactivo"
echo "  opencode run '/vforge next ...'  # headless"
echo ""
echo "Para parar: podman stop vforge-dev"
