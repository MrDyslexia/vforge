#!/usr/bin/env bash
# Test the full user installation flow with Bun in a clean container.
# Verifies that opencode recognizes /vforge next and project commands after install.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VFORGE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
IMAGE_NAME="vforge-sandbox"
CONTAINER_NAME="vforge-bun-install-test"
TEST_DIR="${VFORGE_ROOT}/.tmp-bun-install-test"

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

echo "==> Running Bun install flow inside container..."
podman exec "${CONTAINER_NAME}" bash -c "
set -e
cd /install/project
bun init -y
bun add -D /install/vforge-*.tgz
bunx vforge doctor
echo '--- config before install ---'
cat /sandbox/.config/opencode/opencode.json || echo '(missing)'
bunx vforge install
echo '--- config after install ---'
cat /sandbox/.config/opencode/opencode.json
echo '--- skills ---'
ls -la /sandbox/.config/opencode/skills/ || echo '(no skills dir)'
"

echo ""
echo "==> Verifying opencode command recognition..."
podman exec "${CONTAINER_NAME}" bash -c "
set -e
cd /install/project
# Check global config recognizes vforge plugin
opencode debug config 2>&1 | grep -E 'vforge|plugin' | head -20 || true
echo '---'
# Check local project config recognizes /iterate /page /component
mkdir -p /install/project/my-vforge-app
cd /install/project/my-vforge-app
cp /install/project/node_modules/vforge/dist/generated-config/opencode.json ./opencode.json
opencode debug config 2>&1 | python3 -c \"import sys, json; data=json.load(sys.stdin); print('COMMANDS:', list(data.get('command', {}).keys())); print('AGENTS:', list(data.get('agent', {}).keys()))\"
"

echo ""
echo "Test container '${CONTAINER_NAME}' still running."
echo "Attach: podman exec -it ${CONTAINER_NAME} bash"
