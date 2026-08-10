# 7zip-mac

**Website:** [7-Zip for Mac](https://chengsokdara.github.io/7zip-mac/): terminal-style landing page, install one-liner, FAQ.

One-line installer that adds Finder **Services** for [7-Zip](https://www.7-zip.org/) (`7zz`) on macOS: compress, uncompress, and open (browse in Finder).

## Install

```bash
curl -fsSL https://chengsokdara.github.io/7z | bash
```

That short URL is a thin bootstrap on GitHub Pages; it always pulls the latest installer from this repo.

**Canonical / fallback:**

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
3. Installs four Automator Services under `~/Library/Services/`
4. Flushes the Services cache (best effort)

### Options

```bash
bash install.sh --force       # overwrite (re-run already updates)
bash install.sh --uninstall   # remove all 7zip-mac Services
```

Or:

```bash
bash uninstall.sh
```

## Services

Right-click in Finder → **Services** (on some older macOS versions: **Quick Actions**).

| Service | What it does |
|---------|----------------|
| **Compress with 7-Zip** | Creates `Name.7z` next to the selected file or folder (`Name-2.7z` if needed) |
| **Uncompress with 7-Zip Here** | Extracts into the **same folder** as the archive (full paths) |
| **Uncompress with 7-Zip to Folder** | Extracts into a **permanent** folder named after the archive (e.g. `Photos.7z` → `Photos/`) |
| **Open with 7-Zip** | Clears `$TMPDIR/7zip-mac`, extracts archive **contents directly** into it, opens Finder |

### Open with 7-Zip (browse)

There is no official 7-Zip GUI on macOS (Homebrew ships the `7zz` CLI only). **Open with 7-Zip** is the lightweight explore path:

1. Wipe `$TMPDIR/7zip-mac` (and any old `7zip-mac.*` leftovers)
2. Extract the archive **here** into that folder (no extra subfolder named after the `.7z`)
3. Open `$TMPDIR/7zip-mac` in Finder

Each Open reuses the same workspace so previous browse extracts do not pile up. For permanent extracts, use **Uncompress with 7-Zip Here** or **… to Folder**.

True browse-without-extract apps (not installed by us): Keka, BetterZip, The Unarchiver, etc.

## Requirements

- macOS
- [Homebrew](https://brew.sh) (used automatically to install `sevenzip` when `7zz` is missing)
- Or a manual install of 7-Zip so that `7zz` is on your `PATH`

## Troubleshooting

### Services do not appear in the menu

1. Look under **Services**, not only Quick Actions (common on newer macOS)
2. Relaunch Finder: Option-right-click the Finder Dock icon → **Relaunch**
3. Log out and back in (or reboot) once
4. Open **System Settings → Keyboard → Keyboard Shortcuts → Services**  
   and ensure the 7-Zip items are enabled

### Compression / extract fails / “7zz not found”

```bash
which 7zz
brew install sevenzip
```

Then re-run the install command if you want to refresh the Services.

### Wrong architecture path (Apple Silicon vs Intel)

Each service resolves `7zz` at runtime from:

- your `PATH`
- `/opt/homebrew/bin/7zz` (Apple Silicon Homebrew)
- `/usr/local/bin/7zz` (Intel Homebrew)

## Uninstall

```bash
curl -fsSL https://chengsokdara.github.io/7z | bash -s -- --uninstall
# or:
curl -fsSL https://raw.githubusercontent.com/chengsokdara/7zip-mac/main/install.sh | bash -s -- --uninstall
# or, from a clone:
bash install.sh --uninstall
bash uninstall.sh
```

This only removes the Finder Services. It does **not** uninstall Homebrew or the `sevenzip` formula.

## How it works

The installer builds standard Automator **Service** bundles:

```
~/Library/Services/
  Compress with 7-Zip.workflow/
  Uncompress with 7-Zip Here.workflow/
  Uncompress with 7-Zip to Folder.workflow/
  Open with 7-Zip.workflow/
```

Each bundle is a **Run Shell Script** action that calls `7zz`. No Automator GUI steps are required. Re-running the installer updates all actions in place.

## License

MIT. See [LICENSE](./LICENSE).

7-Zip itself is separate software with its own license; this repo only ships the macOS Finder installer scripts.
