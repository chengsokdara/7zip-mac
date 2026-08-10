#!/bin/bash
#
# 7zip-mac — Finder Services installer for 7-Zip (7zz)
#
# Installs a right-click Services action that creates a .7z archive next to
# the selected file(s) or folder(s), using the 7zz CLI.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/chengsokdara/7zip-mac/main/install.sh | bash
#   bash install.sh
#   bash install.sh --uninstall
#   bash install.sh --force
#   SEVENZIP_ACTION_NAME="Compress 7z" bash install.sh
#
set -euo pipefail

ACTION_NAME="${SEVENZIP_ACTION_NAME:-Compress with 7-Zip}"
SERVICES_DIR="${HOME}/Library/Services"
WORKFLOW_DIR="${SERVICES_DIR}/${ACTION_NAME}.workflow"
BUNDLE_ID="com.local.services.compressWith7Zip"

FORCE=0
UNINSTALL=0

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --force       Overwrite an existing Quick Action without prompting
  --uninstall   Remove the installed Quick Action
  -h, --help    Show this help

Environment:
  SEVENZIP_ACTION_NAME   Menu label / workflow name (default: Compress with 7-Zip)
EOF
}

log()  { printf '==> %s\n' "$*" >&2; }
warn() { printf 'warning: %s\n' "$*" >&2; }
die()  { printf 'error: %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    --uninstall) UNINSTALL=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown option: $1 (try --help)" ;;
  esac
done

[[ "$(uname -s)" == "Darwin" ]] || die "This installer only supports macOS."

# ---------------------------------------------------------------------------
# Uninstall
# ---------------------------------------------------------------------------
if [[ "$UNINSTALL" -eq 1 ]]; then
  if [[ -d "$WORKFLOW_DIR" ]]; then
    rm -rf "$WORKFLOW_DIR"
    log "Removed: $WORKFLOW_DIR"
  else
    log "Nothing to remove (not installed): $WORKFLOW_DIR"
  fi
  # Refresh Services menu best-effort
  if [[ -x /System/Library/CoreServices/pbs ]]; then
    /System/Library/CoreServices/pbs -flush 2>/dev/null || true
  fi
  touch "$SERVICES_DIR" 2>/dev/null || true
  log "Done. You may need to relaunch Finder once for the menu to update."
  exit 0
fi

# ---------------------------------------------------------------------------
# Locate or install 7zz
# ---------------------------------------------------------------------------
resolve_7zz() {
  export PATH="/opt/homebrew/bin:/usr/local/bin:${PATH:-/usr/bin:/bin:/usr/sbin:/sbin}"
  if command -v 7zz >/dev/null 2>&1; then
    command -v 7zz
    return 0
  fi
  for candidate in /opt/homebrew/bin/7zz /usr/local/bin/7zz; do
    if [[ -x "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  return 1
}

# Sets SEVENZZ_PATH; logs go to stderr so callers never capture brew noise.
ensure_7zz() {
  local path
  if path="$(resolve_7zz)"; then
    log "Found 7zz at: $path"
    SEVENZZ_PATH="$path"
    return 0
  fi

  if ! command -v brew >/dev/null 2>&1; then
    die "7zz not found and Homebrew is not installed.
Install Homebrew from https://brew.sh then re-run this script, or install 7-Zip so that '7zz' is on your PATH.
  brew install sevenzip"
  fi

  log "7zz not found — installing sevenzip via Homebrew..."
  brew install sevenzip

  if path="$(resolve_7zz)"; then
    log "Installed 7zz at: $path"
    SEVENZZ_PATH="$path"
    return 0
  fi

  die "Homebrew finished but 7zz is still not on PATH. Try: brew install sevenzip && which 7zz"
}

SEVENZZ_PATH=""
ensure_7zz

# ---------------------------------------------------------------------------
# Existing install
# ---------------------------------------------------------------------------
mkdir -p "$SERVICES_DIR"

if [[ -d "$WORKFLOW_DIR" ]]; then
  log "Updating existing Quick Action: $WORKFLOW_DIR"
  rm -rf "$WORKFLOW_DIR"
fi

# ---------------------------------------------------------------------------
# Shell script embedded in the Quick Action
# ---------------------------------------------------------------------------
# Resolves 7zz at runtime so Apple Silicon / Intel Homebrew paths both work.
read -r -d '' EMBEDDED_SCRIPT <<'EOS' || true
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

notify() {
  local title="$1" message="$2"
  /usr/bin/osascript \
    -e 'on run argv' \
    -e 'display notification (item 2 of argv) with title (item 1 of argv)' \
    -e 'end run' \
    -- "$title" "$message" 2>/dev/null || true
}

find_7zz() {
  if command -v 7zz >/dev/null 2>&1; then
    command -v 7zz
    return 0
  fi
  for candidate in /opt/homebrew/bin/7zz /usr/local/bin/7zz; do
    if [[ -x "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  return 1
}

SEVENZZ="$(find_7zz || true)"
if [[ -z "${SEVENZZ}" ]]; then
  notify "__ACTION_NAME__" "7zz not found. Install with: brew install sevenzip"
  exit 1
fi

failed=0
for f in "$@"; do
  [[ -e "$f" ]] || continue

  dir="$(dirname "$f")"
  name="$(basename "$f")"

  out="${name}.7z"
  n=2
  while [[ -e "${dir}/${out}" ]]; do
    out="${name}-${n}.7z"
    n=$((n + 1))
  done

  if ! (
    cd "$dir" || exit 1
    "$SEVENZZ" a -t7z -y -- "$out" "$name" >/dev/null
  ); then
    notify "__ACTION_NAME__" "Failed: ${name}"
    failed=1
  fi
done

if [[ "$failed" -ne 0 ]]; then
  exit 1
fi
EOS

# Inject the configured menu name into notification titles
EMBEDDED_SCRIPT="${EMBEDDED_SCRIPT//__ACTION_NAME__/${ACTION_NAME}}"

# ---------------------------------------------------------------------------
# Generate Automator workflow via Python plistlib
# ---------------------------------------------------------------------------
export INSTALL_ACTION_NAME="$ACTION_NAME"
export INSTALL_BUNDLE_ID="$BUNDLE_ID"
export INSTALL_WORKFLOW_DIR="$WORKFLOW_DIR"
export INSTALL_EMBEDDED_SCRIPT="$EMBEDDED_SCRIPT"

python3 - <<'PY'
import os
import plistlib
import uuid
from pathlib import Path

action_name = os.environ["INSTALL_ACTION_NAME"]
bundle_id = os.environ["INSTALL_BUNDLE_ID"]
workflow_dir = Path(os.environ["INSTALL_WORKFLOW_DIR"])
script = os.environ["INSTALL_EMBEDDED_SCRIPT"]

contents = workflow_dir / "Contents"
contents.mkdir(parents=True, exist_ok=True)

action_uuid = str(uuid.uuid4()).upper()
input_uuid = str(uuid.uuid4()).upper()
output_uuid = str(uuid.uuid4()).upper()

info = {
    "CFBundleIdentifier": bundle_id,
    "CFBundleName": action_name,
    "CFBundleShortVersionString": "1.0",
    "NSServices": [
        {
            "NSMenuItem": {"default": action_name},
            "NSMessage": "runWorkflowAsService",
            "NSRequiredContext": {
                "NSApplicationIdentifier": "com.apple.finder",
            },
            "NSSendFileTypes": ["public.item"],
        }
    ],
}

document = {
    "AMApplicationBuild": "523",
    "AMApplicationVersion": "2.10",
    "AMDocumentVersion": "2",
    "actions": [
        {
            "action": {
                "AMAccepts": {
                    "Container": "List",
                    "Optional": True,
                    "Types": ["com.apple.cocoa.string"],
                },
                "AMActionVersion": "2.0.3",
                "AMApplication": ["Automator"],
                "AMParameterProperties": {
                    "COMMAND_STRING": {},
                    "CheckedForUserDefaultShell": {},
                    "inputMethod": {},
                    "shell": {},
                    "source": {},
                },
                "AMProvides": {
                    "Container": "List",
                    "Types": ["com.apple.cocoa.string"],
                },
                "ActionBundlePath": "/System/Library/Automator/Run Shell Script.action",
                "ActionName": "Run Shell Script",
                "ActionParameters": {
                    "COMMAND_STRING": script,
                    "CheckedForUserDefaultShell": True,
                    "inputMethod": 1,  # as arguments
                    "shell": "/bin/zsh",
                    "source": "",
                },
                "BundleIdentifier": "com.apple.RunShellScript",
                "CFBundleVersion": "2.0.3",
                "CanShowSelectedItemsWhenRun": False,
                "CanShowWhenRun": True,
                "Category": ["AMCategoryUtilities"],
                "Class Name": "RunShellScriptAction",
                "InputUUID": input_uuid,
                "Keywords": ["Shell", "Script", "Command", "Run", "Unix", "7zip", "7z"],
                "OutputUUID": output_uuid,
                "UUID": action_uuid,
                "UnlocalizedApplications": ["Automator"],
                "arguments": {
                    "0": {
                        "default value": 0,
                        "name": "inputMethod",
                        "required": "0",
                        "type": "0",
                        "uuid": "0",
                    },
                    "1": {
                        "default value": "",
                        "name": "source",
                        "required": "0",
                        "type": "0",
                        "uuid": "1",
                    },
                    "2": {
                        "default value": False,
                        "name": "CheckedForUserDefaultShell",
                        "required": "0",
                        "type": "0",
                        "uuid": "2",
                    },
                    "3": {
                        "default value": "",
                        "name": "COMMAND_STRING",
                        "required": "0",
                        "type": "0",
                        "uuid": "3",
                    },
                    "4": {
                        "default value": "/bin/sh",
                        "name": "shell",
                        "required": "0",
                        "type": "0",
                        "uuid": "4",
                    },
                },
                "isViewVisible": 0,
            }
        }
    ],
    "connectors": {},
    "workflowMetaData": {
        "serviceApplicationBundleID": "com.apple.finder",
        "serviceApplicationPath": "/System/Library/CoreServices/Finder.app",
        "serviceInputTypeIdentifier": "com.apple.Automator.fileSystemObject",
        "serviceOutputTypeIdentifier": "com.apple.Automator.nothing",
        "serviceProcessesInput": 0,
        "workflowTypeIdentifier": "com.apple.Automator.servicesMenu",
    },
}

with (contents / "Info.plist").open("wb") as f:
    plistlib.dump(info, f, fmt=plistlib.FMT_XML)

with (contents / "document.wflow").open("wb") as f:
    plistlib.dump(document, f, fmt=plistlib.FMT_XML)

print(workflow_dir)
PY

# ---------------------------------------------------------------------------
# Validate + refresh
# ---------------------------------------------------------------------------
plutil -lint "${WORKFLOW_DIR}/Contents/Info.plist" >/dev/null
plutil -lint "${WORKFLOW_DIR}/Contents/document.wflow" >/dev/null

if [[ -x /System/Library/CoreServices/pbs ]]; then
  /System/Library/CoreServices/pbs -flush 2>/dev/null || true
fi
touch "$SERVICES_DIR" 2>/dev/null || true

cat <<EOF

Installed successfully.

  Action:   ${ACTION_NAME}
  Location: ${WORKFLOW_DIR}
  7zz:      ${SEVENZZ_PATH}

How to use:
  1. Open Finder
  2. Right-click any file or folder
  3. Choose Services → ${ACTION_NAME}
     (on some older macOS versions: Quick Actions → ${ACTION_NAME})
  4. A .7z archive appears next to the original

If the action does not appear yet:
  • Relaunch Finder (Option-right-click the Finder Dock icon → Relaunch)
  • Or log out and back in
  • Check System Settings → Keyboard → Keyboard Shortcuts → Services
    (or Privacy & Security → Extensions → Finder) and ensure it is enabled

Uninstall:
  bash $(basename "$0") --uninstall
  # or:
  # curl -fsSL https://raw.githubusercontent.com/chengsokdara/7zip-mac/main/install.sh | bash -s -- --uninstall

EOF
