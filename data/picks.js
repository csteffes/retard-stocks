// Add new picks to the top or bottom of this array.
// The homepage automatically shows the three most recent entries by date.
// Every pick here should link to a hand-authored detail page in /picks.
// Use the `stocksCovered` array for one or more tickers in the preview format.
// Each entry can be a simple ticker string like "CCL" or an object:
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
    horizon: "3-12 months",
    title: "Three Stocks to Trade American Intervention in Cuba",
    thesis:
      "A regime-change or intervention scenario in Cuba would likely reprice the trade first through a cruise line, a Cuba-exposed hotel operator, and a distressed miner-power name tied directly to the island.",
    href: "/picks/cuba-trade.html",
  },
];
