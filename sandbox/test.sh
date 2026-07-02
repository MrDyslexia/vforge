#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run a non-interactive smoke test: invoke /vforge next via opencode run
exec "${SCRIPT_DIR}/run.sh" run /vforge-next "smoke test prompt"
