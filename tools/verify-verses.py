"""Verify every KJV verse embedded in js/data.js, word for word.

Downloads the Project Gutenberg King James Bible (public domain) and compares
each verse in the app against it. Exact wording matters in this project, so
run this after ANY edit to the verse text in js/data.js.

    python tools/verify-verses.py

Expected output: "checked 37 verses - 0 problem(s)".
Needs an internet connection the first time (caches the text next to this file).
"""

import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
CACHE = os.path.join(HERE, "kjv-gutenberg.txt")
SOURCE = "https://www.gutenberg.org/cache/epub/10/pg10.txt"

# Project Gutenberg book headings -> the short names used in the app
BOOKS = {
    "The Gospel According to Saint Matthew": "Matthew",
    "The Gospel According to Saint Mark": "Mark",
    "The Gospel According to Saint Luke": "Luke",
    "The Gospel According to Saint John": "John",
    "The Acts of the Apostles": "Acts",
    "The Epistle of Paul the Apostle to the Romans": "Romans",
    "The First Epistle of Paul the Apostle to the Corinthians": "1 Corinthians",
    "The Epistle of Paul the Apostle to the Ephesians": "Ephesians",
    "The Epistle of Paul the Apostle to Titus": "Titus",
    "The General Epistle of James": "James",
    "The First Epistle General of Peter": "1 Peter",
    "The Revelation of Saint John the Divine": "Revelation",
}


def load_source():
    if not os.path.exists(CACHE):
        print("Downloading the Project Gutenberg KJV (about 4.5 MB)...")
        urllib.request.urlretrieve(SOURCE, CACHE)
    return open(CACHE, encoding="utf-8-sig").read()


def build_bible(raw):
    """Parse the Gutenberg text into {book: {"chapter:verse": text}}."""
    # A book starts where a title line is followed, after blank lines, by verse 1:1.
    # More reliable than trying to match every possible title spelling.
    all_heads = sorted(m.start(1) for m in re.finditer(r"(?m)^(\S[^\n]*)\n\n+1:1 ", raw))

    starts = []
    for heading, short in BOOKS.items():
        hits = [m.start() for m in re.finditer(r"(?m)^" + re.escape(heading) + r"\s*$", raw)]
        if not hits:
            sys.exit("Could not find book heading: " + heading)
        starts.append((hits[-1], short))     # last hit = the body, not the contents list

    bible = {}
    for pos, short in sorted(starts):
        following = [p for p in all_heads if p > pos + 10]
        body = raw[pos:following[0] if following else len(raw)]
        flat = re.sub(r"\s+", " ", body)
        verses = {}
        for m in re.finditer(r"(\d+):(\d+)\s(.*?)(?=\s\d+:\d+\s|$)", flat):
            verses["%s:%s" % (m.group(1), m.group(2))] = m.group(3).strip()
        bible[short] = verses
    return bible


def load_app_verses():
    """Pull the KJV object out of js/data.js."""
    src = open(os.path.join(PROJ, "js", "data.js"), encoding="utf-8").read()
    block = src.split("const KJV = {", 1)[1].split("\n};", 1)[0]
    out = {}
    for m in re.finditer(r'"([^"]+)":\s*\n?\s*"((?:[^"\\]|\\.)*)"', block):
        out[m.group(1)] = m.group(2).replace('\\"', '"').replace("\\\\", "\\")
    return out


def norm(s):
    s = s.replace("’", "'").replace("‘", "'")
    s = s.replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).strip()


def main():
    bible = build_bible(load_source())
    mine = load_app_verses()
    print("verses embedded in the app: %d\n" % len(mine))

    problems = 0
    for ref, text in mine.items():
        m = re.match(r"^(\d?\s?[A-Za-z ]+?)\s(\d+):(\d+)$", ref)
        if not m:
            print("?? cannot parse reference: " + ref)
            problems += 1
            continue
        book, ch, vs = m.group(1).strip(), m.group(2), m.group(3)
        official = bible.get(book, {}).get(ch + ":" + vs)
        if official is None:
            print("MISSING  %-22s not found in the source text" % ref)
            problems += 1
        elif norm(official) != norm(text):
            problems += 1
            print("MISMATCH %s\n   app:    %s\n   source: %s\n" % (ref, norm(text), norm(official)))

    print("\n" + "=" * 60)
    print("checked %d verses - %d problem(s)" % (len(mine), problems))
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
