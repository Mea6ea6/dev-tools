
(function () {
  var LEAVE_DELAY = 170;

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isCrossApp(link) {
    return !!(link && link.hasAttribute("data-cross-app"));
  }

  function isInternalNavLink(link) {
    if (!link) return false;
    if (link.target === "_blank" || link.hasAttribute("download")) return false;

    var href = link.getAttribute("href");
    if (!href) return false;
    if (href.startsWith("#")) return false;
    if (isCrossApp(link)) return true;

    if (href.startsWith("http://") || href.startsWith("https://")) return false;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;

    return true;
  }

  function buildHref(link) {
    var href = link.getAttribute("href");
    if (!isCrossApp(link)) return href;

    var theme = localStorage.getItem("theme");
    if (!theme) return href;

    var sep = href.indexOf("?") === -1 ? "?" : "&";
    return href + sep + "theme=" + encodeURIComponent(theme);
  }

  document.addEventListener("click", function (e) {
    if (prefersReducedMotion) return;
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest("a");
    if (!isInternalNavLink(link)) return;

    var href = buildHref(link);

    e.preventDefault();
    document.body.classList.add("is-leaving");

    window.setTimeout(function () {
      window.location.href = href;
    }, LEAVE_DELAY);
  });

  window.addEventListener("pageshow", function (evt) {
    if (evt.persisted) {
      document.body.classList.remove("is-leaving");
    }
  });
})();

function replayEnterAnimation(el) {
  if (!el) return;
  el.classList.remove("content-fade-in");
  void el.offsetWidth;
  el.classList.add("content-fade-in");
}

function staggerChildren(el, selector) {
  if (!el) return;
  var items = selector ? el.querySelectorAll(selector) : el.children;
  Array.prototype.forEach.call(items, function (item, i) {
    item.style.setProperty("--i", i);
  });
}
