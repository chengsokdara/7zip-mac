(function () {
  "use strict";

  var cfg = window.SITE || {};
  var author = cfg.author || {};

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function setHref(sel, url) {
    $all(sel).forEach(function (el) {
      if (url) el.setAttribute("href", url);
    });
  }

  function setText(sel, text) {
    $all(sel).forEach(function (el) {
      if (text != null) el.textContent = text;
    });
  }

  // Wire config-driven links
  setHref("[data-link=repo]", cfg.repo);
  setHref("[data-link=sponsors]", author.sponsors);
  setHref("[data-link=resume]", author.resume);
  setHref("[data-link=portfolio]", author.portfolio);
  setHref("[data-link=hire]", author.hire);
  setHref("[data-link=github]", author.github);
  setHref("[data-link=linkedin]", author.linkedin);
  setText("[data-text=author]", author.name);
  setText("[data-text=install-short]", cfg.installShort);
  setText("[data-text=install-canonical]", cfg.installCanonical);
  setText("[data-text=uninstall]", cfg.uninstall);

  var toast = $("#toast");
  var toastTimer;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (e) {
        reject(e);
      }
      document.body.removeChild(ta);
    });
  }

  $all("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-copy");
      var text =
        key === "canonical"
          ? cfg.installCanonical
          : key === "uninstall"
            ? cfg.uninstall
            : cfg.installShort;
      if (!text) return;
      copyText(text)
        .then(function () {
          showToast("Copied to clipboard");
          var prev = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(function () {
            btn.textContent = prev;
          }, 1200);
        })
        .catch(function () {
          showToast("Copy failed — select the command manually");
        });
    });
  });

  // Year
  var y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
