# CoDEasterEggs

CoDEasterEggs collects clear, beginner-friendly guides for Call of Duty Zombies Easter Eggs — written so you can follow along while you play.

**[Open the site →](https://joaquinurrisa.github.io/CoDEasterEggs/)** — pick a map from the landing page.

## Guides

| Game | Map | Easter Egg | Players | Format |
| --- | --- | --- | --- | --- |
| Black Ops II | Origins | [Little Lost Girl](guides/black-ops-2/origins/) | 4 (role split) | Interactive web companion |
| Black Ops II | TranZit | [Tower of Babble](guides/black-ops-2/tranzit/) | 1–4 | Interactive web companion |

### Origins — Little Lost Girl

Open [`guides/black-ops-2/origins/index.html`](guides/black-ops-2/origins/index.html) on a phone or tablet next to your game.

Includes:

- A four-player role split — pick your staff and the page tags your jobs everywhere
- Round-by-round plan, plus what can run in parallel and what has to queue
- All four staffs: parts, records, tunnels, and the four-part upgrade chain
- All eight Easter Egg steps in order, with checklists and saved progress
- The four puzzle keys in one place
- Hand-drawn diagrams for the map, tank route, soul chests, ring puzzle and G-Strike loop, with a **Diagram / Photo** switch on the figures that also have an in-game screenshot
- Printable per-player briefs in [`players/`](guides/black-ops-2/origins/players/)

### TranZit — Tower of Babble

Open [`guides/black-ops-2/tranzit/index.html`](guides/black-ops-2/tranzit/index.html) on a phone or tablet next to your game.

Includes:

- Maxis and Richtofen path walkthroughs with setup steps in order (no prior knowledge assumed)
- Location diagrams for landmarks, parts, and key steps
- Checklists with saved progress
- Map overview and glossary
- Searchable part / location reference
- Troubleshooting for common failed steps

## Project goals

- Detailed step-by-step walkthroughs
- Easy to use during an active game
- Clear organization so players find the next action quickly
- Thorough explanations without assuming map knowledge
- Notes for common mistakes, triggers, and key locations
- Images where they help explain locations, objectives, or key steps

## What guides should include

1. A short overview of the Easter Egg
2. Any required items, weapons, or setup steps (in the walkthrough order — not a separate “do this first” silo)
3. A clear sequence of actions in order
4. Important locations, objective triggers, and hints
5. Notes about common mistakes or confusing parts
6. A simple way to confirm when the Easter Egg is complete
7. Images where they help explain locations, objectives, or key steps
8. Links to related videos and guides, while still making sure the guide itself is fully self-contained

## Repository structure

```text
index.html            # Landing page — pick a map
styles.css            # Landing page styles
assets/               # Landing page cover art
guides/
  black-ops-2/
    origins/          # Little Lost Girl interactive guide
      images/         # Hand-drawn location / step diagrams
      players/        # Printable per-player briefs
    tranzit/          # Tower of Babble interactive guide
      images/         # Location / step diagrams
```

Each guide folder is self-contained: an `index.html`, its own stylesheet and script, and its diagrams.
Nothing is built or bundled — open the file in a browser, or serve the repo root with
`python3 -m http.server 8080` and visit `http://localhost:8080/`.

## Contributing

Prefer formats that help someone mid-match: short steps, checklists, location lookups, diagrams, and confirmation cues. Keep guides self-contained even when linking videos or external references.
