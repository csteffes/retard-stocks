const picks = Array.isArray(window.PICKS) ? [...window.PICKS] : [];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateString) {
  return dateFormatter.format(parseDate(dateString));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatStocksCovered(stocksCovered) {
  if (Array.isArray(stocksCovered) && stocksCovered.length > 0) {
    return stocksCovered.join(", ");
  }

  return "";
}

function sortPicksDescending(items) {
  return items.sort((left, right) => parseDate(right.date) - parseDate(left.date));
}

function renderLatestPicks() {
  const container = document.querySelector("[data-latest-picks]");

  if (!container || picks.length === 0) {
    return;
  }

  const latest = sortPicksDescending([...picks]).slice(0, 3);

  container.innerHTML = latest
    .map(
      (pick) => `
        <article class="pick-card">
          <p class="pick-card-kicker">${escapeHtml(formatDate(pick.date))}</p>
          <h3>
            <a href="${escapeHtml(pick.href)}">${escapeHtml(pick.title)}</a>
          </h3>
          <p class="stocks-covered-line">
            <span class="stocks-covered-label">Stocks Covered</span>
            <span class="stocks-covered-value">${escapeHtml(
              formatStocksCovered(pick.stocksCovered)
            )}</span>
          </p>
          <p class="pick-meta">
            <span class="tag">${escapeHtml(pick.classification)}</span>
            <span>${escapeHtml(pick.horizon)}</span>
          </p>
          <p>${escapeHtml(pick.thesis)}</p>
        </article>
      `
    )
    .join("");
}

function renderArchive() {
  const container = document.querySelector("[data-archive-list]");

  if (!container || picks.length === 0) {
    return;
  }

  const ordered = sortPicksDescending([...picks]);

  container.innerHTML = ordered
    .map(
      (pick) => `
        <li class="archive-item">
          <article class="archive-item-row">
            <div class="archive-date-column">
              <p class="archive-date">${escapeHtml(formatDate(pick.date))}</p>
            </div>
            <div class="archive-content">
              <h3 class="archive-title">
                <a href="${escapeHtml(pick.href)}">${escapeHtml(pick.title)}</a>
              </h3>
              <p class="stocks-covered-line">
                <span class="stocks-covered-label">Stocks Covered</span>
                <span class="stocks-covered-value">${escapeHtml(
                  formatStocksCovered(pick.stocksCovered)
                )}</span>
              </p>
              <p class="pick-meta">
                <span class="tag">${escapeHtml(pick.classification)}</span>
                <span>${escapeHtml(pick.horizon)}</span>
              </p>
              <p>${escapeHtml(pick.thesis)}</p>
            </div>
          </article>
        </li>
      `
    )
    .join("");
}

function setActiveNav() {
  const currentPage = document.body.dataset.page;

  if (!currentPage) {
    return;
  }

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function createPostLink(label, pick, alignRight) {
  if (!pick) {
    return `<span class="post-pagination-card post-pagination-card--empty" aria-hidden="true"></span>`;
  }

  return `
    <a class="post-pagination-card ${
      alignRight ? "post-pagination-card--align-right" : ""
    }" href="${escapeHtml(pick.href)}">
      <span class="post-pagination-label">${escapeHtml(label)}</span>
      <span class="post-pagination-title">
        ${escapeHtml(pick.ticker)} — ${escapeHtml(pick.title)}
      </span>
    </a>
  `;
}

function renderPostPagination() {
  const container = document.querySelector("[data-post-pagination]");
  const currentSlug = document.body.dataset.pick;

  if (!container || !currentSlug || picks.length === 0) {
    return;
  }

  const ordered = sortPicksDescending([...picks]);
  const index = ordered.findIndex((pick) => pick.slug === currentSlug);

  if (index === -1) {
    return;
  }

  const newer = ordered[index - 1];
  const older = ordered[index + 1];

  container.innerHTML = `
    ${createPostLink("Newer note", newer, false)}
    ${
      older
        ? createPostLink("Older note", older, true)
        : `
          <a class="post-pagination-card post-pagination-card--align-right" href="/archive">
            <span class="post-pagination-label">Browse more</span>
            <span class="post-pagination-title">Back to archive</span>
          </a>
        `
    }
  `;
}

function applyPrettyUrl() {
  const prettyUrl = document.body.dataset.prettyUrl;

  if (!prettyUrl || window.location.pathname === prettyUrl) {
    return;
  }

  history.replaceState(null, "", `${prettyUrl}${window.location.search}${window.location.hash}`);
}

setActiveNav();
renderLatestPicks();
renderArchive();
renderPostPagination();
applyPrettyUrl();
