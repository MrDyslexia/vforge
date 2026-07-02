#!/usr/bin/env bash
# Test the full user installation flow from a tarball in a clean container.
# This container does NOT mount the development source; it mimics a fresh user machine.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VFORGE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
IMAGE_NAME="vforge-sandbox"
CONTAINER_NAME="vforge-install-test"
TEST_DIR="${VFORGE_ROOT}/.tmp-install-test"

echo "==> Building vforge plugin..."
cd "${VFORGE_ROOT}"
bun run build

echo "==> Preparing clean test directory..."
rm -rf "${TEST_DIR}"
mkdir -p "${TEST_DIR}/project"
chmod -R 777 "${TEST_DIR}"

echo "==> Building tarball..."
cd "${VFORGE_ROOT}"
npm pack --pack-destination "${TEST_DIR}"

echo "==> Removing previous test container..."
podman rm -f "${CONTAINER_NAME}" 2>/dev/null || true

echo "==> Starting clean container..."
podman run -d \
  --name "${CONTAINER_NAME}" \
  --userns=keep-id \
  -v "${TEST_DIR}:/install:rw,z" \
  --entrypoint bash \
  "${IMAGE_NAME}" \
  -c "while true; do sleep 30; done"

echo "==> Running install flow inside container..."
podman exec "${CONTAINER_NAME}" bash -c "
set -e
cd /install/project
npm init -y
npm install -D /install/vforge-*.tgz
npx vforge doctor
echo '--- config before install ---'
cat /sandbox/.config/opencode/opencode.json || echo '(missing)'
npx vforge install
echo '--- config after install ---'
cat /sandbox/.config/opencode/opencode.json
echo '--- skills ---'
ls -la /sandbox/.config/opencode/skills/ || echo '(no skills dir)'
"

echo ""
echo "Test container '${CONTAINER_NAME}' still running."
echo "Attach: podman exec -it ${CONTAINER_NAME} bash"
echo "To test opencode: podman exec -it ${CONTAINER_NAME} opencode run '/vforge next landing page saas'"
