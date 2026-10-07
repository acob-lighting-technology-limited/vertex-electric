"""Trace the supplied raster Vertex logo into flat vector paths.

Source: the 2138x735 PNG supplied by the client (glossy render on white).
Output: JSON of SVG path data for the ink silhouette and the blue blades,
consumed by build-logo.py to emit the logo variants.

Usage: python scripts/brand/trace-logo.py <source.png> <out.json>
"""
import json
import sys

import cv2
import numpy as np
import potrace
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src).convert("RGB")).astype(int)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

blue = ((b > 110) & (b - r > 70)).astype(np.uint8)
ink = ((lum < 170) | blue.astype(bool)).astype(np.uint8)

# Close the thin bevel highlight lines so each glyph traces as one solid shape.
ink = cv2.morphologyEx(ink, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))


def fill_small_holes(mask, max_area):
    inv = (1 - mask).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        touches_edge = x == 0 or y == 0 or x + w == mask.shape[1] or y + h == mask.shape[0]
        if not touches_edge and area < max_area:
            mask[lab == i] = 1
    return mask


ink = fill_small_holes(ink, 4000)

# The small "RC: 9872444" line needs its counters and colon intact, so it keeps
# the raw threshold instead of the closed/filled glyph mask.
RC_BOTTOM = 250
ink[:RC_BOTTOM] = (lum[:RC_BOTTOM] < 150).astype(np.uint8)

# Blades are parallelograms: replace each large component with its convex hull
# so bevel artefacts (the notch on the X blade) disappear.
blue = cv2.morphologyEx(blue, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7)))
n, lab, stats, _ = cv2.connectedComponentsWithStats(blue, connectivity=8)
blades = np.zeros_like(blue)
for i in range(1, n):
    if stats[i][4] < 1500:
        continue
    pts = cv2.findNonZero((lab == i).astype(np.uint8))
    hull = cv2.convexHull(pts)
    cv2.fillPoly(blades, [hull], 1)


def trace(mask, turd=8):
    bm = potrace.Bitmap(mask.astype(bool))
    plist = bm.trace(turdsize=turd, alphamax=0.9, opticurve=True, opttolerance=0.3)
    parts = []
    for curve in plist:
        s = curve.start_point
        d = [f"M{s.x:.1f} {s.y:.1f}"]
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f"L{seg.c.x:.1f} {seg.c.y:.1f}L{seg.end_point.x:.1f} {seg.end_point.y:.1f}")
            else:
                d.append(
                    f"C{seg.c1.x:.1f} {seg.c1.y:.1f} {seg.c2.x:.1f} {seg.c2.y:.1f} {seg.end_point.x:.1f} {seg.end_point.y:.1f}"
                )
        d.append("Z")
        pts = [(seg.end_point.x, seg.end_point.y) for seg in curve.segments]
        xs_, ys_ = [p[0] for p in pts], [p[1] for p in pts]
        parts.append({"d": "".join(d), "bbox": [min(xs_), min(ys_), max(xs_), max(ys_)]})
    return parts


ys, xs = np.where(ink > 0)
bbox = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
json.dump({"bbox": bbox, "ink": trace(ink), "blade": trace(blades)}, open(out, "w"))
print("bbox", bbox)
