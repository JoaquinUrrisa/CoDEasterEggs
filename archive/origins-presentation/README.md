# Origins presentation (archived)

A standalone, single-file version of the Origins **Little Lost Girl** guide, built before the guide
was folded into this site. Kept because it is self-contained: open `presentation.html` in any browser
and everything works offline, with no server and no network.

It was originally published as a Claude Artifact at
<https://claude.ai/code/artifact/8be46718-1ba9-488f-bc31-68bf834a9ca8>.

## The two files

| File | What it is |
|---|---|
| `presentation.src.html` | The editable source. Images are `@@Placeholder@@` tokens. |
| `presentation.html` | The built file, 2.7 MB, with 32 screenshots inlined as WebP data URIs. |

The data URIs are why it works offline, and why it is large. They exist because the artifact host
blocks external images; nothing on this site has that restriction, which is why the live guide
hotlinks its screenshots instead.

## Status

**Superseded** by [`guides/black-ops-2/origins/`](../../guides/black-ops-2/origins/), which has
everything this has plus the role picker, checklists, the diagram/photo switch and the printable
per-player briefs. This copy is a snapshot and is not kept in sync — where the two disagree, the
live guide is right. Notably, this file still says the church torches are numbered 1–7. They are
not: they carry the values 3, 4, 5, 6, 7, 9 and 11.

Safe to delete if the repository size ever matters.
