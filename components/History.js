const historyColors = document.getElementById("historyColors");
const MAX_HISTORY = 9;
let history = [];

function addToHistory(hex) {
  if (history[0] === hex) return;
  history = history.filter((c) => c !== hex);
  history.unshift(hex);
  if (history.length > MAX_HISTORY) history.pop();
  renderHistory();
}

function renderHistory() {
  historyColors.innerHTML = "";
  history.forEach(function (hex) {
    const item = document.createElement("button");
    item.className = "picker__history-item";
    item.style.backgroundColor = hex;
    item.title = hex;
    item.addEventListener("click", function () {
      applyColorFromHex(hex);
    });
    historyColors.appendChild(item);
  });
}
