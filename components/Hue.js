const hueCanvas = document.getElementById("hueCanvas");
const hueCtx = hueCanvas.getContext("2d");
const hueCursor = document.getElementById("hueCursor");

let hue = 0;

function setupHueCanvas() {
  hueCanvas.width = hueCanvas.parentElement.offsetWidth;
  hueCanvas.height = hueCanvas.parentElement.offsetHeight;
  drawHueCanvas();
  updateHueCursorPosition();
}

function drawHueCanvas() {
  const w = hueCanvas.width;
  const h = hueCanvas.height;
  const grad = hueCtx.createLinearGradient(0, 0, w, 0);
  for (let i = 0; i <= 360; i += 30) {
    grad.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
  }
  hueCtx.fillStyle = grad;
  hueCtx.fillRect(0, 0, w, h);
}

function updateHueCursorPosition() {
  hueCursor.style.left = `${(hue / 360) * hueCanvas.width}px`;
}

function handleHueMove(e) {
  const rect = hueCanvas.getBoundingClientRect();
  hue = Math.max(
    0,
    Math.min(360, ((e.clientX - rect.left) / rect.width) * 360),
  );
  updateHueCursorPosition();
  drawColorCanvas();
  updateColor();
}

function initHueCanvas() {
  setupHueCanvas();

  let dragging = false;
  hueCanvas.addEventListener("mousedown", (e) => {
    dragging = true;
    handleHueMove(e);
  });
  window.addEventListener("mousemove", (e) => {
    if (dragging) handleHueMove(e);
  });
  window.addEventListener("mouseup", () => {
    if (dragging) updateColorAndSave();
    dragging = false;
  });

  hueCanvas.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      handleHueMove(e.touches[0]);
      e.preventDefault();
    },
    { passive: false },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (dragging) handleHueMove(e.touches[0]);
    },
    { passive: false },
  );
  window.addEventListener("touchend", () => {
    if (dragging) updateColorAndSave();
    dragging = false;
  });

  window.addEventListener("resize", setupHueCanvas);
}

function getHue() {
  return hue;
}
function setHue(h) {
  hue = h;
}
