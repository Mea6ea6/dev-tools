const sliderH = document.getElementById("sliderH");
const sliderS = document.getElementById("sliderS");
const sliderL = document.getElementById("sliderL");
const sliderHValue = document.getElementById("sliderHValue");
const sliderSValue = document.getElementById("sliderSValue");
const sliderLValue = document.getElementById("sliderLValue");

function updateSlidersFromColor(h, s, l) {
  sliderH.value = getHue();
  sliderS.value = s;
  sliderL.value = l;
  sliderHValue.textContent = Math.round(getHue());
  sliderSValue.textContent = s;
  sliderLValue.textContent = l;
  updateSliderGradients();
}

function updateSliderGradients() {
  const h = getHue();
  sliderS.style.background = `linear-gradient(to right, hsl(${h}, 0%, 50%), hsl(${h}, 100%, 50%))`;
  sliderL.style.background = `linear-gradient(to right, #000, hsl(${h}, 100%, 50%), #fff)`;
}

function initSliders() {
  sliderH.addEventListener("input", function () {
    setHue(parseInt(sliderH.value));
    sliderHValue.textContent = sliderH.value;
    setCursor(
      parseInt(sliderS.value) / 100,
      Math.max(0, Math.min(1, (100 - parseInt(sliderL.value)) / 50)),
    );
    updateHueCursorPosition();
    drawColorCanvas();
    updateCursorPosition();
    updateColor();
    updateSliderGradients();
  });

  sliderS.addEventListener("input", function () {
    sliderSValue.textContent = sliderS.value;
    setCursor(parseInt(sliderS.value) / 100, getCursorY());
    updateCursorPosition();
    updateColor();
  });

  sliderL.addEventListener("input", function () {
    sliderLValue.textContent = sliderL.value;
    setCursor(
      getCursorX(),
      Math.max(0, Math.min(1, (100 - parseInt(sliderL.value)) / 50)),
    );
    updateCursorPosition();
    updateColor();
  });

  sliderH.addEventListener("change", function () {
    updateColorAndSave();
  });
  sliderS.addEventListener("change", function () {
    updateColorAndSave();
  });
  sliderL.addEventListener("change", function () {
    updateColorAndSave();
  });
}
