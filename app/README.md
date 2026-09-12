# fpjargon

Interactive knowledge graph exploring 69 functional programming jargons with JavaScript ES2015 examples.

```bash
npm install
```

## Quick start

```bash
npm run dev
```

Runs the development server at `http://localhost:3000`.

## Build

```bash
npm run build
```

Parses the upstream functional programming catalog from `readme.md` into structured graph topology and builds the static assets to `dist/`.

## Agent & LLM discovery

Every concept, type signature, and code example is exposed in standardized format for AI agents and LLMs.

```bash
# Agent overview & concept links
curl -s https://hemanth.github.io/functional-programming-jargon/llms.txt

# Complete full-text documentation with all code blocks
curl -s https://hemanth.github.io/functional-programming-jargon/llms-full.txt

# Structured JSON dataset (terms, categories, semantic links)
curl -s https://hemanth.github.io/functional-programming-jargon/data/jargons.json
```

`llms.txt` follows the [llmstxt.org](https://llmstxt.org/) specification. Structured data is embedded on the page as JSON-LD (`WebApplication`).

## Deploy

```bash
npm run build
```

Configured for GitHub Pages at `https://hemanth.github.io/functional-programming-jargon/`. Deployed automatically via `.github/workflows/deploy.yml`.

## Related

- [functional-programming-jargon](https://github.com/hemanth/functional-programming-jargon) — upstream markdown catalog

## License

MIT © [Hemanth.HM](https://h3manth.com)
