# Retard Stocks

Minimal static website for publishing stock ideas, deeper writeups, and a clean archive of past analyses.

## Project overview

This project is intentionally simple:

- Plain HTML for the public pages
- One shared `styles.css` file for typography, spacing, layout, and article styling
- One lightweight `data/picks.js` file that powers the homepage latest-picks list and the archive index
- Hand-authored detail pages in `/picks` so each memo can be edited directly without a build step
- Prompt and template artifacts for generating future analysis drafts in a consistent house style

## File structure

```text
.
├── about.html
├── archive.html
├── data/
│   └── picks.js
├── index.html
├── picks/
│   ├── meta.html
│   ├── nvda.html
│   └── tsla.html
├── PROMPT_STOCK_ANALYSIS.md
├── README.md
├── SAMPLE_GENERATED_ANALYSIS.md
├── script.js
├── STOCK_ANALYSIS_TEMPLATE.md
└── styles.css
```

## How to add a new pick

1. Duplicate one of the existing files in `/picks`, rename it, and update the page title, `body` `data-pick` value, metadata row, and article content.
2. Add a new object to `data/picks.js` with:
   - `slug`
   - `ticker`
   - `company`
   - `date` in `YYYY-MM-DD`
   - `classification`
   - `horizon`
   - `title`
   - `thesis`
   - `href`
3. Save both files. The homepage will automatically show the three most recent picks by date, and the archive will update automatically.
4. If you want the previous/next article navigation to work on the new page, make sure the new page's `body` uses the same `data-pick` slug you added in `data/picks.js`.

## How to edit homepage copy

- Edit the intro and supporting copy in `index.html`
- Edit the About and legal text in `about.html`
- Edit visual styling in `styles.css`

## How to use the stock analysis prompt

1. Open `PROMPT_STOCK_ANALYSIS.md`
2. Fill in the input placeholders for company, ticker, market cap, thesis angle, hold period, and any notes you want the model to respect
3. Paste the full prompt into your LLM of choice
4. Use `STOCK_ANALYSIS_TEMPLATE.md` as the structure check
5. Copy the generated draft into a new file in `/picks`, then make any edits you want before publishing

`SAMPLE_GENERATED_ANALYSIS.md` shows what a finished output should look like.

## Deployment

This project is fully static and can be deployed directly to:

- GitHub Pages
- Netlify
- Vercel static hosting

### Quick deployment notes

- GitHub Pages: push the repo and publish from the root or `/docs` if you move files there
- Netlify: drag-and-drop the folder or connect the repo; no build command is required
- Vercel: import the repo and choose static deployment with no framework preset

## Local preview

Because everything is static, you can preview it with any basic file server. For example:

```bash
python3 -m http.server
```

Then open the local address in your browser.
