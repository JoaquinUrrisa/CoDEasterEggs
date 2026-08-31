# Origins — Little Lost Girl

Interactive companion guide for the Black Ops II Zombies Origins main Easter Egg (**Little Lost Girl**),
built for a **squad of four**.

## Open the guide

Open [`index.html`](./index.html) in a browser (a phone or tablet works best while playing).

There is also [`GUIDE.md`](./GUIDE.md), the same material as one long markdown document. The web page
is better while you are playing; the markdown is better for searching, skimming and copying from.

Or from the repo root with a simple static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080/guides/black-ops-2/origins/`.

## Why this format

Origins is the longest Easter Egg in Black Ops II and almost all of it can be done in parallel. The
guide is a **mobile-first web page** so that four players can:

- Pick their staff once and have the page tag their jobs everywhere
- Switch between the four staff walkthroughs without scrolling past the other three
- Check off steps and keep progress in the browser
- See labeled diagrams for the map, the tank route, the soul chests and the ring puzzle
- Jump straight to a puzzle key mid-game

## Contents

1. Overview and the two hard timing windows (snow, and the round-8 Panzersoldat)
2. Squad roles, round-by-round plan, and what can run in parallel
3. Map, the six generators, and the Crazy Place
4. All four staffs — parts, records, tunnels and the four-part upgrade chain
5. The eight Easter Egg steps in order, with checklists
6. The four puzzle keys
7. Gear — G-Strike, One Inch Punch, Maxis Drone, shovels, shield, Rituals
8. House rules and the BO2 / BO3 differences

## Per-player briefs

Pruned single-role versions live in [`players/`](./players/), one per staff, in three formats:

| Player | Read / print | Download | Source |
|---|---|---|---|
| Fire (P1) — church and Gen 6, the plane, the round-8 Panzer | [HTML](./players/FireStaff.html) | [PDF](./players/FireStaff.pdf) | [MD](./players/FireStaff.md) |
| Ice (P2) — shovel duty, snow windows, the Zombie Blood farm | [HTML](./players/IceStaff.html) | [PDF](./players/IceStaff.pdf) | [MD](./players/IceStaff.md) |
| Lightning (P3) — tank driver, the seven electrical panels | [HTML](./players/LightningStaff.html) | [PDF](./players/LightningStaff.pdf) | [MD](./players/LightningStaff.md) |
| Wind (P4) — robot entries, the gramophone circuit | [HTML](./players/WindStaff.html) | [PDF](./players/WindStaff.pdf) | [MD](./players/WindStaff.md) |

The HTML version is dark on screen and switches to black-on-white with A4 page breaks when printed,
so **Print → Save as PDF** in the browser gives the same result as the committed PDF. Each brief is
five or six pages.

### Regenerating them

The markdown is the source of truth. After editing a `.md`, rebuild:

```bash
python3 tools/build_briefs.py          # HTML + PDF
python3 tools/build_briefs.py --html   # HTML only, no browser needed
```

The script converts the markdown subset the briefs use, wraps it in a print stylesheet
([`players/print.css`](./players/print.css)), and renders the PDF with headless Chrome, then
downsamples images with ghostscript if it is installed — that step takes the set from about 42 MB
to about 1.3 MB. Generated files are committed, so the site itself still needs no build step.

## Images

Two kinds, and you can switch between them.

**Diagrams** in [`images/`](./images/) are hand-drawn SVG in the site palette: map overview, tank
route with the Lightning jump points, soul chest locations, the Crazy Place, the ring puzzle, the
G-Strike tablet loop, the surface-task locations and the staff upgrade flow. They label things a
screenshot cannot, and they show relationships rather than one camera angle.

**Screenshots** come from two places, and each figure says which:

- The [Call of Duty Wiki](https://callofduty.fandom.com/wiki/Origins) (CC BY-SA), for single subjects
  — a part on the ground, a robot, the red button.
- [Silentbrother's Steam guide](https://steamcommunity.com/sharedfiles/filedetails/?id=315184862)
  (*ORIGINS — BLACK OPS 2 ZOMBIES, Guía completa*), for ten multi-panel composites showing **where the
  records and parts spawn** — the thing a single screenshot cannot show — plus his annotated shot of
  the Crazy Place keyboard with the bottom row numbered 1–7, which is the clearest version of that
  puzzle anywhere.

Silentbrother's images are hotlinked from Steam and credited with a link on every figure. They are
his work, not CC-licensed, so if he ever asks for them to come down, remove those ten `<figure>`
blocks — searching the file for `steamusercontent` finds all of them.

Note that a few images in his guide are ones *he* took from elsewhere — he credits
es.callofduty.wikia.com, comunidadzombies.com and a YouTube user for the ice, wind and lightning
puzzle charts, and one screenshot carries another site's watermark. Those are deliberately not used
here; the equivalents come from the wiki instead.

Five figures have both, and carry a **Diagram / Photo** switch: the dig site, the Crazy Place, the
tank route, the surface tasks and the G-Strike loop. The **Figures** control in the page header flips
every one of them at once; a switch on an individual figure overrides just that one. The choice is
saved in the browser alongside your checklist progress.

The four symbol-chart puzzle keys (fire torches, ice panels, wind rings, lightning keyboard) are
screenshots rather than redraws, since a transcription error in a symbol chart would be expensive
mid-game.

On narrow screens the diagrams scroll horizontally at a readable size instead of shrinking their
labels into nothing.
