function initEyedropper() {
  const btn = document.getElementById("eyedropperBtn");
  const note = document.getElementById("eyedropperNote");

  btn.addEventListener("click", function () {
    if (!window.EyeDropper) {
      note.classList.add("visible");
      setTimeout(function () {
        note.classList.remove("visible");
      }, 3000);
      return;
    }
    const eyeDropper = new EyeDropper();
    eyeDropper
      .open()
      .then(function (result) {
        applyColorFromHex(result.sRGBHex.toUpperCase());
        addToHistory(result.sRGBHex.toUpperCase());
      })
      .catch(function () {});
  });
}
