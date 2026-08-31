#!/usr/bin/env python3
"""Turn the per-player markdown briefs into print-ready HTML, and then PDFs.

The markdown in players/*.md is the source of truth. This script regenerates
players/<name>.html and players/<name>.pdf from it.

    python3 tools/build_briefs.py            # HTML + PDF
    python3 tools/build_briefs.py --html     # HTML only, no browser needed

PDF rendering shells out to Chrome's headless print-to-pdf. Nothing else in the
repository needs a build step; the generated files are committed so the site
stays a plain static folder.
"""

import argparse
import html
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PLAYERS = os.path.join(ROOT, "guides", "black-ops-2", "origins", "players")

ORDER = ["FireStaff", "IceStaff", "LightningStaff", "WindStaff"]
ELEMENT = {
    "FireStaff": ("fire", "Fire Staff", "P1"),
    "IceStaff": ("ice", "Ice Staff", "P2"),
    "LightningStaff": ("lightning", "Lightning Staff", "P3"),
    "WindStaff": ("wind", "Wind Staff", "P4"),
}

CHROME_CANDIDATES = [
    "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
]


# --------------------------------------------------------------------------
# markdown -> html
# --------------------------------------------------------------------------

MAX_IMAGE_WIDTH = 900


def scaled(url):
    """Ask the CDN for a display-sized copy. The originals are up to 2000px
    wide, which makes the PDFs an order of magnitude bigger than they need
    to be for something people print or read on a phone."""
    if "static.wikia.nocookie.net" in url and "/scale-to-width-down/" not in url:
        return url.rstrip("/") + "/revision/latest/scale-to-width-down/%d" % MAX_IMAGE_WIDTH
    if "images.steamusercontent.com" in url and "?" not in url:
        return url + "?imw=%d&imh=%d&ima=fit" % (MAX_IMAGE_WIDTH, MAX_IMAGE_WIDTH)
    return url


def inline(text):
    """Inline markdown. Code spans are protected first so their contents
    are never treated as emphasis."""
    spans = []

    def stash(match):
        spans.append(match.group(1))
        return "\x00%d\x00" % (len(spans) - 1)

    text = re.sub(r"`([^`]+)`", stash, text)
    text = html.escape(text, quote=False)
    text = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)",
                  lambda m: '<img src="%s" alt="%s" loading="lazy" />'
                            % (scaled(m.group(2)), m.group(1)), text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<![*\w])\*([^*\n]+)\*(?![*\w])", r"<em>\1</em>", text)
    text = re.sub(r"\x00(\d+)\x00",
                  lambda m: "<code>%s</code>" % html.escape(spans[int(m.group(1))]),
                  text)
    return text


def split_row(line):
    cells = line.strip().strip("|").split("|")
    return [inline(c.strip()) for c in cells]


def convert(md):
    """Markdown subset -> HTML. Covers exactly what the briefs use:
    headings, paragraphs, lists, task lists, blockquotes, tables, rules,
    images, links and inline emphasis."""
    lines = md.split("\n")
    out = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        # horizontal rule
        if re.fullmatch(r"-{3,}", stripped):
            out.append("<hr />")
            i += 1
            continue

        # fenced code
        if stripped.startswith("```"):
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith("```"):
                buf.append(html.escape(lines[i]))
                i += 1
            i += 1
            out.append("<pre><code>%s</code></pre>" % "\n".join(buf))
            continue

        # heading
        m = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if m:
            level = len(m.group(1))
            out.append("<h%d>%s</h%d>" % (level, inline(m.group(2)), level))
            i += 1
            continue

        # table
        if stripped.startswith("|") and i + 1 < n and re.match(r"^\|[\s:|-]+\|?$", lines[i + 1].strip()):
            head = split_row(lines[i])
            i += 2
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append(split_row(lines[i]))
                i += 1
            thead = "".join("<th>%s</th>" % c for c in head)
            tbody = "".join(
                "<tr>%s</tr>" % "".join("<td>%s</td>" % c for c in r) for r in rows
            )
            out.append(
                '<div class="table-wrap"><table><thead><tr>%s</tr></thead>'
                "<tbody>%s</tbody></table></div>" % (thead, tbody)
            )
            continue

        # blockquote — becomes a callout, and a leading **bold** run becomes its label
        if stripped.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(re.sub(r"^\s*>\s?", "", lines[i]))
                i += 1
            body = " ".join(x.strip() for x in buf if x.strip())
            kind = "note"
            if body.startswith("⚠"):
                kind = "warn"
            elif body.startswith("💡") or body.startswith("🔁") or body.startswith("🩸"):
                kind = "tip"
            body = body.lstrip("⚠️💡🔁🩸 ").strip()
            label = ""
            m = re.match(r"^\*\*([^*]+)\*\*\s*(.*)$", body)
            if m:
                label = "<b>%s</b>" % inline(m.group(1))
                body = m.group(2)
            out.append('<div class="callout %s">%s%s</div>' % (kind, label, inline(body)))
            continue

        # lists
        if re.match(r"^\s*([-*]|\d+\.)\s+", line):
            ordered = bool(re.match(r"^\s*\d+\.\s+", line))
            tag = "ol" if ordered else "ul"
            items = []
            task = False
            while i < n and (re.match(r"^\s*([-*]|\d+\.)\s+", lines[i])
                             or (lines[i].startswith("  ") and lines[i].strip()
                                 and items)):
                cur = lines[i]
                if re.match(r"^\s*([-*]|\d+\.)\s+", cur):
                    text = re.sub(r"^\s*([-*]|\d+\.)\s+", "", cur)
                    box = re.match(r"^\[([ xX])\]\s*(.*)$", text)
                    if box:
                        task = True
                        checked = " checked" if box.group(1).lower() == "x" else ""
                        text = ('<label><input type="checkbox" disabled%s /> <span>%s</span></label>'
                                % (checked, inline(box.group(2))))
                        items.append(text)
                    else:
                        items.append(inline(text))
                else:                       # continuation line of the previous item
                    items[-1] += " " + inline(cur.strip())
                i += 1
            cls = ' class="tasks"' if task else ""
            out.append("<%s%s>%s</%s>" % (tag, cls,
                                          "".join("<li>%s</li>" % x for x in items), tag))
            continue

        # paragraph — join until a blank line or the start of another block
        buf = [line.strip()]
        i += 1
        while i < n and lines[i].strip() and not re.match(
                r"^\s*(#{1,6}\s|[-*]\s|\d+\.\s|>|\||```|-{3,}$)", lines[i]):
            buf.append(lines[i].strip())
            i += 1
        para = inline(" ".join(buf))
        if re.fullmatch(r'\s*(<img [^>]+/>\s*)+', para):
            out.append('<p class="figure">%s</p>' % para)
        else:
            out.append("<p>%s</p>" % para)

    return "\n".join(out)


# --------------------------------------------------------------------------
# page shell
# --------------------------------------------------------------------------

def page(name, body):
    slug, title, who = ELEMENT[name]
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="Printable single-player brief for the {who} {title} player in the Origins Little Lost Girl Easter Egg." />
<title>{title} Brief — Origins Little Lost Girl</title>
<link rel="icon" href="../../../../assets/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="print.css" />
</head>
<body data-element="{slug}">
<div class="toolbar">
  <a class="back" href="../">&larr; Full guide</a>
  <span class="toolbar-title">{who} &middot; {title}</span>
  <span class="toolbar-actions">
    <a href="{name}.pdf" download>Download PDF</a>
    <a href="{name}.md">Markdown</a>
    <button type="button" onclick="window.print()">Print</button>
  </span>
</div>
<main class="sheet">
{body}
</main>
</body>
</html>
""".format(name=name, slug=slug, title=title, who=who, body=body)


# --------------------------------------------------------------------------
# pdf
# --------------------------------------------------------------------------

def find_chrome():
    for c in CHROME_CANDIDATES:
        p = shutil.which(c) if not c.startswith("/") else (c if os.path.exists(c) else None)
        if p:
            return p
    return None


def to_pdf(chrome, html_path, pdf_path):
    with tempfile.TemporaryDirectory() as profile:
        cmd = [
            chrome, "--headless", "--disable-gpu", "--no-sandbox",
            "--no-pdf-header-footer",
            "--user-data-dir=" + profile,
            "--virtual-time-budget=15000",
            "--print-to-pdf=" + pdf_path,
            "file://" + html_path,
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) == 0:
            raise RuntimeError("chrome produced no pdf\n" + res.stderr[-2000:])
    shrink(pdf_path)


def shrink(pdf_path):
    """Downsample images to something sane for print. Skipped silently if
    ghostscript is not installed — the PDF is still valid, just heavier."""
    gs = shutil.which("gs")
    if not gs:
        return
    tmp = pdf_path + ".tmp"
    cmd = [
        gs, "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.5",
        "-dPDFSETTINGS=/ebook", "-dNOPAUSE", "-dQUIET", "-dBATCH",
        "-dDetectDuplicateImages=true",
        "-dColorImageResolution=150", "-dGrayImageResolution=150",
        "-sOutputFile=" + tmp, pdf_path,
    ]
    try:
        subprocess.run(cmd, capture_output=True, timeout=180, check=True)
    except Exception:
        if os.path.exists(tmp):
            os.remove(tmp)
        return
    if os.path.getsize(tmp) < os.path.getsize(pdf_path):
        os.replace(tmp, pdf_path)
    else:
        os.remove(tmp)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--html", action="store_true", help="skip PDF rendering")
    args = ap.parse_args()

    chrome = None if args.html else find_chrome()
    if not args.html and not chrome:
        print("No Chrome found; writing HTML only.", file=sys.stderr)

    for name in ORDER:
        md_path = os.path.join(PLAYERS, name + ".md")
        html_path = os.path.join(PLAYERS, name + ".html")
        pdf_path = os.path.join(PLAYERS, name + ".pdf")

        md = open(md_path, encoding="utf-8").read()
        open(html_path, "w", encoding="utf-8").write(page(name, convert(md)))
        print("html  %s" % os.path.relpath(html_path, ROOT))

        if chrome:
            to_pdf(chrome, html_path, pdf_path)
            print("pdf   %s  (%d KB)" % (os.path.relpath(pdf_path, ROOT),
                                         os.path.getsize(pdf_path) // 1024))


if __name__ == "__main__":
    main()
