
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  toggle.setAttribute("aria-pressed", String(isDark));

  toggle.addEventListener("click", () => {
    const nowDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (nowDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      toggle.setAttribute("aria-pressed", "false");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      toggle.setAttribute("aria-pressed", "true");
    }
  });
}

document.addEventListener("DOMContentLoaded", initTheme);
