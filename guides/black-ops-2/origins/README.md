# Origins — Little Lost Girl

Interactive companion guide for the Black Ops II Zombies Origins main Easter Egg (**Little Lost Girl**),
built for a **squad of four**.

## Open the guide

Open [`index.html`](./index.html) in a browser (a phone or tablet works best while playing).

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

Pruned single-role versions live in [`players/`](./players/), one per staff. They are plain markdown
so they print cleanly or can be read on a second screen:

- [Fire Staff (P1)](./players/FireStaff.md) — church and Gen 6, the plane, the round-8 Panzer
- [Ice Staff (P2)](./players/IceStaff.md) — shovel duty, snow windows, the Zombie Blood farm
- [Lightning Staff (P3)](./players/LightningStaff.md) — tank driver, the seven electrical panels
- [Wind Staff (P4)](./players/WindStaff.md) — robot entries, the gramophone circuit

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
