#!/usr/bin/env node
/**
 * Generates SEO guide pages under docs/<slug>/index.html
 * Run from repo root: node docs/build-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = "https://chengsokdara.github.io/7zip-mac";
const YEAR = new Date().getFullYear();

const guides = [
  {
    slug: "open-7z-on-mac",
    title: "How to Open 7z Files on Mac (2026)",
    description:
      "Open and extract .7z files on macOS with free Finder Services powered by official 7-Zip (7zz). Step-by-step for Apple Silicon and Intel Macs.",
    h1: "How to open 7z files on Mac",
    dek: "macOS Archive Utility does not handle .7z. Here is the free way to open, extract, and browse 7-Zip archives on Mac using the official 7zz CLI and Finder Services.",
    keywords:
      "open 7z on mac, extract 7z macOS, open 7zip file mac, unzip 7z mac, how to open 7z on mac",
    schemaType: "HowTo",
    updated: "2026-08-10",
    body: `
      <nav class="toc" aria-label="On this page">
        <p>On this page</p>
        <ol>
          <li><a href="#why">Why Mac cannot open .7z by default</a></li>
          <li><a href="#fastest">Fastest free method (recommended)</a></li>
          <li><a href="#extract">Extract permanently</a></li>
          <li><a href="#terminal">Terminal-only option</a></li>
          <li><a href="#alternatives">Other apps</a></li>
          <li><a href="#troubleshoot">Troubleshooting</a></li>
        </ol>
      </nav>

      <h2 id="why">Why Mac cannot open .7z by default</h2>
      <p>
        Apple's built-in Archive Utility works well for <code>.zip</code>, but it does not
        support the <strong>7z</strong> format. If someone sends you a
        <code>.7z</code> from Windows (especially with high compression or encryption),
        double-clicking does nothing useful.
      </p>
      <p>
        Official 7-Zip ships a <strong>console</strong> build for macOS. That is powerful
        but not friendly if you want a right-click workflow like Windows 7-Zip.
        <strong>7zip-mac</strong> bridges that gap: one install command adds Finder Services
        that call the official <code>7zz</code> binary.
      </p>

      <h2 id="fastest">Fastest free method (recommended)</h2>
      <div class="callout">
        <p class="callout-title">Install 7-Zip for Mac (Finder Services)</p>
        <p>Open Terminal and run:</p>
        <div class="callout-install">
          <code>curl -fsSL https://chengsokdara.github.io/7z | bash</code>
          <button type="button" class="btn btn-ghost" data-copy="short">Copy</button>
        </div>
        <p style="margin-top:0.75rem">
          The installer installs Homebrew <code>sevenzip</code> (<code>7zz</code>) if needed,
          then registers four Services under <code>~/Library/Services</code>.
        </p>
      </div>

      <h3>Open (browse) a .7z in Finder</h3>
      <ol>
        <li>Select the <code>.7z</code> file in Finder.</li>
        <li>Right-click → <strong>Services</strong> → <strong>Open with 7-Zip</strong>.</li>
        <li>
          7zip-mac clears a temp workspace, extracts contents there, and opens Finder so you can
          browse files. Each Open reuses the same temp folder so old extracts do not pile up.
        </li>
      </ol>
      <p>
        On some older macOS versions the menu may appear under <strong>Quick Actions</strong>
        instead of Services. See
        <a href="../finder-services-7zip/">Finder Services for 7-Zip</a> if items are missing.
      </p>

      <h2 id="extract">Extract permanently</h2>
      <p>Use these when you want files to stay on disk (not only browse):</p>
      <ul>
        <li>
          <strong>Uncompress with 7-Zip Here</strong> — extracts into the same folder as the archive
          (full paths).
        </li>
        <li>
          <strong>Uncompress with 7-Zip to Folder</strong> — creates a permanent folder named after
          the archive (for example <code>Photos.7z</code> → <code>Photos/</code>) and extracts into it.
        </li>
      </ul>

      <h2 id="terminal">Terminal-only option</h2>
      <p>If you prefer not to install Finder Services:</p>
      <pre><code>brew install sevenzip
cd ~/Downloads
7zz x archive.7z</code></pre>
      <p>
        <code>7zz x</code> extracts with full paths.
        <code>7zz l archive.7z</code> lists contents without extracting.
        Full docs live at <a href="https://www.7-zip.org/" rel="noopener noreferrer">7-zip.org</a>.
      </p>

      <h2 id="alternatives">Other apps (when you need a GUI browser)</h2>
      <p>
        Apps like <a href="../7zip-vs-keka/">Keka</a> and
        <a href="../7zip-vs-the-unarchiver/">The Unarchiver</a> offer full archive browsers.
        Choose them if you need drag-and-drop GUIs, many exotic formats, or App Store install.
        Choose 7zip-mac if you want the official 7-Zip engine, free open source, and a light
        right-click workflow without another heavy archiver.
      </p>

      <h2 id="troubleshoot">Troubleshooting</h2>
      <h3>Services menu has no 7-Zip items</h3>
      <ol>
        <li>Confirm install finished without errors.</li>
        <li>Relaunch Finder (Option-right-click Finder in the Dock → Relaunch).</li>
        <li>
          System Settings → Keyboard → Keyboard Shortcuts → Services — enable the 7-Zip actions.
        </li>
        <li>Log out and back in once if they still do not appear.</li>
      </ol>
      <h3>“7zz not found”</h3>
      <pre><code>which 7zz
brew install sevenzip</code></pre>
      <p>Then re-run the install one-liner to refresh Services if needed.</p>
    `,
  },
  {
    slug: "install-7zip-mac",
    title: "Install 7-Zip on Mac: One-Line Finder Setup",
    description:
      "Install 7-Zip on Mac with a single Terminal command. Adds Finder Services for compress, extract, and open .7z using official sevenzip (7zz) via Homebrew.",
    h1: "Install 7-Zip on Mac",
    dek: "One command installs the official 7-Zip CLI when needed and adds right-click Finder Services so you can compress and extract .7z without a separate GUI app.",
    keywords:
      "install 7zip mac, install 7-zip macOS, brew sevenzip, 7zz mac, 7-zip finder install",
    schemaType: "HowTo",
    updated: "2026-08-10",
    body: `
      <nav class="toc" aria-label="On this page">
        <p>On this page</p>
        <ol>
          <li><a href="#requirements">Requirements</a></li>
          <li><a href="#one-liner">One-line install</a></li>
          <li><a href="#what">What gets installed</a></li>
          <li><a href="#verify">Verify it works</a></li>
          <li><a href="#manual">Manual / advanced</a></li>
          <li><a href="#uninstall">Uninstall</a></li>
        </ol>
      </nav>

      <h2 id="requirements">Requirements</h2>
      <ul>
        <li>macOS (Apple Silicon or Intel)</li>
        <li>
          <a href="https://brew.sh" rel="noopener noreferrer">Homebrew</a> if
          <code>7zz</code> is not already on your <code>PATH</code>
        </li>
        <li>Permission to write to <code>~/Library/Services</code></li>
      </ul>

      <h2 id="one-liner">One-line install</h2>
      <div class="callout">
        <p class="callout-title">Recommended</p>
        <div class="callout-install">
          <code>curl -fsSL https://chengsokdara.github.io/7z | bash</code>
          <button type="button" class="btn btn-ghost" data-copy="short">Copy</button>
        </div>
      </div>
      <p>Canonical fallback (always pulls latest script from GitHub):</p>
      <pre><code>curl -fsSL https://raw.githubusercontent.com/chengsokdara/7zip-mac/main/install.sh | bash</code></pre>
      <p>
        Or clone and run locally if you want to inspect the script first (recommended for
        security-conscious installs):
      </p>
      <pre><code>git clone https://github.com/chengsokdara/7zip-mac.git
cd 7zip-mac
less install.sh   # review
bash install.sh</code></pre>

      <h2 id="what">What gets installed</h2>
      <ol>
        <li>Checks that you are on macOS.</li>
        <li>Finds <code>7zz</code>, or runs <code>brew install sevenzip</code> if missing.</li>
        <li>
          Installs four Automator Service bundles under <code>~/Library/Services/</code>:
          Compress, Uncompress Here, Uncompress to Folder, Open with 7-Zip.
        </li>
        <li>Flushes the Services cache (best effort).</li>
      </ol>
      <p>
        7zip-mac does <strong>not</strong> ship a Windows-style 7-Zip GUI. It wraps the official
        CLI so Finder can call it. Not affiliated with 7-zip.org.
      </p>

      <h2 id="verify">Verify it works</h2>
      <ol>
        <li>Confirm CLI: <code>which 7zz</code> and <code>7zz --help</code>.</li>
        <li>In Finder, right-click any file → <strong>Services</strong> → <strong>Compress with 7-Zip</strong>.</li>
        <li>Right-click the new <code>.7z</code> → <strong>Open with 7-Zip</strong> or Uncompress.</li>
      </ol>

      <h2 id="manual">Manual / advanced</h2>
      <pre><code>bash install.sh --force       # overwrite Services
bash install.sh --uninstall   # remove Services only</code></pre>
      <p>
        Services resolve <code>7zz</code> at runtime from your <code>PATH</code>,
        <code>/opt/homebrew/bin/7zz</code> (Apple Silicon), or <code>/usr/local/bin/7zz</code> (Intel).
      </p>

      <h2 id="uninstall">Uninstall</h2>
      <p>
        See the full guide:
        <a href="../uninstall/">Uninstall 7zip-mac</a>. Short version:
      </p>
      <pre><code>curl -fsSL https://chengsokdara.github.io/7z | bash -s -- --uninstall</code></pre>
    `,
  },
  {
    slug: "7zip-vs-keka",
    title: "7-Zip for Mac vs Keka: Which Should You Use?",
    description:
      "Compare 7zip-mac (official 7zz + Finder Services) vs Keka for compressing and extracting 7z on macOS. Free options, GUI vs right-click workflow.",
    h1: "7-Zip for Mac vs Keka",
    dek: "Both can handle .7z on macOS. Keka is a polished GUI archiver. 7zip-mac is a free open-source Finder wrapper around the official 7-Zip CLI.",
    keywords:
      "7zip vs keka, keka vs 7-zip mac, 7-zip alternative mac, best 7z app mac",
    schemaType: "Article",
    updated: "2026-08-10",
    body: `
      <table class="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>7zip-mac</th>
            <th>Keka</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price</td>
            <td>Free (MIT)</td>
            <td>Free (donation) / App Store paid</td>
          </tr>
          <tr>
            <td>Engine</td>
            <td>Official 7-Zip CLI (<code>7zz</code>)</td>
            <td>Own stack; strong multi-format support</td>
          </tr>
          <tr>
            <td>UI</td>
            <td>Finder Services + temp browse</td>
            <td>Full native GUI + Drop Zone</td>
          </tr>
          <tr>
            <td>Create .7z</td>
            <td>Yes (right-click Compress)</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Extract .7z</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Best for</td>
            <td>Windows switchers who want 7-Zip feel, minimal install</td>
            <td>Users who want a dedicated archive app</td>
          </tr>
        </tbody>
      </table>

      <h2>When to choose 7zip-mac</h2>
      <ul>
        <li>You specifically search for <strong>7-Zip for Mac</strong> and want the official engine.</li>
        <li>You live in Finder and want Services, not another dock app.</li>
        <li>You want a one-line install and easy uninstall of only the Services.</li>
        <li>You are fine browsing via a temp extract folder instead of an archive tree UI.</li>
      </ul>

      <h2>When to choose Keka</h2>
      <ul>
        <li>You want a polished Mac-native window for every archive type.</li>
        <li>You compress many formats (7z, zip, tar, iso, etc.) daily from a GUI.</li>
        <li>You prefer App Store distribution or Setapp-style updates.</li>
      </ul>

      <h2>Can you use both?</h2>
      <p>
        Yes. 7zip-mac only adds Services that call <code>7zz</code>. It does not conflict with Keka.
        Many people keep Keka for rare formats and use 7zip-mac for quick .7z compress/extract.
      </p>

      <div class="callout">
        <p class="callout-title">Try 7zip-mac free</p>
        <div class="callout-install">
          <code>curl -fsSL https://chengsokdara.github.io/7z | bash</code>
          <button type="button" class="btn btn-ghost" data-copy="short">Copy</button>
        </div>
      </div>
    `,
  },
  {
    slug: "7zip-vs-the-unarchiver",
    title: "7-Zip for Mac vs The Unarchiver",
    description:
      "Compare opening 7z on Mac with 7zip-mac versus The Unarchiver. Extraction-only free app vs full compress + extract with official 7zz.",
    h1: "7-Zip for Mac vs The Unarchiver",
    dek: "The Unarchiver is a classic free extractor on Mac. 7zip-mac adds compression and a 7-Zip-style Finder workflow using official 7zz.",
    keywords:
      "the unarchiver vs 7zip, open 7z mac unarchiver, 7zip alternative mac free",
    schemaType: "Article",
    updated: "2026-08-10",
    body: `
      <table class="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>7zip-mac</th>
            <th>The Unarchiver</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price</td>
            <td>Free (MIT)</td>
            <td>Free (App Store / MacPaw)</td>
          </tr>
          <tr>
            <td>Extract .7z</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Create .7z</td>
            <td>Yes</td>
            <td>No (extract-focused)</td>
          </tr>
          <tr>
            <td>Legacy formats</td>
            <td>Depends on 7zz</td>
            <td>Excellent (StuffIt, old RAR, etc.)</td>
          </tr>
          <tr>
            <td>Workflow</td>
            <td>Finder Services</td>
            <td>Default app / open-with</td>
          </tr>
        </tbody>
      </table>

      <h2>Pick The Unarchiver if</h2>
      <ul>
        <li>You mostly <strong>extract</strong> and rarely create archives.</li>
        <li>You hit weird legacy formats from old disks or downloads.</li>
        <li>You want a simple App Store install with double-click open.</li>
      </ul>

      <h2>Pick 7zip-mac if</h2>
      <ul>
        <li>You need to <strong>create</strong> high-ratio <code>.7z</code> archives on Mac.</li>
        <li>You want the same engine Windows teammates use (7-Zip).</li>
        <li>You prefer a right-click Services workflow over a separate unarchiver app.</li>
      </ul>

      <p>
        Also see <a href="../open-7z-on-mac/">how to open 7z on Mac</a> and
        <a href="../7zip-vs-keka/">7zip-mac vs Keka</a>.
      </p>

      <div class="callout">
        <p class="callout-title">Install 7-Zip Finder Services</p>
        <div class="callout-install">
          <code>curl -fsSL https://chengsokdara.github.io/7z | bash</code>
          <button type="button" class="btn btn-ghost" data-copy="short">Copy</button>
        </div>
      </div>
    `,
  },
  {
    slug: "finder-services-7zip",
    title: "Finder Services for 7-Zip on Mac: Right-Click Compress & Extract",
    description:
      "Use Finder Services (or Quick Actions) to compress and extract 7z on Mac. Where the menu is, how to enable it, and what each 7zip-mac action does.",
    h1: "Finder Services for 7-Zip on Mac",
    dek: "After installing 7zip-mac, right-click workflows live under Services. Here is where to find them, how to enable them, and what each action does.",
    keywords:
      "finder services 7zip, right click compress 7z mac, quick actions 7z macOS, compress with 7-zip finder",
    schemaType: "Article",
    updated: "2026-08-10",
    body: `
      <h2>Where is Compress with 7-Zip?</h2>
      <ol>
        <li>Select files or folders in Finder.</li>
        <li>Right-click (or Control-click).</li>
        <li>Open <strong>Services</strong> (on some older macOS: <strong>Quick Actions</strong>).</li>
        <li>Choose <strong>Compress with 7-Zip</strong>.</li>
      </ol>
      <p>
        A <code>.7z</code> archive is created next to the selection
        (<code>Name-2.7z</code> if the name already exists).
      </p>

      <h2>The four Services</h2>
      <ul>
        <li><strong>Compress with 7-Zip</strong> — create <code>.7z</code> next to selection.</li>
        <li><strong>Uncompress with 7-Zip Here</strong> — extract into the archive’s folder.</li>
        <li><strong>Uncompress with 7-Zip to Folder</strong> — extract into a named folder.</li>
        <li><strong>Open with 7-Zip</strong> — temp extract + Finder browse.</li>
      </ul>

      <h2>If Services do not appear</h2>
      <ol>
        <li>Re-run the <a href="../install-7zip-mac/">install command</a>.</li>
        <li>Relaunch Finder.</li>
        <li>
          System Settings → Keyboard → Keyboard Shortcuts → <strong>Services</strong> —
          enable the 7-Zip entries under Files and Folders.
        </li>
        <li>Log out / reboot once after first install on stubborn machines.</li>
      </ol>

      <h2>How this differs from Windows 7-Zip</h2>
      <p>
        On Windows, 7-Zip adds a rich context menu and a GUI. On Mac, Homebrew provides
        <code>7zz</code> only. 7zip-mac recreates the most useful context actions as Automator
        Services. There is no full 7-Zip File Manager window; Open uses a temporary Finder folder.
      </p>

      <div class="callout">
        <p class="callout-title">Install</p>
        <div class="callout-install">
          <code>curl -fsSL https://chengsokdara.github.io/7z | bash</code>
          <button type="button" class="btn btn-ghost" data-copy="short">Copy</button>
        </div>
      </div>
    `,
  },
  {
    slug: "uninstall",
    title: "Uninstall 7zip-mac: Remove Finder 7-Zip Services",
    description:
      "How to uninstall 7zip-mac on macOS. Removes Finder Services only; does not remove Homebrew or the sevenzip formula unless you choose to.",
    h1: "Uninstall 7zip-mac",
    dek: "Remove the Finder Services installed by 7zip-mac in one command. Optional steps if you also want to remove the sevenzip Homebrew package.",
    keywords: "uninstall 7zip mac, remove 7-zip finder services, uninstall sevenzip macOS",
    schemaType: "HowTo",
    updated: "2026-08-10",
    body: `
      <h2>Remove Finder Services only</h2>
      <div class="callout">
        <p class="callout-title">One-liner</p>
        <div class="callout-install">
          <code>curl -fsSL https://chengsokdara.github.io/7z | bash -s -- --uninstall</code>
          <button type="button" class="btn btn-ghost" data-copy="uninstall">Copy</button>
        </div>
      </div>
      <p>Or from a clone:</p>
      <pre><code>bash install.sh --uninstall
# or
bash uninstall.sh</code></pre>
      <p>
        This deletes the Automator workflows under <code>~/Library/Services</code> that 7zip-mac
        created. It does <strong>not</strong> uninstall Homebrew or <code>sevenzip</code>.
      </p>

      <h2>Optional: remove the 7zz binary (Homebrew)</h2>
      <pre><code>brew uninstall sevenzip</code></pre>
      <p>Only do this if nothing else on your system needs <code>7zz</code>.</p>

      <h2>Confirm removal</h2>
      <ul>
        <li>Right-click in Finder → Services: 7-Zip items should be gone.</li>
        <li><code>ls ~/Library/Services | grep -i 7-Zip</code> should print nothing related.</li>
      </ul>
    `,
  },
  {
    slug: "faq",
    title: "7-Zip for Mac FAQ: Install, Open 7z, Finder Menu",
    description:
      "FAQ for 7-Zip on Mac with 7zip-mac: install, open 7z, Finder Services, Homebrew, uninstall, free license, and GUI alternatives.",
    h1: "7-Zip for Mac FAQ",
    dek: "Short answers to the questions people search when they need 7-Zip on macOS.",
    keywords:
      "7zip for mac faq, is there 7zip for mac, open 7z mac faq, free 7zip macOS",
    schemaType: "FAQPage",
    updated: "2026-08-10",
    body: `
      <div class="faq">
        <details open>
          <summary>Is there a 7-Zip for Mac?</summary>
          <p>
            Yes. Official 7-Zip provides a macOS console build, and Homebrew packages it as
            <code>sevenzip</code> (<code>7zz</code>). 7zip-mac adds Finder Services so you can use
            it from right-click menus without living in Terminal.
          </p>
        </details>
        <details>
          <summary>How do I install 7-Zip for Mac?</summary>
          <p>
            Run
            <code>curl -fsSL https://chengsokdara.github.io/7z | bash</code>
            or see the full <a href="../install-7zip-mac/">install guide</a>.
          </p>
        </details>
        <details>
          <summary>How do I open a 7z file on Mac?</summary>
          <p>
            After install: right-click → Services → Open with 7-Zip, or Uncompress Here / to Folder.
            Step-by-step: <a href="../open-7z-on-mac/">open 7z on Mac</a>.
          </p>
        </details>
        <details>
          <summary>Is 7-Zip for Mac free?</summary>
          <p>
            7zip-mac is free and MIT licensed. 7-Zip itself is free software from 7-zip.org.
            Optional support via GitHub Sponsors is never required.
          </p>
        </details>
        <details>
          <summary>Is this the official 7-Zip app?</summary>
          <p>
            No. Not affiliated with 7-zip.org or Igor Pavlov. This project installs Finder Services
            that call the official CLI (<code>7zz</code>). “7-Zip” is used descriptively for people
            searching for 7-Zip on Mac.
          </p>
        </details>
        <details>
          <summary>Do I need Homebrew?</summary>
          <p>
            Only if <code>7zz</code> is missing. The installer runs
            <code>brew install sevenzip</code> when needed.
          </p>
        </details>
        <details>
          <summary>Where is the menu in Finder?</summary>
          <p>
            <strong>Services</strong> on modern macOS (sometimes Quick Actions on older versions).
            Details: <a href="../finder-services-7zip/">Finder Services guide</a>.
          </p>
        </details>
        <details>
          <summary>How do I uninstall?</summary>
          <p>
            <a href="../uninstall/">Uninstall guide</a> —
            <code>curl -fsSL https://chengsokdara.github.io/7z | bash -s -- --uninstall</code>
          </p>
        </details>
      </div>
    `,
  },
  {
    slug: "guides",
    title: "7-Zip for Mac Guides: Install, Open 7z, Compare Apps",
    description:
      "All guides for 7-Zip on Mac with 7zip-mac: install, open and extract 7z, Finder Services, uninstall, and comparisons with Keka and The Unarchiver.",
    h1: "Guides: 7-Zip for Mac",
    dek: "Documentation and how-tos for installing and using 7-Zip on macOS with free Finder Services.",
    keywords: "7zip for mac guides, 7-zip macOS tutorial, open 7z mac guide",
    schemaType: "CollectionPage",
    updated: "2026-08-10",
    body: `
      <div class="guides-grid">
        <a class="guide-card" href="../open-7z-on-mac/">
          <div class="path">how-to</div>
          <h3>Open 7z files on Mac</h3>
          <p>Extract and browse .7z when Archive Utility will not open them.</p>
        </a>
        <a class="guide-card" href="../install-7zip-mac/">
          <div class="path">install</div>
          <h3>Install 7-Zip on Mac</h3>
          <p>One-line setup for 7zz + Finder Services.</p>
        </a>
        <a class="guide-card" href="../finder-services-7zip/">
          <div class="path">finder</div>
          <h3>Finder Services for 7-Zip</h3>
          <p>Right-click compress, extract, and open.</p>
        </a>
        <a class="guide-card" href="../7zip-vs-keka/">
          <div class="path">compare</div>
          <h3>7zip-mac vs Keka</h3>
          <p>When to use official 7zz Services vs a full GUI archiver.</p>
        </a>
        <a class="guide-card" href="../7zip-vs-the-unarchiver/">
          <div class="path">compare</div>
          <h3>vs The Unarchiver</h3>
          <p>Extract-only classic vs compress + extract with 7-Zip.</p>
        </a>
        <a class="guide-card" href="../uninstall/">
          <div class="path">support</div>
          <h3>Uninstall</h3>
          <p>Remove Services without breaking the rest of your Mac.</p>
        </a>
        <a class="guide-card" href="../faq/">
          <div class="path">faq</div>
          <h3>FAQ</h3>
          <p>Short answers to common 7-Zip on Mac questions.</p>
        </a>
      </div>
    `,
  },
];

const relatedBlock = `
  <aside class="related" aria-labelledby="related-title">
    <h2 id="related-title">More guides</h2>
    <ul class="related-list">
      <li><a href="../open-7z-on-mac/"><strong>Open 7z on Mac</strong> Extract and browse archives</a></li>
      <li><a href="../install-7zip-mac/"><strong>Install 7-Zip on Mac</strong> One-line Finder setup</a></li>
      <li><a href="../finder-services-7zip/"><strong>Finder Services</strong> Right-click compress &amp; extract</a></li>
      <li><a href="../7zip-vs-keka/"><strong>vs Keka</strong> GUI archiver comparison</a></li>
      <li><a href="../faq/"><strong>FAQ</strong> Common questions</a></li>
      <li><a href="../guides/"><strong>All guides</strong> Full documentation index</a></li>
    </ul>
  </aside>
`;

function jsonLd(page) {
  const url = `${SITE}/${page.slug}/`;
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": `${SITE}/#website` },
      dateModified: page.updated,
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "7-Zip for Mac",
          item: `${SITE}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.h1,
          item: url,
        },
      ],
    },
  ];

  if (page.schemaType === "HowTo" && page.slug === "open-7z-on-mac") {
    graph.push({
      "@type": "HowTo",
      name: "How to open a 7z file on Mac with 7zip-mac",
      description: page.description,
      totalTime: "PT5M",
      tool: { "@type": "HowToTool", name: "Terminal" },
      step: [
        {
          "@type": "HowToStep",
          name: "Install 7zip-mac",
          text: "Run: curl -fsSL https://chengsokdara.github.io/7z | bash",
        },
        {
          "@type": "HowToStep",
          name: "Right-click the archive",
          text: "In Finder, right-click the .7z file and open Services.",
        },
        {
          "@type": "HowToStep",
          name: "Open or extract",
          text: "Choose Open with 7-Zip to browse, or Uncompress Here / to Folder for a permanent extract.",
        },
      ],
    });
  }

  if (page.schemaType === "HowTo" && page.slug === "install-7zip-mac") {
    graph.push({
      "@type": "HowTo",
      name: "Install 7-Zip for Mac with Finder Services",
      description: page.description,
      totalTime: "PT3M",
      step: [
        {
          "@type": "HowToStep",
          name: "Open Terminal",
          text: "Open the Terminal app on macOS.",
        },
        {
          "@type": "HowToStep",
          name: "Run the installer",
          text: "Paste: curl -fsSL https://chengsokdara.github.io/7z | bash",
        },
        {
          "@type": "HowToStep",
          name: "Use Services in Finder",
          text: "Right-click files or archives and choose Compress or Uncompress with 7-Zip.",
        },
      ],
    });
  }

  if (page.schemaType === "FAQPage" && page.slug === "faq") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is there a 7-Zip for Mac?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Official 7-Zip provides a macOS console build via Homebrew as sevenzip (7zz). 7zip-mac adds Finder Services for right-click compress and extract.",
          },
        },
        {
          "@type": "Question",
          name: "How do I open a 7z file on Mac?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Install 7zip-mac, then right-click the archive → Services → Open with 7-Zip or Uncompress with 7-Zip Here / to Folder.",
          },
        },
        {
          "@type": "Question",
          name: "Is 7-Zip for Mac free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. 7zip-mac is MIT licensed and free. 7-Zip itself is free software.",
          },
        },
        {
          "@type": "Question",
          name: "Is 7zip-mac the official 7-Zip app?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. It is not affiliated with 7-zip.org. It installs Finder Services that call the official 7zz CLI.",
          },
        },
      ],
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

function pageHtml(page) {
  const url = `${SITE}/${page.slug}/`;
  const showRelated = page.slug !== "guides";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.title)} | 7zip-mac</title>
    <meta name="description" content="${escapeAttr(page.description)}" />
    <meta name="keywords" content="${escapeAttr(page.keywords)}" />
    <meta name="author" content="Cheng Sokdara" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="7zip-mac" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeAttr(page.title)}" />
    <meta property="og:description" content="${escapeAttr(page.description)}" />
    <meta property="og:image" content="${SITE}/og.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(page.title)}" />
    <meta name="twitter:description" content="${escapeAttr(page.description)}" />
    <meta name="twitter:image" content="${SITE}/og.png" />

    <meta name="theme-color" content="#0d1117" />
    <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../styles.css" />

    <script type="application/ld+json">
${jsonLd(page)}
    </script>
  </head>
  <body>
    <a class="skip" href="#content">Skip to content</a>
    <div class="page-shell">
      <header class="nav">
        <div class="wrap nav-inner">
          <a class="brand" href="../" aria-label="7zip-mac home">
            <img class="brand-mark" src="../favicon.svg" width="28" height="28" alt="" />
            <span>7zip-mac</span>
          </a>
          <nav class="nav-links" aria-label="Primary">
            <a href="../#install">Install</a>
            <a href="../guides/">Guides</a>
            <a href="../faq/">FAQ</a>
            <a href="../#support">Support</a>
            <a data-link="repo" href="https://github.com/chengsokdara/7zip-mac" rel="noopener">GitHub</a>
          </nav>
        </div>
      </header>

      <main id="content">
        <article class="wrap">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="../">Home</a>
            <span aria-hidden="true">/</span>
            <a href="../guides/">Guides</a>
            <span aria-hidden="true">/</span>
            <span>${escapeHtml(page.h1)}</span>
          </nav>

          <header class="article-header">
            <h1>${escapeHtml(page.h1)}</h1>
            <p class="dek">${escapeHtml(page.dek)}</p>
            <p class="article-meta">Updated ${page.updated} · Free &amp; open source</p>
          </header>

          <div class="prose">
            ${page.body}
            ${showRelated ? relatedBlock : ""}
          </div>
        </article>
      </main>

      <footer class="footer">
        <div class="wrap footer-inner">
          <div>
            <div>
              <strong style="color: var(--muted)">7zip-mac</strong>
              · MIT · <span id="year">${YEAR}</span>
            </div>
            <div>
              <a data-link="repo" href="https://github.com/chengsokdara/7zip-mac" rel="noopener">Source</a>
              ·
              <a href="../">7-Zip for Mac</a>
              ·
              <a href="https://www.7-zip.org/" rel="noopener noreferrer">7-Zip.org</a>
            </div>
          </div>
          <div class="disclaimer">
            Not affiliated with 7-Zip.org or Igor Pavlov. This project installs Finder Services that call the
            7-Zip CLI (<code>7zz</code>) from Homebrew.
          </div>
        </div>
      </footer>
    </div>

    <div id="toast" class="toast" role="status" aria-live="polite"></div>
    <script src="../site-config.js"></script>
    <script src="../main.js"></script>
  </body>
</html>
`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

// Check for .btn styles - may need minimal button style if missing
for (const page of guides) {
  const dir = path.join(__dirname, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, "index.html");
  fs.writeFileSync(out, pageHtml(page), "utf8");
  console.log("wrote", path.relative(path.join(__dirname, ".."), out));
}

// sitemap
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly", lastmod: today },
  ...guides.map((g) => ({
    loc: `${SITE}/${g.slug}/`,
    priority: g.slug === "guides" ? "0.9" : "0.8",
    changefreq: "monthly",
    lastmod: g.updated,
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemap, "utf8");
console.log("wrote docs/sitemap.xml");
