const codeInput = document.getElementById("codeInput");
const codeHighlight = document.getElementById("codeHighlight");
const codeHighlightInner = codeHighlight.querySelector("code");

const DEFAULT_CODE = `// Write JavaScript here and press Run (or Ctrl/Cmd + Enter)
console.log("Hello from Dev Tools!");

function sum(a, b) {
  return a + b;
}

console.log("2 + 3 =", sum(2, 3));
`;

// Простой однопроходный токенайзер на regex — без внешних библиотек.
// Не претендует на полный разбор JS, только на "похоже на VS Code" для
// самых частых случаев: комментарии, строки, числа, ключевые слова,
// встроенные объекты и имена вызываемых функций.

const JS_KEYWORDS = "const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|new|this|typeof|instanceof|in|of|try|catch|finally|throw|async|await|yield|import|export|default|from|as|static|get|set|super|void|delete";
const JS_LITERALS = "true|false|null|undefined|NaN|Infinity";
const JS_BUILTINS = "console|Math|JSON|Array|Object|Promise|Map|Set|WeakMap|WeakSet|Number|String|Boolean|Symbol|Date|RegExp|Error|window|document|self";

const TOKEN_REGEX = new RegExp(
  [
    "(\\/\\/[^\\n]*)",                       // 1: line comment
    "(\\/\\*[\\s\\S]*?\\*\\/)",              // 2: block comment
    "(`(?:\\\\.|[^`\\\\])*`)",               // 3: template string
    '("(?:\\\\.|[^"\\\\])*")',               // 4: double-quoted string
    "('(?:\\\\.|[^'\\\\])*')",               // 5: single-quoted string
    "(\\b\\d+\\.?\\d*\\b)",                  // 6: number
    "\\b(" + JS_KEYWORDS + ")\\b",           // 7: keyword
    "\\b(" + JS_LITERALS + ")\\b",           // 8: literal
    "\\b(" + JS_BUILTINS + ")\\b",           // 9: builtin
    "([a-zA-Z_$][\\w$]*)(?=\\s*\\()",        // 10: function call name
  ].join("|"),
  "g"
);

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightCode(code) {
  let html = "";
  let lastIndex = 0;

  code.replace(TOKEN_REGEX, function (match, comment1, comment2, tmpl, dq, sq, num, kw, lit, builtin, fn, offset) {
    html += escapeHtml(code.slice(lastIndex, offset));

    let cls = null;
    if (comment1 || comment2) cls = "tok-comment";
    else if (tmpl || dq || sq) cls = "tok-string";
    else if (num) cls = "tok-number";
    else if (kw) cls = "tok-keyword";
    else if (lit) cls = "tok-literal";
    else if (builtin) cls = "tok-builtin";
    else if (fn) cls = "tok-function";

    html += cls ? '<span class="' + cls + '">' + escapeHtml(match) + "</span>" : escapeHtml(match);
    lastIndex = offset + match.length;
    return match;
  });

  html += escapeHtml(code.slice(lastIndex));
  return html;
}

function renderHighlight() {
  // Пустая строка в конце нужна, чтобы высота <pre> совпадала с textarea
  // (иначе последняя пустая строка "теряется" и слои чуть расходятся).
  codeHighlightInner.innerHTML = highlightCode(codeInput.value) + "\n";
}

function syncHighlightScroll() {
  codeHighlight.scrollTop = codeInput.scrollTop;
  codeHighlight.scrollLeft = codeInput.scrollLeft;
}

function initHighlight() {
  codeInput.value = loadSavedCode() || DEFAULT_CODE;
  renderHighlight();

  codeInput.addEventListener("input", function () {
    saveCode(codeInput.value);
    renderHighlight();
  });

  codeInput.addEventListener("scroll", syncHighlightScroll);

  codeInput.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = codeInput.selectionStart;
      const end = codeInput.selectionEnd;
      codeInput.value = codeInput.value.slice(0, start) + "  " + codeInput.value.slice(end);
      codeInput.selectionStart = codeInput.selectionEnd = start + 2;
      saveCode(codeInput.value);
      renderHighlight();
    }
  });
}