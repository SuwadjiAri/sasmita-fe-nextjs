"""Generate app/icon.png (Next.js favicon convention) from logo-sasmita.jpeg.

Strategy: crop the original logo to just the leftmost letter "S" plus some
padding, then place it on a square transparent canvas at 512x512. Next.js
auto-resizes for various platforms (16x16 tab, 32x32, 180x180 apple, etc).

We crop from the *original* JPEG (not the trimmed PNG) so we have the
context of the full square layout to find the S. Sun graphic sits above
the "I" (~5th letter), so we want only the leftmost ~1/7 of the text width.
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "logo-sasmita.jpeg"
DST = ROOT / "src" / "app" / "icon.png"

WHITE_CUTOFF = 245
FEATHER_START = 215
OUTPUT_SIZE = 512

img = Image.open(SRC).convert("RGBA")
pixels = img.load()
w, h = img.size

# Make white pixels transparent (same algorithm as logo conversion)
for y in range(h):
    for x in range(w):
        r, g, b, _ = pixels[x, y]
        m = min(r, g, b)
        if m >= WHITE_CUTOFF:
            pixels[x, y] = (r, g, b, 0)
        elif m >= FEATHER_START:
            alpha = int(255 * (WHITE_CUTOFF - m) / (WHITE_CUTOFF - FEATHER_START))
            pixels[x, y] = (r, g, b, alpha)

# Find tight bbox of opaque content (the whole "SASMITA.com" text)
alpha = img.split()[-1]
bbox = alpha.getbbox()
left, top, right, bottom = bbox
text_w = right - left
text_h = bottom - top

# The S is approximately the first letter of SASMITA. SASMITA has 7 chars,
# ".com" is much smaller. Roughly the S occupies first ~13% of total width.
# Take a slightly wider crop to include any sun/decoration that sits over
# the S area, but in this logo the sun is over the I.
s_width_ratio = 0.105
s_right = left + int(text_w * s_width_ratio)

# Crop the S region with vertical padding to capture full letter height.
crop = img.crop((left, top, s_right, bottom))
cw, ch = crop.size

# Place on square canvas, centered, with ~10% padding on each side.
canvas = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0, 0))
inner = int(OUTPUT_SIZE * 0.78)  # ~11% padding each side
scale = min(inner / cw, inner / ch)
new_w = int(cw * scale)
new_h = int(ch * scale)
crop_resized = crop.resize((new_w, new_h), Image.LANCZOS)
offset = ((OUTPUT_SIZE - new_w) // 2, (OUTPUT_SIZE - new_h) // 2)
canvas.paste(crop_resized, offset, crop_resized)

DST.parent.mkdir(parents=True, exist_ok=True)
canvas.save(DST, "PNG", optimize=True)
print(f"Wrote {DST} ({canvas.size[0]}x{canvas.size[1]}, {DST.stat().st_size} bytes)")
