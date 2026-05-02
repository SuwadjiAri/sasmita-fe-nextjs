"""Convert logo-sasmita.jpeg (white bg) -> logo-sasmita.png (transparent bg).

Strategy: pixels close to pure white become fully transparent; near-white pixels
get partial transparency proportional to their distance from white. This avoids
hard jagged edges around the colored letters and sun rays.
"""
from PIL import Image
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / "public" / "logo-sasmita.jpeg"
DST = Path(__file__).resolve().parents[1] / "public" / "logo-sasmita.png"

# Threshold: pixels with min(R,G,B) >= WHITE_CUTOFF are fully transparent.
# Pixels between FEATHER_START and WHITE_CUTOFF fade out smoothly.
WHITE_CUTOFF = 245
FEATHER_START = 215

img = Image.open(SRC).convert("RGBA")
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, _ = pixels[x, y]
        m = min(r, g, b)
        if m >= WHITE_CUTOFF:
            pixels[x, y] = (r, g, b, 0)
        elif m >= FEATHER_START:
            # Linear fade from 255 (at FEATHER_START) to 0 (at WHITE_CUTOFF)
            alpha = int(255 * (WHITE_CUTOFF - m) / (WHITE_CUTOFF - FEATHER_START))
            pixels[x, y] = (r, g, b, alpha)

# Crop to opaque-content bounding box (with small padding) so the logo isn't
# a mostly-empty square. getbbox() on the alpha channel finds the tight bounds.
alpha = img.split()[-1]
bbox = alpha.getbbox()
if bbox:
    pad = 16
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(w, bbox[2] + pad)
    bottom = min(h, bbox[3] + pad)
    img = img.crop((left, top, right, bottom))

img.save(DST, "PNG", optimize=True)
print(f"Wrote {DST} ({img.size[0]}x{img.size[1]}, {DST.stat().st_size} bytes)")
