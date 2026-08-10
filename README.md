# 7zip-mac

One-line installer that adds a Finder **Services** action to compress files and folders into `.7z` archives using the [7-Zip](https://www.7-zip.org/) CLI (`7zz`).

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/chengsokdara/7zip-mac/main/install.sh | bash
```

Or clone and run locally:

```bash
git clone https://github.com/chengsokdara/7zip-mac.git
cd 7zip-mac
bash install.sh
```

What the installer does:

1. Checks that you are on macOS
2. Finds `7zz`, or runs `brew install sevenzip` if it is missing
3. Generates an Automator service at  
   `~/Library/Services/Compress with 7-Zip.workflow`
4. Flushes the Services cache (best effort)

### Options

```bash
bash install.sh --force       # overwrite (re-run already updates)
bash install.sh --uninstall   # remove the Finder service
SEVENZIP_ACTION_NAME="Compress 7z" bash install.sh   # custom menu name
```

Or:

```bash
bash uninstall.sh
```

## Usage

1. Open **Finder**
2. Right-click any file or folder
3. Choose **Services → Compress with 7-Zip**  
   (on some older macOS versions this may appear under **Quick Actions**)
4. A `.7z` archive appears next to the original item

If `Name.7z` already exists, the action creates `Name-2.7z`, `Name-3.7z`, and so on.

## Requirements

- macOS
- [Homebrew](https://brew.sh) (used automatically to install `sevenzip` when `7zz` is missing)
- Or a manual install of 7-Zip so that `7zz` is on your `PATH`

## Troubleshooting

### The action does not appear in the menu

1. Look under **Services**, not only Quick Actions (newer macOS often lists custom Automator actions there)
2. Relaunch Finder: Option-right-click the Finder Dock icon → **Relaunch**
3. Log out and back in (or reboot) once
4. Open **System Settings → Keyboard → Keyboard Shortcuts → Services**  
   and ensure **Compress with 7-Zip** is enabled  
   (on some versions: **Privacy & Security → Extensions → Finder**)

### Compression fails / notification “7zz not found”

```bash
which 7zz
brew install sevenzip
```

Then re-run the install command if you want to refresh the action.

### Wrong architecture path (Apple Silicon vs Intel)

The service resolves `7zz` at runtime from:

- your `PATH`
- `/opt/homebrew/bin/7zz` (Apple Silicon Homebrew)
- `/usr/local/bin/7zz` (Intel Homebrew)

You do not need to hardcode the path.

## Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/chengsokdara/7zip-mac/main/install.sh | bash -s -- --uninstall
# or, from a clone:
bash install.sh --uninstall
bash uninstall.sh
```

This only removes the Finder service. It does **not** uninstall Homebrew or the `sevenzip` formula.

## How it works

The installer builds a standard Automator **Service / Quick Action** bundle:

```
~/Library/Services/Compress with 7-Zip.workflow/
  Contents/
    Info.plist      # Finder + public.item (files/folders)
    document.wflow  # Run Shell Script → 7zz a …
```

No Automator GUI steps are required. Re-running the installer updates the action in place.

## License

MIT — see [LICENSE](./LICENSE).

7-Zip itself is separate software with its own license; this repo only ships the macOS Finder installer scripts.
