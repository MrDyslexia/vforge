#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VFORGE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
IMAGE_NAME="vforge-sandbox"
CONTAINER_NAME="vforge-sandbox"
TEST_PROJECT="${VFORGE_ROOT}/test-project"

# Ensure plugin is built
echo "==> Building vforge plugin..."
cd "${VFORGE_ROOT}"
bun run build

# Ensure test project is writable inside the container
chmod 777 "${TEST_PROJECT}"

# Build container image
echo "==> Building sandbox image..."
podman build -t "${IMAGE_NAME}" -f "${SCRIPT_DIR}/Containerfile" "${SCRIPT_DIR}"

# Run container interactively
echo "==> Running opencode in sandbox..."
echo "    vforge source mounted at: /vforge"
echo "    test project mounted at:  /project"
echo ""

exec podman run -it \
  --name "${CONTAINER_NAME}" \
  --replace \
  --userns=keep-id \
  -v "${VFORGE_ROOT}:/vforge:ro,z" \
  -v "${VFORGE_ROOT}/dist:/sandbox/.config/opencode/plugins/vforge:ro,z" \
  -v "${VFORGE_ROOT}/dist/skills:/sandbox/.config/opencode/skills:ro,z" \
  -v "${TEST_PROJECT}:/project:rw,z" \
  "${IMAGE_NAME}" \
  "$@"
