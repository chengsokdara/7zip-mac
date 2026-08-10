#!/bin/bash
#
# 7zip-mac — Finder Services installer for 7-Zip (7zz)
#
# Installs right-click Services for compress / uncompress / open (browse in Finder).
#
# Usage:
#   curl -fsSL https://chengsokdara.github.io/7z | bash
#   curl -fsSL https://raw.githubusercontent.com/chengsokdara/7zip-mac/main/install.sh | bash
#   bash install.sh
#   bash install.sh --uninstall
#   bash install.sh --force
#
set -euo pipefail

SERVICES_DIR="${HOME}/Library/Services"
FORCE=0
UNINSTALL=0

SERVICE_COMPRESS="Compress with 7-Zip"
SERVICE_EXTRACT="Uncompress with 7-Zip Here"
SERVICE_EXTRACT_FOLDER="Uncompress with 7-Zip to Folder"
SERVICE_OPEN="Open with 7-Zip"

# Current + legacy names (legacy removed on install/uninstall).
ALL_SERVICES=(
  "$SERVICE_COMPRESS"
  "$SERVICE_EXTRACT"
  "$SERVICE_EXTRACT_FOLDER"
  "$SERVICE_OPEN"
  "Uncompress with 7-Zip" # legacy rename → … Here
)

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Installs Finder Services:
  • ${SERVICE_COMPRESS}
  • ${SERVICE_EXTRACT}
  • ${SERVICE_EXTRACT_FOLDER}
  • ${SERVICE_OPEN}

Options:
  --force       Overwrite existing Services (re-run already updates)
  --uninstall   Remove all 7zip-mac Finder Services
  -h, --help    Show this help
EOF
}

log()  { printf '==> %s\n' "$*" >&2; }
die()  { printf 'error: %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    --uninstall) UNINSTALL=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown option: $1 (try --help)" ;;
  esac
done
: "${FORCE}"

[[ "$(uname -s)" == "Darwin" ]] || die "This installer only supports macOS."

flush_services() {
  if [[ -x /System/Library/CoreServices/pbs ]]; then
    /System/Library/CoreServices/pbs -flush 2>/dev/null || true
  fi
  touch "$SERVICES_DIR" 2>/dev/null || true
}

if [[ "$UNINSTALL" -eq 1 ]]; then
  mkdir -p "$SERVICES_DIR"
  removed=0
  for name in "${ALL_SERVICES[@]}"; do
    wf="${SERVICES_DIR}/${name}.workflow"
    if [[ -d "$wf" ]]; then
      rm -rf "$wf"
      log "Removed: $wf"
      removed=1
    fi
  done
  if [[ "$removed" -eq 0 ]]; then
    log "Nothing to remove (no 7zip-mac Services found)."
  fi
  flush_services
  log "Done. You may need to relaunch Finder once for the menu to update."
  exit 0
fi

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
mkdir -p "$SERVICES_DIR"

# Drop renamed/legacy workflows so the Services menu stays clean.
for legacy in "Uncompress with 7-Zip"; do
  if [[ -d "${SERVICES_DIR}/${legacy}.workflow" ]]; then
    log "Removing legacy service: ${legacy}"
    rm -rf "${SERVICES_DIR}/${legacy}.workflow"
  fi
done

# Shared helpers embedded in every workflow.
read -r -d '' SHARED_HELPERS <<'EOS' || true
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

strip_archive_ext() {
  local n="$1"
  local lower
  lower="$(printf '%s' "$n" | tr '[:upper:]' '[:lower:]')"
  case "$lower" in
    *.tar.gz|*.tar.bz2|*.tar.xz|*.tar.zst)
      n="${n%.*}"
      printf '%s\n' "${n%.*}"
      ;;
    *.tgz)
      printf '%s\n' "${n%.*}"
      ;;
    *.7z|*.zip|*.rar|*.tar|*.gz|*.bz2|*.xz|*.zst|*.lz4|*.cab|*.iso|*.dmg|*.001)
      printf '%s\n' "${n%.*}"
      ;;
    *)
      printf '%s\n' "$n"
      ;;
  esac
}

unique_path() {
  local dir="$1" name="$2"
  local out="${dir}/${name}" n=2
  while [[ -e "$out" ]]; do
    out="${dir}/${name}-${n}"
    n=$((n + 1))
  done
  printf '%s\n' "$out"
}

require_7zz() {
  SEVENZZ="$(find_7zz || true)"
  if [[ -z "${SEVENZZ}" ]]; then
    notify "__ACTION_NAME__" "7zz not found. Install with: brew install sevenzip"
    exit 1
  fi
}
EOS

read -r -d '' BODY_COMPRESS <<'EOS' || true
require_7zz

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

[[ "$failed" -eq 0 ]] || exit 1
EOS

read -r -d '' BODY_EXTRACT <<'EOS' || true
require_7zz

failed=0
for f in "$@"; do
  [[ -f "$f" ]] || continue

  dir="$(dirname "$f")"
  name="$(basename "$f")"

  if ! (
    cd "$dir" || exit 1
    "$SEVENZZ" x -y -- "$name" >/dev/null
  ); then
    notify "__ACTION_NAME__" "Failed: ${name}"
    failed=1
  fi
done

[[ "$failed" -eq 0 ]] || exit 1
EOS

read -r -d '' BODY_EXTRACT_FOLDER <<'EOS' || true
require_7zz

failed=0
for f in "$@"; do
  [[ -f "$f" ]] || continue

  dir="$(dirname "$f")"
  name="$(basename "$f")"
  base="$(strip_archive_ext "$name")"
  out="$(unique_path "$dir" "$base")"

  if ! "$SEVENZZ" x -y "-o${out}" -- "$f" >/dev/null; then
    notify "__ACTION_NAME__" "Failed: ${name}"
    failed=1
    continue
  fi
done

[[ "$failed" -eq 0 ]] || exit 1
EOS

read -r -d '' BODY_OPEN <<'EOS' || true
require_7zz

# Single reusable temp workspace (cleared on every Open).
# Contents are extracted directly into this folder (not nested under the .7z name).
OPEN_ROOT="${TMPDIR:-/tmp}/7zip-mac"

failed=0
for f in "$@"; do
  [[ -f "$f" ]] || continue

  name="$(basename "$f")"

  # Drop previous browse extract + any old mktemp-style leftovers from earlier versions.
  rm -rf "$OPEN_ROOT"
  find "${TMPDIR:-/tmp}" -maxdepth 1 -name '7zip-mac.*' -exec rm -rf {} + 2>/dev/null || true
  mkdir -p "$OPEN_ROOT"

  if ! "$SEVENZZ" x -y "-o${OPEN_ROOT}" -- "$f" >/dev/null; then
    notify "__ACTION_NAME__" "Failed: ${name}"
    rm -rf "$OPEN_ROOT"
    failed=1
    continue
  fi

  open "$OPEN_ROOT"
done

[[ "$failed" -eq 0 ]] || exit 1
EOS

install_workflow() {
  local action_name="$1"
  local body="$2"
  local slug="$3"
  local workflow_dir="${SERVICES_DIR}/${action_name}.workflow"
  local script

  script="${SHARED_HELPERS}

${body}"
  script="${script//__ACTION_NAME__/${action_name}}"

  if [[ -d "$workflow_dir" ]]; then
    log "Updating: $workflow_dir"
    rm -rf "$workflow_dir"
  else
    log "Installing: $workflow_dir"
  fi

  export INSTALL_ACTION_NAME="$action_name"
  export INSTALL_BUNDLE_ID="com.local.services.7zipMac.${slug}"
  export INSTALL_WORKFLOW_DIR="$workflow_dir"
  export INSTALL_EMBEDDED_SCRIPT="$script"

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

info = {
    "CFBundleIdentifier": bundle_id,
    "CFBundleName": action_name,
    "CFBundleShortVersionString": "1.1",
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
                    "inputMethod": 1,
                    "shell": "/bin/zsh",
                    "source": "",
                },
                "BundleIdentifier": "com.apple.RunShellScript",
                "CFBundleVersion": "2.0.3",
                "CanShowSelectedItemsWhenRun": False,
                "CanShowWhenRun": True,
                "Category": ["AMCategoryUtilities"],
                "Class Name": "RunShellScriptAction",
                "InputUUID": str(uuid.uuid4()).upper(),
                "Keywords": ["Shell", "Script", "Command", "Run", "Unix", "7zip", "7z"],
                "OutputUUID": str(uuid.uuid4()).upper(),
                "UUID": str(uuid.uuid4()).upper(),
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
PY

  plutil -lint "${workflow_dir}/Contents/Info.plist" >/dev/null
  plutil -lint "${workflow_dir}/Contents/document.wflow" >/dev/null
}

install_workflow "$SERVICE_COMPRESS" "$BODY_COMPRESS" "compress"
install_workflow "$SERVICE_EXTRACT" "$BODY_EXTRACT" "extract"
install_workflow "$SERVICE_EXTRACT_FOLDER" "$BODY_EXTRACT_FOLDER" "extractFolder"
install_workflow "$SERVICE_OPEN" "$BODY_OPEN" "open"

flush_services

cat <<EOF

Installed successfully.

  7zz: ${SEVENZZ_PATH}

  Services (Finder → right-click → Services):
    • ${SERVICE_COMPRESS}
        Create a .7z next to the selected file/folder
    • ${SERVICE_EXTRACT}
        Extract archive contents into the same folder as the .7z
    • ${SERVICE_EXTRACT_FOLDER}
        Extract into a permanent folder named after the archive
    • ${SERVICE_OPEN}
        Clear \$TMPDIR/7zip-mac, extract contents there, open in Finder
        (reused/cleared on each Open; use Uncompress for permanent copies)

Location: ${SERVICES_DIR}

If a service does not appear yet:
  • Relaunch Finder (Option-right-click the Finder Dock icon → Relaunch)
  • Or log out and back in
  • Check System Settings → Keyboard → Keyboard Shortcuts → Services

Uninstall:
  curl -fsSL https://chengsokdara.github.io/7z | bash -s -- --uninstall
  # or: bash install.sh --uninstall

EOF
