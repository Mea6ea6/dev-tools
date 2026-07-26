const runBtn = document.getElementById("runBtn");
const RUN_TIMEOUT_MS = 5000;

// Код воркера собирается как строка и запускается через Blob URL —
// это позволяет обойтись без отдельного .js-файла на сервере.
// Worker выбран вместо простого eval/Function на странице по двум причинам:
// 1) код не имеет доступа к DOM и данным страницы;
// 2) бесконечный цикл (while(true){}) не подвешивает вкладку — worker
//    просто принудительно завершается по таймауту через worker.terminate().
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

function initRunner() {
  runBtn.addEventListener("click", runCode);

  codeInput.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }
  });
}