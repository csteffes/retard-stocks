// Add new picks to the top or bottom of this array.
// The homepage automatically shows the three most recent entries by date.
// Every pick here should link to a hand-authored detail page in /picks.
// Use the `stocksCovered` array for one or more tickers in the preview format.
// Each entry can be a simple ticker string like "META" or an object:
// { ticker: "XYZ", quoteSource: "yahoo", quoteTicker: "XYZ" }
// Standard tickers default to Robinhood links. Use `quoteSource: "yahoo"`
// for names that are not available on Robinhood.
window.PICKS = [
  {
    slug: "cuba-trade",
    ticker: "CCL / SHERF / SMIZF",
    company: "Carnival, Sherritt International, and Meliá Hotels",
    stocksCovered: [
      "CCL",
      { ticker: "SHERF", quoteSource: "yahoo" },
      { ticker: "SMIZF", quoteSource: "yahoo" },
    ],
    date: "2026-03-28",
    classification: "Special Situation",
    horizon: "3-12 months",
    title: "Three Stocks to Trade American Intervention in Cuba",
    thesis:
      "A regime-change or intervention scenario in Cuba would likely reprice the trade first through a cruise line, a Cuba-exposed hotel operator, and a distressed miner-power name tied directly to the island.",
    href: "/picks/cuba-trade.html",
  },
  {
    slug: "nvda",
    ticker: "NVDA",
    company: "NVIDIA",
    stocksCovered: ["NVDA"],
    date: "2026-03-21",
    classification: "Long",
    horizon: "12-24 months",
    title: "The market is still underestimating operating leverage",
    thesis:
      "Even if revenue growth decelerates from extraordinary levels, mix, software attach, and full-stack deployment can keep earnings power higher than the market expects.",
    href: "/picks/nvda.html",
  },
  {
    slug: "meta",
    ticker: "META",
    company: "Meta Platforms",
    stocksCovered: ["META"],
    date: "2026-03-12",
    classification: "Long",
    horizon: "12-24 months",
    title: "The earnings engine is broader than the story suggests",
    thesis:
      "Meta is still framed as an ad-cycle company, but messaging monetization, AI-driven ad tools, and better Reels economics are widening the earnings base.",
    href: "/picks/meta.html",
  },
  {
    slug: "tsla",
    ticker: "TSLA",
    company: "Tesla",
    stocksCovered: ["TSLA"],
    date: "2026-02-18",
    classification: "Watchlist",
    horizon: "6-18 months",
    title: "Great narrative, tougher underwriting",
    thesis:
      "The operating business is real, but the stock often prices in autonomy and platform optionality before those economics are visible enough to underwrite cleanly.",
    href: "/picks/tsla.html",
  },
];
