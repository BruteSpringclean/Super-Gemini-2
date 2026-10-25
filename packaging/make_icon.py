"""Draws the app icon (AppIcon.png, .icns for Mac, .ico for Windows). Run: python3 packaging/make_icon.py"""
import os
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
S = 4096  # draw large, then scale down for smooth edges
ORANGE, TEAL, PINK = (240, 162, 59), (76, 194, 196), (232, 111, 176)


def draw():
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    # macOS icon grid: 824/1024 rounded square with a soft shadow
    m, r = S * 100 // 1024, S * 185 // 1024
    shadow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((m, m + S // 64, S - m, S - m + S // 64), r, fill=(0, 0, 0, 110))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(S // 80)))

    tile = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    grad = Image.new("RGBA", (S, S))
    gd = ImageDraw.Draw(grad)
    for y in range(S):
        t = y / S
        gd.line((0, y, S, y), fill=(int(40 - 18 * t), int(43 - 19 * t), int(54 - 22 * t), 255))
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle((m, m, S - m, S - m), r, fill=255)
    tile.paste(grad, (0, 0), mask)
    d = ImageDraw.Draw(tile)

    # the "twins": two half-filled circles, as in the app's logo
    cy, rad, gap = S * 0.42, S * 0.165, S * 0.2
    for cx, col, left_filled in ((S / 2 - gap, ORANGE, True), (S / 2 + gap, TEAL, False)):
        box = (cx - rad, cy - rad, cx + rad, cy + rad)
        d.ellipse(box, outline=col, width=int(S * 0.028))
        start, end = (90, 270) if left_filled else (270, 90)
        d.pieslice(box, start, end, fill=col)

    # eight slot pads, like one bank on the synth
    pad_w, pad_gap = S * 0.068, S * 0.017
    total = 8 * pad_w + 7 * pad_gap
    x0, y0 = (S - total) / 2, S * 0.68
    for i in range(8):
        x = x0 + i * (pad_w + pad_gap)
        col = PINK if i == 4 else (ORANGE if i == 2 else (72, 77, 92))
        d.rounded_rectangle((x, y0, x + pad_w, y0 + pad_w * 1.25), S * 0.012, fill=col)
    img.alpha_composite(tile)
    return img.resize((1024, 1024), Image.LANCZOS)


if __name__ == "__main__":
    icon = draw()
    icon.save(os.path.join(HERE, "AppIcon.png"))
    icon.save(os.path.join(HERE, "AppIcon.icns"),
              sizes=[(16, 16), (32, 32), (64, 64), (128, 128), (256, 256), (512, 512), (1024, 1024)])
    icon.save(os.path.join(HERE, "AppIcon.ico"), sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print("wrote AppIcon.png, AppIcon.icns and AppIcon.ico")
