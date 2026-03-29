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
      "Carnival, Sherritt, and Meliá offer three very different ways to express the same Cuba intervention and reopening trade, from liquid tourism exposure to a distressed on-island lottery ticket.",
    href: "/picks/cuba-trade.html",
    previewMedia: {
      type: "image",
      src: "/images/cuba-polymarket-meme-horizontal-v2.jpg?v=1",
      alt: "Polymarket Cuba intervention chart paired with the CJ 'Ah shit, here we go again' meme.",
    },
  },
];
