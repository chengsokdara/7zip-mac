#!/bin/bash
# Thin wrapper — same as: bash install.sh --uninstall
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec bash "${SCRIPT_DIR}/install.sh" --uninstall "$@"
