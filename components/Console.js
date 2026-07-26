const consoleOutput = document.getElementById("consoleOutput");
const runStatus = document.getElementById("runStatus");
const clearBtn = document.getElementById("clearBtn");

function setStatus(text, variant) {
  runStatus.textContent = text;
  runStatus.className = "runner__status" + (variant ? " runner__status--" + variant : "");
}

function appendConsoleLine(type, text) {
  const hint = consoleOutput.querySelector(".console-line--hint");
  if (hint) hint.remove();

  const line = document.createElement("p");
  line.className = "console-line console-line--" + type;
  line.textContent = text;
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
  consoleOutput.innerHTML = '<p class="console-line console-line--hint">Console output will appear here — press Run or Ctrl/Cmd + Enter.</p>';
  setStatus("");
}

function initConsole() {
  clearBtn.addEventListener("click", clearConsole);
}