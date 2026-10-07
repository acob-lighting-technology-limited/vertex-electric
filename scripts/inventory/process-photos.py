"""Prepare real stock photos for the site.

- Detects green Chinese NEV number plates and blurs them (plus any extra
  regions listed in manual-redactions.json, for dealer plates/placards).
- Strips EXIF (location data from phones), fixes orientation, resizes to
  max 1800px and writes WebP to public/inventory/<stock>/.
- Writes manifest.json (file, size, source) used by the inventory seed.
- Writes a debug contact sheet with every redaction outlined, for review.

Usage: python scripts/inventory/process-photos.py <source-dir> <stock-number> [debug-sheet.jpg]
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[2]
src_dir, stock = Path(sys.argv[1]), sys.argv[2]
debug_path = sys.argv[3] if len(sys.argv) > 3 else None
manual = json.loads((ROOT / "scripts/inventory/manual-redactions.json").read_text(encoding="utf-8"))

out_dir = ROOT / "public/inventory" / stock.lower()
out_dir.mkdir(parents=True, exist_ok=True)
MAX = 1800


def green_plates(img: Image.Image):
    """Boxes of green NEV plates: saturated green, plate-shaped."""
    a = np.array(img.convert("RGB"))
    hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV)
    mask = cv2.inRange(hsv, (40, 90, 90), (90, 255, 255))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (15, 7)))
    n, _, stats, _ = cv2.connectedComponentsWithStats(mask)
    w_img = a.shape[1]
    boxes = []
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        if w < w_img * 0.04 or h < 8:
            continue
        ratio = w / h
        fill = area / (w * h)
        if 1.8 <= ratio <= 5.5 and fill > 0.45:
            # NEV plates fade from white (top) to green, so colour only finds the lower part: pad generously, more upwards.
            pad = int(h * 0.45)
            boxes.append((int(x - pad), int(y - h * 0.9), int(x + w + pad), int(y + h + pad)))
    return boxes


def redact(img: Image.Image, boxes):
    """Heavy blur inside each box, feathered at the edges so it blends instead of reading as a grey block."""
    for x0, y0, x1, y1 in boxes:
        h = max(1, y1 - y0)
        feather = max(6, h // 3)
        # Work on an expanded crop so the blur samples real surroundings.
        ex = (max(0, x0 - feather * 2), max(0, y0 - feather * 2), min(img.width, x1 + feather * 2), min(img.height, y1 + feather * 2))
        region = img.crop(ex)
        # Pixelate first (destroys characters irrecoverably), then blur to soften.
        small = region.resize((max(1, region.width // 10), max(1, region.height // 10)), Image.BILINEAR)
        blurred = small.resize(region.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(max(4, h // 6)))
        mask = Image.new("L", region.size, 0)
        inner = (x0 - ex[0], y0 - ex[1], x1 - ex[0], y1 - ex[1])
        mask.paste(255, inner)
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
        # The whole box stays fully covered; the feather only fades outward beyond it.
        mask.paste(255, inner)
        img.paste(Image.composite(blurred, region, mask), ex[:2])
    return img


sheet = []
manifest = []
files = sorted(p for p in src_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
for idx, p in enumerate(files, start=1):
    img = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    cfg = manual.get(stock, {})
    boxes = green_plates(img) if cfg.get("auto", True) else []
    # Manual boxes are stored as fractions of width/height so they survive resizes.
    for fx0, fy0, fx1, fy1 in cfg.get("boxes", {}).get(p.name, []):
        mx, my = (fx1 - fx0) * 0.12, (fy1 - fy0) * 0.12
        boxes.append((int((fx0 - mx) * img.width), int((fy0 - my) * img.height), int((fx1 + mx) * img.width), int((fy1 + my) * img.height)))
    img = redact(img, boxes)
    img.thumbnail((MAX, MAX), Image.LANCZOS)
    name = f"{idx:02d}.webp"
    img.save(out_dir / name, "WEBP", quality=82, method=6)  # new file: no EXIF carried over
    manifest.append({"file": name, "width": img.width, "height": img.height, "source": p.name, "redactions": len(boxes)})
    print(f"{p.name} -> {name} {img.size} redactions={len(boxes)}")

    if debug_path:
        d = img.copy()
        scale = img.width / ImageOps.exif_transpose(Image.open(p)).width
        dd = np.array(d)
        for x0, y0, x1, y1 in boxes:
            cv2.rectangle(dd, (int(x0 * scale), int(y0 * scale)), (int(x1 * scale), int(y1 * scale)), (255, 0, 0), 4)
        d = Image.fromarray(dd)
        d.thumbnail((420, 420))
        sheet.append((d, f"{idx:02d}"))

(out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

if debug_path and sheet:
    cols = 5
    W, H = 420, 420
    rows = (len(sheet) + cols - 1) // cols
    canvas = Image.new("RGB", (W * cols, H * rows), "white")
    for k, (im, _) in enumerate(sheet):
        canvas.paste(im, ((k % cols) * W, (k // cols) * H))
    canvas.save(debug_path, quality=85)
