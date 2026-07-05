function initCopyButtons() {
  const copyBtns = document.querySelectorAll(".picker__copy");
  copyBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const el = document.getElementById(btn.dataset.target);
      const text = el.tagName === "INPUT" ? el.value : el.textContent;
      navigator.clipboard
        .writeText(text)
        .then(function () {
          btn.classList.add("copied");
          setTimeout(function () {
            btn.classList.remove("copied");
          }, 1500);
        })
        .catch(function () {});
    });
  });
}
