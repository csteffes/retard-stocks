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

function normalizeStock(stock) {
  if (typeof stock === "string") {
    return {
      ticker: stock.trim().toUpperCase(),
    };
  }

  if (stock && typeof stock === "object" && typeof stock.ticker === "string") {
    return {
      ticker: stock.ticker.trim().toUpperCase(),
      quoteSource: stock.quoteSource,
      quoteTicker: typeof stock.quoteTicker === "string" ? stock.quoteTicker.trim() : "",
      quoteUrl: typeof stock.quoteUrl === "string" ? stock.quoteUrl.trim() : "",
    };
  }

  return null;
}

function buildRobinhoodQuoteUrl(ticker) {
  return `https://robinhood.com/us/en/stocks/${encodeURIComponent(ticker)}/`;
}

function buildYahooQuoteUrl(ticker) {
  return `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/`;
}

function shouldDefaultToYahoo(ticker) {
  return !/^[A-Z]{1,5}$/.test(ticker);
}

function getQuoteUrl(stock) {
  if (stock.quoteUrl) {
    return stock.quoteUrl;
  }

  const quoteTicker = stock.quoteTicker || stock.ticker;

  if (stock.quoteSource === "yahoo") {
    return buildYahooQuoteUrl(quoteTicker);
  }

  if (stock.quoteSource === "robinhood") {
    return buildRobinhoodQuoteUrl(quoteTicker);
  }

  return shouldDefaultToYahoo(stock.ticker)
    ? buildYahooQuoteUrl(quoteTicker)
    : buildRobinhoodQuoteUrl(quoteTicker);
}

function renderStocksCovered(stocksCovered) {
  if (!Array.isArray(stocksCovered) || stocksCovered.length === 0) {
    return "";
  }

  return stocksCovered
    .map(normalizeStock)
    .filter(Boolean)
    .map(
      (stock) => `
        <a
          class="stock-quote-link"
          href="${escapeHtml(getQuoteUrl(stock))}"
          target="_blank"
          rel="noopener noreferrer"
        >
          $${escapeHtml(stock.ticker)}
        </a>
      `
    )
    .join(", ");
}

function renderPreviewMedia(pick, extraClass = "") {
  const media = pick.previewMedia;
  const mediaClassName = ["pick-card-media", extraClass].filter(Boolean).join(" ");

  if (!media || typeof media !== "object" || !media.src) {
    return "";
  }

  return `
    <a
      class="${escapeHtml(mediaClassName)}"
      href="${escapeHtml(pick.href)}"
      aria-label="Open ${escapeHtml(pick.title)}"
    >
      <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt || pick.title)}" />
    </a>
  `;
}

function renderEntryCta(pick) {
  return `
    <p class="entry-cta">
      <a class="entry-cta-link" href="${escapeHtml(pick.href)}">
        Read Full Memo
      </a>
    </p>
  `;
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
          <div class="pick-card-layout${pick.previewMedia ? " pick-card-layout--with-media" : ""}">
            <div class="pick-card-copy">
              <p class="pick-card-kicker">${escapeHtml(formatDate(pick.date))}</p>
              <h3>
                <a href="${escapeHtml(pick.href)}">${escapeHtml(pick.title)}</a>
              </h3>
              <p class="stocks-covered-line">
                <span class="stocks-covered-label">Stocks Covered:</span>
                <span class="stocks-covered-value">${renderStocksCovered(
                  pick.stocksCovered
                )}</span>
              </p>
              <p class="pick-meta">
                <span class="stocks-covered-label">Hold Period:</span>
                <span>${escapeHtml(pick.horizon)}</span>
              </p>
              <p>${escapeHtml(pick.thesis)}</p>
              ${renderEntryCta(pick)}
            </div>
            ${renderPreviewMedia(pick, "pick-card-media--feature")}
          </div>
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
          <article class="archive-item-row${pick.previewMedia ? " archive-item-row--with-media" : ""}">
            <div class="archive-date-column">
              <p class="archive-date">${escapeHtml(formatDate(pick.date))}</p>
            </div>
            <div class="archive-content">
              <h3 class="archive-title">
                <a href="${escapeHtml(pick.href)}">${escapeHtml(pick.title)}</a>
              </h3>
              <p class="stocks-covered-line">
                <span class="stocks-covered-label">Stocks Covered:</span>
                <span class="stocks-covered-value">${renderStocksCovered(
                  pick.stocksCovered
                )}</span>
              </p>
              <p class="pick-meta">
                <span class="stocks-covered-label">Hold Period:</span>
                <span>${escapeHtml(pick.horizon)}</span>
              </p>
              <p>${escapeHtml(pick.thesis)}</p>
              ${renderEntryCta(pick)}
            </div>
            ${renderPreviewMedia(pick, "archive-item-media")}
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseJsonScript(id) {
  const element = document.getElementById(id);

  if (!element) {
    return null;
  }

  try {
    return JSON.parse(element.textContent);
  } catch (error) {
    console.error(`Unable to parse JSON from #${id}.`, error);
    return null;
  }
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const chunk =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized;

  const red = Number.parseInt(chunk.slice(0, 2), 16);
  const green = Number.parseInt(chunk.slice(2, 4), 16);
  const blue = Number.parseInt(chunk.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getCurrencyAffixes(displayValue) {
  const prefixMatch = String(displayValue).match(/^[^\d-]+/);
  const suffixMatch = String(displayValue).match(/[^\d.]+$/);

  return {
    prefix: prefixMatch ? prefixMatch[0] : "",
    suffix: suffixMatch ? suffixMatch[0] : "",
  };
}

function formatChartNumber(value, decimals) {
  const fixed = Number(value).toFixed(decimals);

  return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function formatChartValue(value, chart) {
  const affixes = getCurrencyAffixes(chart.currentPrice);
  const formatted = formatChartNumber(value, chart.tooltipDecimals ?? chart.axisDecimals ?? 2);

  return `${affixes.prefix}${formatted}${affixes.suffix}`;
}

function formatValueWithAffixes(value, options = {}) {
  const {
    decimals = 0,
    prefix = "",
    suffix = "",
  } = options;

  return `${prefix}${formatChartNumber(value, decimals)}${suffix}`;
}

function createNiceNumber(range, shouldRound) {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / 10 ** exponent;
  let niceFraction = 1;

  if (shouldRound) {
    if (fraction < 1.5) {
      niceFraction = 1;
    } else if (fraction < 3) {
      niceFraction = 2;
    } else if (fraction < 7) {
      niceFraction = 5;
    } else {
      niceFraction = 10;
    }
  } else if (fraction <= 1) {
    niceFraction = 1;
  } else if (fraction <= 2) {
    niceFraction = 2;
  } else if (fraction <= 5) {
    niceFraction = 5;
  } else {
    niceFraction = 10;
  }

  return niceFraction * 10 ** exponent;
}

function createNiceScale(minimum, maximum, ticks = 5) {
  if (minimum === maximum) {
    const padding = minimum === 0 ? 1 : Math.abs(minimum) * 0.1;

    return {
      min: minimum - padding,
      max: maximum + padding,
      step: padding / 2,
      count: ticks,
    };
  }

  const niceRange = createNiceNumber(maximum - minimum, false);
  const step = createNiceNumber(niceRange / (ticks - 1), true);
  const min = Math.floor(minimum / step) * step;
  const max = Math.ceil(maximum / step) * step;
  const count = Math.round((max - min) / step) + 1;

  return { min, max, step, count };
}

function buildSmoothPath(points) {
  if (!points.length) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const smoothing = 0.16;
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] || points[index];
    const current = points[index];
    const next = points[index + 1];
    const following = points[index + 2] || next;

    const controlPointOneX = current.x + (next.x - previous.x) * smoothing;
    const controlPointOneY = current.y + (next.y - previous.y) * smoothing;
    const controlPointTwoX = next.x - (following.x - current.x) * smoothing;
    const controlPointTwoY = next.y - (following.y - current.y) * smoothing;

    path += ` C ${controlPointOneX.toFixed(1)} ${controlPointOneY.toFixed(
      1
    )}, ${controlPointTwoX.toFixed(1)} ${controlPointTwoY.toFixed(1)}, ${next.x.toFixed(
      1
    )} ${next.y.toFixed(1)}`;
  }

  return path;
}

function positionFloatingTooltip(tooltip, stage, point, dimensions) {
  const { svgWidth, svgHeight } = dimensions;
  const stageWidth = stage.clientWidth;
  const stageHeight = stage.clientHeight;
  const tooltipWidth = tooltip.offsetWidth || 120;
  const tooltipHeight = tooltip.offsetHeight || 70;
  const left = clamp(
    (point.x / svgWidth) * stageWidth,
    tooltipWidth / 2 + 8,
    stageWidth - tooltipWidth / 2 - 8
  );
  const top = clamp(
    (point.y / svgHeight) * stageHeight,
    tooltipHeight + 12,
    stageHeight - 18
  );

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function renderMetricList(metrics, valueClassName = "") {
  return (Array.isArray(metrics) ? metrics : [])
    .map(
      (metric) => `
        <div class="macro-chart-stat">
          <span class="macro-chart-stat-label">${escapeHtml(metric.label)}</span>
          <span class="macro-chart-stat-value ${valueClassName}">
            ${escapeHtml(metric.value)}
          </span>
        </div>
      `
    )
    .join("");
}

function renderMacroNotes(notes) {
  return `
    <div class="macro-chart-notes">
      ${(Array.isArray(notes) ? notes : [])
        .map(
          (note) => `
            <span><strong>${escapeHtml(note.label)}</strong> ${escapeHtml(note.text)}</span>
          `
        )
        .join("")}
    </div>
  `;
}

function getMacroLabelIndexes(chart, points) {
  if (Array.isArray(chart.xLabelIndexes) && chart.xLabelIndexes.length > 0) {
    return new Set(chart.xLabelIndexes);
  }

  return new Set(points.map((_, index) => index));
}

function formatMacroAxisValue(value, chart) {
  return formatValueWithAffixes(value, {
    decimals: chart.axisDecimals ?? 0,
    prefix: chart.axisPrefix || "",
    suffix: chart.axisSuffix || "",
  });
}

function formatMacroTooltipValue(value, chart) {
  return formatValueWithAffixes(value, {
    decimals: chart.tooltipDecimals ?? chart.axisDecimals ?? 0,
    prefix: chart.tooltipPrefix ?? chart.axisPrefix ?? "",
    suffix: chart.tooltipSuffix ?? chart.axisSuffix ?? "",
  });
}

function renderMacroLineChart(container, chart) {
  const svgWidth = chart.compact ? 820 : 840;
  const svgHeight = chart.compact ? 312 : 336;
  const chartLeft = 60;
  const chartTop = 24;
  const chartWidth = svgWidth - chartLeft - 30;
  const chartHeight = chart.compact ? 176 : 206;
  const chartBottom = chartTop + chartHeight;
  const chartRight = chartLeft + chartWidth;
  const rawPoints = Array.isArray(chart.points) ? chart.points : [];
  const series = Array.isArray(chart.series) ? chart.series : [];

  if (rawPoints.length === 0 || series.length === 0) {
    return;
  }

  const values = rawPoints.flatMap((point) =>
    series
      .map((entry) => Number(point[entry.key]))
      .filter((value) => Number.isFinite(value))
  );

  if (values.length === 0) {
    return;
  }

  const scale = createNiceScale(Math.min(...values), Math.max(...values), 5);
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = scale.max - (scale.max - scale.min) * ratio;
    const y = chartTop + chartHeight * ratio;

    return { value, y };
  });

  const plottedSeries = series.map((seriesEntry) => ({
    ...seriesEntry,
    points: rawPoints.map((point, index) => {
      const ratioX = index / (rawPoints.length - 1 || 1);
      const value = Number(point[seriesEntry.key]);
      const ratioY = (value - scale.min) / (scale.max - scale.min || 1);

      return {
        label: point.label,
        event: point.event,
        value,
        x: chartLeft + chartWidth * ratioX,
        y: chartBottom - chartHeight * ratioY,
      };
    }),
  }));

  const primarySeries = plottedSeries[0];
  const primaryLinePath = buildSmoothPath(primarySeries.points);
  const primaryAreaPath = `${primaryLinePath} L ${chartRight} ${chartBottom} L ${chartLeft} ${chartBottom} Z`;
  const visibleLabelIndexes = getMacroLabelIndexes(chart, primarySeries.points);

  container.style.setProperty("--macro-chart-line", chart.accent || "#274762");
  container.style.setProperty(
    "--macro-chart-fill",
    hexToRgba(chart.accent || "#274762", 0.11)
  );
  container.style.setProperty(
    "--macro-chart-secondary-line",
    chart.secondaryAccent || "#a0665d"
  );

  container.innerHTML = `
    <div class="macro-chart-meta">
      <div class="macro-chart-heading">
        <h3>${escapeHtml(chart.title)}</h3>
        <p class="macro-chart-summary">${escapeHtml(chart.summary)}</p>
      </div>
      <div class="macro-chart-stats">
        ${renderMetricList(chart.metrics)}
      </div>
    </div>
    <div class="macro-chart-stage">
      <div class="macro-chart-tooltip" aria-hidden="true"></div>
      <svg
        class="macro-chart-svg"
        viewBox="0 0 ${svgWidth} ${svgHeight}"
        role="img"
        aria-label="${escapeHtml(chart.title)} interactive chart"
      >
        ${yTicks
          .map(
            (tick) => `
              <line
                class="macro-chart-gridline"
                x1="${chartLeft}"
                y1="${tick.y.toFixed(1)}"
                x2="${chartRight}"
                y2="${tick.y.toFixed(1)}"
              />
              <text
                class="macro-chart-y-label"
                x="${chartLeft - 12}"
                y="${(tick.y + 5.5).toFixed(1)}"
                text-anchor="end"
              >
                ${escapeHtml(formatMacroAxisValue(tick.value, chart))}
              </text>
            `
          )
          .join("")}
        ${primarySeries.points
          .map(
            (point) => `
              <line
                class="macro-chart-gridline macro-chart-gridline--vertical"
                x1="${point.x.toFixed(1)}"
                y1="${chartTop}"
                x2="${point.x.toFixed(1)}"
                y2="${chartBottom}"
              />
            `
          )
          .join("")}
        <line
          class="macro-chart-axis-line"
          x1="${chartLeft}"
          y1="${chartBottom}"
          x2="${chartRight}"
          y2="${chartBottom}"
        />
        <path class="macro-chart-area" d="${primaryAreaPath}" />
        ${plottedSeries
          .map(
            (seriesEntry, index) => `
              <path
                class="macro-chart-line ${index > 0 ? "macro-chart-line--secondary" : ""} ${
                  seriesEntry.dashed ? "macro-chart-line--dashed" : ""
                }"
                d="${buildSmoothPath(seriesEntry.points)}"
                ${seriesEntry.color ? `style="--series-color: ${seriesEntry.color};"` : ""}
              />
            `
          )
          .join("")}
        ${primarySeries.points
          .filter((point) => point.event)
          .map(
            (point) => `
              <circle
                class="macro-chart-event-dot"
                cx="${point.x.toFixed(1)}"
                cy="${point.y.toFixed(1)}"
                r="6"
              />
            `
          )
          .join("")}
        ${primarySeries.points
          .map((point, index) =>
            visibleLabelIndexes.has(index)
              ? `
                <text
                  class="macro-chart-x-label"
                  x="${point.x.toFixed(1)}"
                  y="${chartBottom + 28}"
                  text-anchor="middle"
                >
                  ${escapeHtml(point.label)}
                </text>
              `
              : ""
          )
          .join("")}
        <line
          class="macro-chart-hover-line"
          x1="0"
          y1="${chartTop}"
          x2="0"
          y2="${chartBottom}"
        />
        <circle class="macro-chart-hover-dot macro-chart-hover-dot--primary" cx="0" cy="0" r="6.8" />
        ${
          plottedSeries[1]
            ? '<circle class="macro-chart-hover-dot macro-chart-hover-dot--secondary" cx="0" cy="0" r="6.1" />'
            : ""
        }
        <rect
          class="macro-chart-hitbox"
          x="${chartLeft}"
          y="${chartTop}"
          width="${chartWidth}"
          height="${chartHeight}"
        />
      </svg>
    </div>
    ${renderMacroNotes(chart.notes)}
  `;

  const stage = container.querySelector(".macro-chart-stage");
  const tooltip = container.querySelector(".macro-chart-tooltip");
  const hoverLine = container.querySelector(".macro-chart-hover-line");
  const hoverDots = Array.from(container.querySelectorAll(".macro-chart-hover-dot"));
  const hitbox = container.querySelector(".macro-chart-hitbox");
  let activeIndex = -1;

  function setActivePoint(index) {
    const currentPrimaryPoint = primarySeries.points[index];

    if (!currentPrimaryPoint) {
      hoverLine.style.opacity = "0";
      hoverDots.forEach((dot) => {
        dot.style.opacity = "0";
      });
      tooltip.classList.remove("is-visible");
      activeIndex = -1;
      return;
    }

    activeIndex = index;
    const tooltipRows = plottedSeries
      .map((seriesEntry) => {
        const point = seriesEntry.points[index];

        if (!point) {
          return "";
        }

        return `
          <div class="macro-chart-tooltip-row">
            <span
              class="macro-chart-tooltip-swatch"
              style="background:${escapeHtml(seriesEntry.color || chart.accent || "#274762")}"
            ></span>
            <span class="macro-chart-tooltip-series">${escapeHtml(seriesEntry.label)}</span>
            <span class="macro-chart-tooltip-value">${escapeHtml(
              formatMacroTooltipValue(point.value, chart)
            )}</span>
          </div>
        `;
      })
      .join("");

    hoverLine.setAttribute("x1", currentPrimaryPoint.x.toFixed(1));
    hoverLine.setAttribute("x2", currentPrimaryPoint.x.toFixed(1));
    hoverLine.style.opacity = "1";

    hoverDots.forEach((dot, seriesIndex) => {
      const point = plottedSeries[seriesIndex]?.points[index];

      if (!point) {
        dot.style.opacity = "0";
        return;
      }

      dot.setAttribute("cx", point.x.toFixed(1));
      dot.setAttribute("cy", point.y.toFixed(1));
      dot.style.opacity = "1";
    });

    tooltip.innerHTML = `
      <div class="macro-chart-tooltip-label">${escapeHtml(currentPrimaryPoint.label)}</div>
      <div class="macro-chart-tooltip-list">${tooltipRows}</div>
      ${
        currentPrimaryPoint.event
          ? `<div class="macro-chart-tooltip-event">${escapeHtml(currentPrimaryPoint.event)}</div>`
          : ""
      }
    `;
    tooltip.classList.add("is-visible");

    const anchorY = Math.min(...plottedSeries.map((seriesEntry) => seriesEntry.points[index].y));
    positionFloatingTooltip(
      tooltip,
      stage,
      { x: currentPrimaryPoint.x, y: anchorY },
      { svgWidth, svgHeight }
    );
  }

  function handlePointerMove(event) {
    const bounds = hitbox.getBoundingClientRect();
    const ratio = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const targetX = chartLeft + chartWidth * ratio;
    let nearestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    primarySeries.points.forEach((point, index) => {
      const distance = Math.abs(point.x - targetX);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    });

    if (nearestIndex !== activeIndex) {
      setActivePoint(nearestIndex);
    }
  }

  hitbox.addEventListener("pointermove", handlePointerMove);
  hitbox.addEventListener("pointerdown", handlePointerMove);
  hitbox.addEventListener("pointerleave", () => setActivePoint(-1));
}

function renderMacroBarChart(container, chart) {
  const svgWidth = 820;
  const svgHeight = 312;
  const chartLeft = 60;
  const chartTop = 24;
  const chartWidth = svgWidth - chartLeft - 30;
  const chartHeight = 176;
  const chartBottom = chartTop + chartHeight;
  const chartRight = chartLeft + chartWidth;
  const rawPoints = Array.isArray(chart.points) ? chart.points : [];

  if (rawPoints.length === 0) {
    return;
  }

  const values = rawPoints.map((point) => Number(point.value)).filter((value) => Number.isFinite(value));
  const scale = createNiceScale(0, Math.max(...values), 5);
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = scale.max - (scale.max - scale.min) * ratio;
    const y = chartTop + chartHeight * ratio;

    return { value, y };
  });

  const step = chartWidth / rawPoints.length;
  const barWidth = Math.min(56, step * 0.58);
  const bars = rawPoints.map((point, index) => {
    const value = Number(point.value);
    const ratioY = (value - scale.min) / (scale.max - scale.min || 1);
    const height = chartHeight * ratioY;
    const x = chartLeft + step * index + (step - barWidth) / 2;
    const y = chartBottom - height;

    return {
      ...point,
      value,
      width: barWidth,
      x,
      y,
      height,
    };
  });

  const visibleLabelIndexes = getMacroLabelIndexes(chart, bars);

  container.style.setProperty("--macro-chart-line", chart.accent || "#274762");

  container.innerHTML = `
    <div class="macro-chart-meta">
      <div class="macro-chart-heading">
        <h3>${escapeHtml(chart.title)}</h3>
        <p class="macro-chart-summary">${escapeHtml(chart.summary)}</p>
      </div>
      <div class="macro-chart-stats">
        ${renderMetricList(chart.metrics)}
      </div>
    </div>
    <div class="macro-chart-stage">
      <div class="macro-chart-tooltip" aria-hidden="true"></div>
      <svg
        class="macro-chart-svg"
        viewBox="0 0 ${svgWidth} ${svgHeight}"
        role="img"
        aria-label="${escapeHtml(chart.title)} interactive chart"
      >
        ${yTicks
          .map(
            (tick) => `
              <line
                class="macro-chart-gridline"
                x1="${chartLeft}"
                y1="${tick.y.toFixed(1)}"
                x2="${chartRight}"
                y2="${tick.y.toFixed(1)}"
              />
              <text
                class="macro-chart-y-label"
                x="${chartLeft - 12}"
                y="${(tick.y + 5.5).toFixed(1)}"
                text-anchor="end"
              >
                ${escapeHtml(formatMacroAxisValue(tick.value, chart))}
              </text>
            `
          )
          .join("")}
        <line
          class="macro-chart-axis-line"
          x1="${chartLeft}"
          y1="${chartBottom}"
          x2="${chartRight}"
          y2="${chartBottom}"
        />
        ${bars
          .map(
            (bar) => `
              <rect
                class="macro-chart-bar macro-chart-bar--${escapeHtml(bar.tone || "base")}"
                x="${bar.x.toFixed(1)}"
                y="${bar.y.toFixed(1)}"
                width="${bar.width.toFixed(1)}"
                height="${bar.height.toFixed(1)}"
                rx="6"
              />
            `
          )
          .join("")}
        <rect class="macro-chart-bar-hover" x="0" y="0" width="0" height="0" rx="6" />
        ${bars
          .map((bar, index) =>
            visibleLabelIndexes.has(index)
              ? `
                <text
                  class="macro-chart-x-label"
                  x="${(bar.x + bar.width / 2).toFixed(1)}"
                  y="${chartBottom + 28}"
                  text-anchor="middle"
                >
                  ${escapeHtml(bar.label)}
                </text>
              `
              : ""
          )
          .join("")}
        ${bars
          .map(
            (bar, index) => `
              <rect
                class="macro-chart-hitbox"
                data-bar-index="${index}"
                x="${(bar.x - (step - bar.width) / 2).toFixed(1)}"
                y="${chartTop}"
                width="${step.toFixed(1)}"
                height="${chartHeight}"
              />
            `
          )
          .join("")}
      </svg>
    </div>
    ${renderMacroNotes(chart.notes)}
  `;

  const stage = container.querySelector(".macro-chart-stage");
  const tooltip = container.querySelector(".macro-chart-tooltip");
  const hoverBar = container.querySelector(".macro-chart-bar-hover");
  const hitboxes = Array.from(container.querySelectorAll(".macro-chart-hitbox"));
  let activeIndex = -1;

  function setActiveBar(index) {
    const bar = bars[index];

    if (!bar) {
      hoverBar.style.opacity = "0";
      tooltip.classList.remove("is-visible");
      activeIndex = -1;
      return;
    }

    activeIndex = index;
    hoverBar.setAttribute("x", bar.x.toFixed(1));
    hoverBar.setAttribute("y", bar.y.toFixed(1));
    hoverBar.setAttribute("width", bar.width.toFixed(1));
    hoverBar.setAttribute("height", bar.height.toFixed(1));
    hoverBar.style.opacity = "1";

    tooltip.innerHTML = `
      <div class="macro-chart-tooltip-label">${escapeHtml(bar.label)}</div>
      <div class="macro-chart-tooltip-list">
        <div class="macro-chart-tooltip-row">
          <span class="macro-chart-tooltip-swatch macro-chart-tooltip-swatch--solid"></span>
          <span class="macro-chart-tooltip-series">Grid Failure</span>
          <span class="macro-chart-tooltip-value">${escapeHtml(
            formatMacroTooltipValue(bar.value, chart)
          )}</span>
        </div>
      </div>
      ${
        bar.event
          ? `<div class="macro-chart-tooltip-event">${escapeHtml(bar.event)}</div>`
          : ""
      }
    `;
    tooltip.classList.add("is-visible");

    positionFloatingTooltip(
      tooltip,
      stage,
      { x: bar.x + bar.width / 2, y: Math.max(chartTop + 18, bar.y) },
      { svgWidth, svgHeight }
    );
  }

  hitboxes.forEach((hitbox) => {
    const index = Number(hitbox.dataset.barIndex);

    hitbox.addEventListener("pointermove", () => {
      if (index !== activeIndex) {
        setActiveBar(index);
      }
    });
    hitbox.addEventListener("pointerdown", () => setActiveBar(index));
  });
  stage.addEventListener("pointerleave", () => setActiveBar(-1));
}

function renderMacroChartCard(container, chart) {
  if (!chart || typeof chart !== "object") {
    return;
  }

  if (chart.type === "bar") {
    renderMacroBarChart(container, chart);
    return;
  }

  renderMacroLineChart(container, chart);
}

function renderStockChartCard(container, chart) {
  const svgWidth = 840;
  const svgHeight = 360;
  const chartLeft = 64;
  const chartTop = 22;
  const chartWidth = 716;
  const chartHeight = 222;
  const chartBottom = chartTop + chartHeight;
  const chartRight = chartLeft + chartWidth;
  const points = Array.isArray(chart.points) ? chart.points : [];

  if (points.length === 0) {
    return;
  }

  const values = points.map((point) => Number(point.value));
  const scale = createNiceScale(Math.min(...values), Math.max(...values), 5);
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = scale.max - (scale.max - scale.min) * ratio;
    const y = chartTop + chartHeight * ratio;

    return {
      value,
      y,
    };
  });

  const plottedPoints = points.map((point, index) => {
    const ratioX = index / (points.length - 1 || 1);
    const ratioY = (Number(point.value) - scale.min) / (scale.max - scale.min || 1);

    return {
      ...point,
      x: chartLeft + chartWidth * ratioX,
      y: chartBottom - chartHeight * ratioY,
    };
  });

  const linePath = buildSmoothPath(plottedPoints);
  const areaPath = `${linePath} L ${chartRight} ${chartBottom} L ${chartLeft} ${chartBottom} Z`;
  const ytdClass =
    chart.ytd > 0
      ? "stock-chart-stat-value--positive"
      : chart.ytd < 0
        ? "stock-chart-stat-value--negative"
        : "";

  container.style.setProperty("--stock-chart-line", chart.accent || "#274762");
  container.style.setProperty(
    "--stock-chart-fill",
    hexToRgba(chart.accent || "#274762", 0.12)
  );

  container.innerHTML = `
    <div class="stock-chart-meta">
      <div>
        <div class="stock-chart-title-row">
          <a
            class="stock-chart-badge"
            href="${escapeHtml(chart.quoteUrl)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${escapeHtml(chart.displayTicker)}
          </a>
          <span class="stock-chart-company">${escapeHtml(chart.company)}</span>
        </div>
        <p class="stock-chart-current">${escapeHtml(chart.currentPrice)}</p>
      </div>
      <div class="stock-chart-stats">
        <div class="stock-chart-stat">
          <span class="stock-chart-stat-label">YTD</span>
          <span class="stock-chart-stat-value ${ytdClass}">
            ${chart.ytd > 0 ? "+" : ""}${escapeHtml(chart.ytd)}%
          </span>
        </div>
        <div class="stock-chart-stat">
          <span class="stock-chart-stat-label">Target</span>
          <span class="stock-chart-stat-value stock-chart-stat-value--accent">
            ${escapeHtml(chart.target)}
          </span>
        </div>
      </div>
    </div>
    <p class="stock-chart-summary">${escapeHtml(chart.summary)}</p>
    <div class="stock-chart-stage">
      <div class="stock-chart-tooltip" aria-hidden="true"></div>
      <svg
        class="stock-chart-svg"
        viewBox="0 0 ${svgWidth} ${svgHeight}"
        role="img"
        aria-label="${escapeHtml(chart.displayTicker)} twelve-month price chart"
      >
        ${yTicks
          .map(
            (tick) => `
              <line
                class="stock-chart-gridline"
                x1="${chartLeft}"
                y1="${tick.y.toFixed(1)}"
                x2="${chartRight}"
                y2="${tick.y.toFixed(1)}"
              />
              <text
                class="stock-chart-y-label"
                x="${chartLeft - 14}"
                y="${(tick.y + 6).toFixed(1)}"
                text-anchor="end"
              >
                ${escapeHtml(formatChartNumber(tick.value, chart.axisDecimals ?? 1))}
              </text>
            `
          )
          .join("")}
        ${plottedPoints
          .map(
            (point) => `
              <line
                class="stock-chart-gridline"
                x1="${point.x.toFixed(1)}"
                y1="${chartTop}"
                x2="${point.x.toFixed(1)}"
                y2="${chartBottom}"
              />
            `
          )
          .join("")}
        <line
          class="stock-chart-axis-line"
          x1="${chartLeft}"
          y1="${chartBottom}"
          x2="${chartRight}"
          y2="${chartBottom}"
        />
        <path class="stock-chart-area" d="${areaPath}" />
        <path class="stock-chart-line" d="${linePath}" />
        ${plottedPoints
          .filter((point) => point.event)
          .map(
            (point) => `
              <circle
                class="stock-chart-event-dot"
                cx="${point.x.toFixed(1)}"
                cy="${point.y.toFixed(1)}"
                r="6.5"
              />
            `
          )
          .join("")}
        ${plottedPoints
          .map(
            (point) => `
              <text
                class="stock-chart-x-label"
                x="${point.x.toFixed(1)}"
                y="${chartBottom + 30}"
                text-anchor="middle"
              >
                ${escapeHtml(point.label)}
              </text>
            `
          )
          .join("")}
        <line class="stock-chart-hover-line" x1="0" y1="${chartTop}" x2="0" y2="${chartBottom}" />
        <circle class="stock-chart-hover-dot" cx="0" cy="0" r="7.5" />
        <rect
          class="stock-chart-hitbox"
          x="${chartLeft}"
          y="${chartTop}"
          width="${chartWidth}"
          height="${chartHeight}"
        />
      </svg>
    </div>
    <div class="stock-chart-notes">
      ${(Array.isArray(chart.notes) ? chart.notes : [])
        .map(
          (note) => `
            <span><strong>${escapeHtml(note.label)}</strong> ${escapeHtml(note.text)}</span>
          `
        )
        .join("")}
    </div>
  `;

  const stage = container.querySelector(".stock-chart-stage");
  const tooltip = container.querySelector(".stock-chart-tooltip");
  const hoverLine = container.querySelector(".stock-chart-hover-line");
  const hoverDot = container.querySelector(".stock-chart-hover-dot");
  const hitbox = container.querySelector(".stock-chart-hitbox");
  let activeIndex = -1;

  function setActivePoint(index) {
    const point = plottedPoints[index];

    if (!point) {
      hoverLine.style.opacity = "0";
      hoverDot.style.opacity = "0";
      tooltip.classList.remove("is-visible");
      activeIndex = -1;
      return;
    }

    activeIndex = index;
    hoverLine.setAttribute("x1", point.x.toFixed(1));
    hoverLine.setAttribute("x2", point.x.toFixed(1));
    hoverDot.setAttribute("cx", point.x.toFixed(1));
    hoverDot.setAttribute("cy", point.y.toFixed(1));
    hoverLine.style.opacity = "1";
    hoverDot.style.opacity = "1";

    tooltip.innerHTML = `
      <div class="stock-chart-tooltip-label">${escapeHtml(point.label)}</div>
      <div class="stock-chart-tooltip-value">${escapeHtml(formatChartValue(point.value, chart))}</div>
      ${
        point.event
          ? `<div class="stock-chart-tooltip-event">${escapeHtml(point.event)}</div>`
          : ""
      }
    `;

    tooltip.classList.add("is-visible");

    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    const tooltipWidth = tooltip.offsetWidth || 112;
    const tooltipHeight = tooltip.offsetHeight || 64;
    const left = clamp((point.x / svgWidth) * stageWidth, tooltipWidth / 2 + 8, stageWidth - tooltipWidth / 2 - 8);
    const top = clamp((point.y / svgHeight) * stageHeight, tooltipHeight + 12, stageHeight - 18);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function handlePointerMove(event) {
    const bounds = hitbox.getBoundingClientRect();
    const ratio = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const targetX = chartLeft + chartWidth * ratio;
    let nearestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    plottedPoints.forEach((point, index) => {
      const distance = Math.abs(point.x - targetX);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    });

    if (nearestIndex !== activeIndex) {
      setActivePoint(nearestIndex);
    }
  }

  hitbox.addEventListener("pointermove", handlePointerMove);
  hitbox.addEventListener("pointerdown", handlePointerMove);
  hitbox.addEventListener("pointerleave", () => setActivePoint(-1));
}

function renderStockCharts() {
  const chartData = parseJsonScript("stock-chart-data");

  if (!chartData) {
    return;
  }

  document.querySelectorAll(".js-stock-chart[data-chart-id]").forEach((container) => {
    const chartId = container.dataset.chartId;
    const chart = chartData[chartId];

    if (chart) {
      renderStockChartCard(container, chart);
    }
  });
}

function renderMacroCharts() {
  const chartData = parseJsonScript("macro-chart-data");

  if (!chartData) {
    return;
  }

  document.querySelectorAll(".js-macro-chart[data-chart-id]").forEach((container) => {
    const chartId = container.dataset.chartId;
    const chart = chartData[chartId];

    if (chart) {
      renderMacroChartCard(container, chart);
    }
  });
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
renderMacroCharts();
renderStockCharts();
