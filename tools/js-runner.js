
const STORAGE_KEY = "js-runner:code";
const RUN_TIMEOUT_MS = 5000;

const codeInput = document.getElementById("codeInput");
const runBtn = document.getElementById("runBtn");
const clearBtn = document.getElementById("clearBtn");
const consoleOutput = document.getElementById("consoleOutput");
const runStatus = document.getElementById("runStatus");

const DEFAULT_CODE = `Write JavaScript here and press Run (or Ctrl/Cmd + Enter)
console.log("Hello from Dev Tools!");

function sum(a, b) {
  return a + b;
}

console.log("2 + 3 =", sum(2, 3));
`;

const WORKER_SOURCE = `
  function formatValue(v) {
    if (typeof v === "string") return v;
    if (v instanceof Error) return v.stack || (v.name + ": " + v.message);
    try {
      return JSON.stringify(v, null, 2);
    } catch (e) {
      return String(v);
    }
  }

  function send(type, args) {
    var text = Array.prototype.map.call(args, formatValue).join(" ");
    self.postMessage({ type: type, text: text });
  }

  console.log = function () { send("log", arguments); };
  console.info = function () { send("info", arguments); };
  console.warn = function () { send("warn", arguments); };
  console.error = function () { send("error", arguments); };

  self.onmessage = function (e) {
    try {
      (new Function(e.data))();
    } catch (err) {
      send("error", [err]);
    }
    self.postMessage({ type: "done" });
  };

  self.onerror = function (message) {
    self.postMessage({ type: "error", text: String(message) });
    self.postMessage({ type: "done" });
  };
`;

let worker = null;
let timeoutId = null;

function loadSavedCode() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function saveCode(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (e) {
    
  }
}

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
  consoleOutput.innerHTML = '<p class="console-line console-line--hint">Console output will appear here. <br><br>Press "Run" or "Ctrl/Cmd + Enter".</p>';
  setStatus("");
}

function stopWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function runCode() {
  stopWorker();
  consoleOutput.innerHTML = "";
  runBtn.disabled = true;
  setStatus("Running…", "running");

  const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
  const blobUrl = URL.createObjectURL(blob);
  worker = new Worker(blobUrl);

  let sawError = false;

  worker.onmessage = function (e) {
    const { type, text } = e.data;
    if (type === "done") {
      stopWorker();
      URL.revokeObjectURL(blobUrl);
      runBtn.disabled = false;
      setStatus(sawError ? "Error" : "Done", sawError ? "error" : "ok");
      return;
    }
    if (type === "error") sawError = true;
    appendConsoleLine(type, text);
  };

  worker.onerror = function (e) {
    sawError = true;
    appendConsoleLine("error", e.message || "Unknown worker error");
    stopWorker();
    URL.revokeObjectURL(blobUrl);
    runBtn.disabled = false;
    setStatus("Error", "error");
  };

  timeoutId = setTimeout(function () {
    if (!worker) return;
    appendConsoleLine("error", "Execution timed out after " + (RUN_TIMEOUT_MS / 1000) + "s (possible infinite loop) — stopped.");
    stopWorker();
    URL.revokeObjectURL(blobUrl);
    runBtn.disabled = false;
    setStatus("Timed out", "error");
  }, RUN_TIMEOUT_MS);

  worker.postMessage(codeInput.value);
}

document.addEventListener("DOMContentLoaded", function () {
  codeInput.value = loadSavedCode() || DEFAULT_CODE;

  runBtn.addEventListener("click", runCode);
  clearBtn.addEventListener("click", clearConsole);

  codeInput.addEventListener("input", function () {
    saveCode(codeInput.value);
  });

  codeInput.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const start = codeInput.selectionStart;
      const end = codeInput.selectionEnd;
      codeInput.value = codeInput.value.slice(0, start) + "  " + codeInput.value.slice(end);
      codeInput.selectionStart = codeInput.selectionEnd = start + 2;
    }
  });
});