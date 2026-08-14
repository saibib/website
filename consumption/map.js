async function loadMedia() {
  const canvas = document.getElementById("media-canvas");
  const buttons = [...document.querySelectorAll("[data-filter]")];

  try {
    const response = await fetch("media.json");
    if (!response.ok) throw new Error("media.json could not be loaded");

    const items = await response.json();
    renderItems(canvas, items, "all");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((current) => current.classList.toggle("is-active", current === button));
        renderItems(canvas, items, filter);
      });
    });
  } catch (error) {
    canvas.innerHTML = `<p class="text-file">could not load media.json</p>`;
  }
}

function renderItems(canvas, items, filter) {
  const visibleItems = (filter === "all"
    ? items
    : items.filter((item) => normalizeType(item.type) === filter))
    .map((item, index) => ({ item, index }))
    .sort((left, right) => dateValue(left.item) - dateValue(right.item) || left.index - right.index)
    .map(({ item }) => item);
  const columns = Math.max(1, Math.ceil(Math.sqrt(visibleItems.length * 1.45)));

  canvas.style.setProperty("--map-columns", columns);
  canvas.innerHTML = visibleItems.map((item) => {
    const type = normalizeType(item.type);
    const title = escapeHtml(String(item.title || "").toLowerCase());
    const tone = escapeHtml(item.tone || "paper");
    const creator = escapeHtml(String(item.creator || "unknown").toLowerCase());

    return `<article class="media-card tone-${tone}" data-type="${escapeHtml(type)}" title="${title} / ${creator}">
      <div class="cover" role="img" aria-label="${title} ${escapeHtml(type)} cover">
        <span class="cover-type">${escapeHtml(type)}</span>
        <div class="cover-heading">
          <strong>${title}</strong>
          <span class="cover-creator">${creator}</span>
        </div>
        <span class="cover-month">${escapeHtml(item.month || "")}</span>
      </div>
    </article>`;
  }).join("");
}

function dateValue(item) {
  const value = Date.parse(item.month || "");
  return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
}

function normalizeType(type) {
  const value = String(type || "").toLowerCase();
  if (value === "film") return "movie";
  return value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

loadMedia();
