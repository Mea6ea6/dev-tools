const canvas = document.getElementById("colorCanvas");
const ctx = canvas.getContext("2d");
const cursor = document.getElementById("cursor");

let cursorX = 1;
let cursorY = 0;

function setupColorCanvas() {
  const wrapper = canvas.parentElement;
  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;
  drawColorCanvas();
  updateCursorPosition();
}

function drawColorCanvas() {
  const w = canvas.width;
  const h = canvas.height;

  const gradH = ctx.createLinearGradient(0, 0, w, 0);
  gradH.addColorStop(0, "white");
  gradH.addColorStop(1, `hsl(${getHue()}, 100%, 50%)`);
  ctx.fillStyle = gradH;
  ctx.fillRect(0, 0, w, h);

  const gradV = ctx.createLinearGradient(0, 0, 0, h);
  gradV.addColorStop(0, "transparent");
  gradV.addColorStop(1, "black");
  ctx.fillStyle = gradV;
  ctx.fillRect(0, 0, w, h);
}

function updateCursorPosition() {
  cursor.style.left = `${cursorX * canvas.width}px`;
  cursor.style.top = `${cursorY * canvas.height}px`;
}

function getColorFromCanvas() {
  if (cursorX < 0.01 && cursorY < 0.01) {
    return { r: 255, g: 255, b: 255 };
  }
  if (cursorX < 0.01 && cursorY > 0.99) {
    return { r: 0, g: 0, b: 0 };
  }
  if (cursorX > 0.99 && cursorY > 0.99) {
    return { r: 0, g: 0, b: 0 };
  }

  const x = Math.min(Math.round(cursorX * (canvas.width - 1)), canvas.width - 1);
  const y = Math.min(Math.round(cursorY * (canvas.height - 1)), canvas.height - 1);
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return { r: pixel[0], g: pixel[1], b: pixel[2] };
}

function handleCanvasMove(e) {
  const rect = canvas.getBoundingClientRect();
  cursorX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  cursorY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
  updateCursorPosition();
  updateColor();
}

function initColorCanvas() {
  setupColorCanvas();

  let dragging = false;
  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    handleCanvasMove(e);
  });
  window.addEventListener("mousemove", (e) => {
    if (dragging) handleCanvasMove(e);
  });
  window.addEventListener("mouseup", () => {
    if (dragging) updateColorAndSave();
    dragging = false;
  });

  canvas.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      handleCanvasMove(e.touches[0]);
      e.preventDefault();
    },
    { passive: false },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (dragging) handleCanvasMove(e.touches[0]);
    },
    { passive: false },
  );
  window.addEventListener("touchend", () => {
    if (dragging) updateColorAndSave();
    dragging = false;
  });

  window.addEventListener("resize", setupColorCanvas);
}

function getCursorX() {
  return cursorX;
}
function getCursorY() {
  return cursorY;
}
function setCursor(x, y) {
  cursorX = x;
  cursorY = y;
}
