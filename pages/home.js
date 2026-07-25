
function renderToolCard(tool) {
  const isActive = !tool.soon;
  const el = document.createElement(isActive ? "a" : "div");

  el.className = "tool-card stagger-item" + (tool.soon ? " tool-card_soon" : "");
  if (isActive) {
    el.href = tool.href;
    if (tool.crossApp) el.setAttribute("data-cross-app", "");
  }

  const badge = tool.soon ? ' <span class="tool-card__badge">Soon</span>' : "";

  el.innerHTML = `
    <div class="tool-card__icon">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        ${tool.icon}
      </svg>
    </div>
    <div class="tool-card__text">
      <h2 class="tool-card__title">${tool.title}${badge}</h2>
      <p class="tool-card__desc">${tool.desc}</p>
    </div>
    <span class="tool-card__arrow">→</span>
  `;

  return el;
}

function renderCardList(list, container) {
  if (!container) return;
  list.forEach(function (item) {
    container.appendChild(renderToolCard(item));
  });
  staggerChildren(container, ".stagger-item");
}

document.addEventListener('DOMContentLoaded', function () {
  renderCardList(TOOLS, document.querySelector('.home-grid'));
  renderCardList(MORE_LINKS, document.querySelector('.more-grid'));
});