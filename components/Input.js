function parseAndApply(value) {
  value = value.trim();
  if (/^#?[0-9A-Fa-f]{6}$/.test(value)) {
    const hex = value.startsWith("#") ? value : "#" + value;
    applyColorFromHex(hex.toUpperCase());
    addToHistory(hex.toUpperCase());
    return true;
  }
  return false;
}

function initHexInput(input) {
  input.addEventListener("input", function () {
    let val = input.value;
    if (!val.startsWith("#")) {
      val = "#" + val.replace("#", "");
      input.value = val;
    }
    const clean =
      "#" +
      val
        .slice(1)
        .replace(/[^0-9A-Fa-f]/g, "")
        .slice(0, 6)
        .toUpperCase();
    if (clean !== val) input.value = clean;
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      parseAndApply(input.value);
      input.blur();
    }
    if (e.key === "Escape") {
      updateColor();
      input.blur();
    }
  });

  input.addEventListener("blur", function () {
    updateColor();
  });
}

function initRgbInputs() {
  [
    { el: document.getElementById("rgbR"), max: 255 },
    { el: document.getElementById("rgbG"), max: 255 },
    { el: document.getElementById("rgbB"), max: 255 },
  ].forEach(function ({ el, max }) {
    el.addEventListener("input", function () {
      let v = parseInt(el.value);
      if (isNaN(v)) v = 0;
      if (v > max) {
        v = max;
        el.value = max;
      }
      if (v < 0) {
        v = 0;
        el.value = 0;
      }
      const r = parseInt(rgbR.value) || 0;
      const g = parseInt(rgbG.value) || 0;
      const b = parseInt(rgbB.value) || 0;
      const hex = rgbToHex(r, g, b);
      applyColorFromHex(hex);
    });

    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        el.blur();
      }
      if (e.key === "Escape") {
        updateColor();
        el.blur();
      }
    });

    el.addEventListener("blur", function () {
      updateColor();
    });
  });
}

function initHslInputs() {
  [
    { el: document.getElementById("hslH"), max: 360 },
    { el: document.getElementById("hslS"), max: 100 },
    { el: document.getElementById("hslL"), max: 100 },
  ].forEach(function ({ el, max }) {
    el.addEventListener("input", function () {
      let v = parseInt(el.value);
      if (isNaN(v)) v = 0;
      if (v > max) {
        v = max;
        el.value = max;
      }
      if (v < 0) {
        v = 0;
        el.value = 0;
      }
      const h = parseInt(hslH.value) || 0;
      const s = parseInt(hslS.value) || 0;
      const l = parseInt(hslL.value) || 0;
      const [r, g, b] = hslToRgb(h, s, l);
      const hex = rgbToHex(r, g, b);
      applyColorFromHex(hex);
    });

    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        el.blur();
      }
      if (e.key === "Escape") {
        updateColor();
        el.blur();
      }
    });

    el.addEventListener("blur", function () {
      updateColor();
    });
  });
}

function initInputs() {
  initHexInput(document.getElementById('hexValue'));
}