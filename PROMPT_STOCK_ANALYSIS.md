# PROMPT_STOCK_ANALYSIS

Use the prompt below when you want an LLM to generate a new stock memo in the house style of this site.

## Recommended workflow

1. Fill in the input block.
2. Paste the entire prompt into your LLM.
3. Review the output against `STOCK_ANALYSIS_TEMPLATE.md`.
4. Copy the polished draft into a new HTML page in `/picks`.

## One-shot prompt

```md
You are writing for a minimal public stock research site called "Retard Stocks."

The site's tone is:
- serious
- independent
- text-first
- analytical
- skeptical
- plainspoken
- concise but not thin
- personal without sounding diary-like

The writing should feel like a thoughtful independent investor memo, not a sell-side note, not a hedge fund marketing deck, and not a social-media thread.

Your job is to produce a clean, high-signal investment memo that is ready to paste into the site after light editing.

Important writing rules:
- Do not use hype.
- Do not use fake certainty.
- Do not write like a promoter.
- Do not use startup clichés, meme language, chest-beating, or generic finance fluff.
- Do not exaggerate TAM, moats, or upside.
- Distinguish clearly between facts, assumptions, and interpretation.
- If something is uncertain, say so plainly.
- If the input is incomplete, make reasonable assumptions but label them as assumptions.
- Prefer crisp paragraphs and useful bullets over bloated explanation.
- Use numbers only when they sharpen the point. Do not spray statistics for effect.
- Avoid overlong introductions.
- Avoid compliance-heavy language except in the final disclaimer.
- Keep the prose readable for a smart generalist investor.

Analytical rules:
- Identify the core thesis quickly.
- Explain why the opportunity exists.
- State the variant perception clearly.
- Include bull, base, and bear framing.
- Include what would falsify the thesis.
- Include key risks and likely catalysts.
- Separate what the market likely believes from what the writer believes.
- Treat valuation as practical framing, not false precision.
- Do not invent management quotes, exact market-share claims, or hard numbers you do not actually know.

Output requirements:
- Return Markdown only.
- Match the exact structure below.
- Use complete sentences.
- Keep section headings exactly as written.
- Make the memo polished enough to publish after minor edits.

Input block:
- Company: [COMPANY]
- Ticker: [TICKER]
- Official company website: [COMPANY_WEBSITE]
- Current price: [CURRENT_PRICE or "unknown"]
- Market cap: [MARKET_CAP or "unknown"]
- Hold Period: [TIME_HORIZON]
- Thesis angle: [THESIS_ANGLE]
- Why now: [WHY_NOW]
- Special facts or notes from me: [NOTES]
- Known constraints or non-negotiable views: [CONSTRAINTS]
- Tone constraints: [TONE_CONSTRAINTS]

Now write the memo in this exact format:

# [TICKER] — [Clear, non-hyped title]

**Ticker:** [$TICKER](Use Robinhood quote URL for standard tickers; use Yahoo Finance quote URL when Robinhood is unavailable)  
**Company:** [COMPANY]([COMPANY_WEBSITE])  
**Publish Date:** [Month Day, Year]  
**Hold Period:** [TIME_HORIZON]

## Quick take

[One concise paragraph with the core thesis.]

## Thesis

- [Bullet 1]
- [Bullet 2]
- [Bullet 3]

## Why this opportunity exists

[Explain the market misunderstanding, timing issue, neglected angle, or sentiment mismatch.]

## Key drivers

- [Driver 1]
- [Driver 2]
- [Driver 3]

## Variant perception

[State clearly what differs from consensus.]

## Bull case

[What has to go right.]

## Base case

[What most likely happens.]

## Bear case

[What can go wrong and what the market may be underestimating on the downside.]

## What would change my mind

- [Falsifier 1]
- [Falsifier 2]
- [Falsifier 3]

## Key risks

- [Risk 1]
- [Risk 2]
- [Risk 3]

## Catalysts & Timeline

- [Catalyst 1]
- [Catalyst 2]
- [Catalyst 3]

## Valuation framing

[Use investor-style valuation discussion. No fake-precision DCF unless the user explicitly asked for it.]

## Monitoring checklist

- [Thing to track next quarter or next update]
- [Thing to track next quarter or next update]
- [Thing to track next quarter or next update]

## Conclusion

[Short closing paragraph.]

## Disclosure / disclaimer

This memo reflects personal opinion only and is published for educational purposes. It is not investment advice or a recommendation to buy, sell, or hold any security. Views may change without notice.
```

## Notes

- If you want a tighter or harsher tone, put that in `Tone constraints`.
- If you want the model to stay conservative with unknown facts, say so explicitly in `Known constraints or non-negotiable views`.
- If you already have channel checks or industry notes, paste them into `Special facts or notes from me`.
