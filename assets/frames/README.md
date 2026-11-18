# Valhalla individual transparent assets

Each numbered PNG contains one visible pose/effect from the source sheet, in left-to-right order. PNGs have a real alpha channel and 4 pixels of transparent padding. Folders group movements; effects and portraits have their own folders.

The sheet's printed frame counts do not match the actual drawings. These exports contain 105 visible animation poses, 19 standalone effects, and 5 portraits (129 PNGs). No missing poses have been invented. Native source resolution is preserved; the source is a flattened illustration, so some fine dark edge detail and faint glow cannot be recovered perfectly.

preview.png is a contact sheet with a checkerboard background for inspection only. Individual asset PNGs have no checkerboard/background. manifest.json records each source rectangle and output size. Existing assets outside frames/ are retained unchanged.

Source: ../source/valhalla_original.png
Extraction: ../tools/split_sprites.py (requires Pillow, NumPy, SciPy).
