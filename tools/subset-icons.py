"""
Subsets the icon fonts to the glyphs the site actually uses, writing fonts/subset/*.woff2.
css/icon.slim.css (made by tools/build-css.mjs) points at these files.

Run after `node tools/build-css.mjs`:
    pip install fonttools brotli
    python tools/subset-icons.py

Codepoints are collected from every CSS string escape ("\\xxxx", including Font Awesome's
--fa variables) in the slim icon CSS, the site CSS and the pages, so an icon added to a page
is picked up on the next build.
"""
import glob
import os
import re
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.environ.get("SITE_ROOT") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

FONTS = {  # source -> subset output (all woff2)
    "fonts/bootstrap-icons.woff2": "fonts/subset/bootstrap-icons.woff2",
    "fonts/feather.ttf": "fonts/subset/feather.woff2",
    "fonts/fa-brands-400.woff2": "fonts/subset/fa-brands-400.woff2",
    "fonts/fa-solid-900.woff2": "fonts/subset/fa-solid-900.woff2",
    "fonts/fa-regular-400.woff2": "fonts/subset/fa-regular-400.woff2",
    "fonts/themify.woff2": "fonts/subset/themify.woff2",
}

sources = ["css/icon.slim.css", "css/core.min.css"] + glob.glob("css/site-standard.css") + glob.glob("*.html")
codepoints = set()
for path in sources:
    with open(path, encoding="utf-8", errors="ignore") as fh:
        text = fh.read()
    # any CSS string escape: content:"\f101", Font Awesome's --fa:"\f39e", "\e9a1" ...
    for hexcode in re.findall(r'["\']\\([0-9a-fA-F]{2,6})', text):
        codepoints.add(int(hexcode, 16))
    # icons placed directly as characters / HTML entities (&#xf101;)
    for hexcode in re.findall(r'&#x([0-9a-fA-F]{2,6});', text):
        codepoints.add(int(hexcode, 16))
    # raw private-use characters (Font Awesome 7 writes --fa:"<char>" unescaped)
    codepoints |= {ord(ch) for ch in text if 0xE000 <= ord(ch) <= 0xF8FF or ord(ch) >= 0xF0000}
codepoints |= set(range(0x20, 0x7F))  # ligature / text-safe basics

os.makedirs("fonts/subset", exist_ok=True)
for src, out in FONTS.items():
    if not os.path.exists(src):
        continue
    font = TTFont(src)
    cmap = font.getBestCmap() or {}
    keep = sorted(cp for cp in codepoints if cp in cmap)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=keep)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(out)
    print(f"{out}: {len(keep)} glyphs, {os.path.getsize(src) // 1024} KB -> {os.path.getsize(out) // 1024} KB")
sys.exit(0)
