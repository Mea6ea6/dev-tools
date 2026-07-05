const colorPreview = document.getElementById("colorPreview");
const hexValue = document.getElementById("hexValue");
const rgbValue = document.getElementById("rgbValue");
const hslValue = document.getElementById("hslValue");

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0").toUpperCase()).join("")
  );
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function updateColor() {
  const { r, g, b } = getColorFromCanvas();
  const hex = rgbToHex(r, g, b);
  const [h, s, l] = rgbToHsl(r, g, b);

  hexValue.value = hex;
  rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
  hslValue.textContent = `hsl(${h}, ${s}%, ${l}%)`;
  colorPreview.style.backgroundColor = hex;

  updateSlidersFromColor(h, s, l);
}

function updateColorAndSave() {
  updateColor();
  addToHistory(hexValue.value);
}

function applyColorFromHex(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const [h, s, l] = rgbToHsl(r, g, b);

  setHue(h);
  drawColorCanvas();
  updateHueCursorPosition();

  const newX = s / 100;
  const newY = Math.max(0, Math.min(1, (100 - l * 2) / 100));
  setCursor(newX, newY);
  updateCursorPosition();

  const sliderH = document.getElementById("sliderH");
  const sliderS = document.getElementById("sliderS");
  const sliderL = document.getElementById("sliderL");
  sliderH.value = h;
  sliderS.value = s;
  sliderL.value = l;
  document.getElementById("sliderHValue").textContent = h;
  document.getElementById("sliderSValue").textContent = s;
  document.getElementById("sliderLValue").textContent = l;

  sliderS.style.background = `linear-gradient(to right, hsl(${h}, 0%, 50%), hsl(${h}, 100%, 50%))`;
  sliderL.style.background = `linear-gradient(to right, #000, hsl(${h}, 100%, 50%), #fff)`;

  hexValue.value = hex;
  rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
  hslValue.textContent = `hsl(${h}, ${s}%, ${l}%)`;
  colorPreview.style.backgroundColor = hex;
}
