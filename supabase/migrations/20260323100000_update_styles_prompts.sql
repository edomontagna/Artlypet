-- ============================================
-- Artlypet — Update art styles with pro-level prompts
-- + Add trending styles (Anime, Military, Victorian, Minimalist)
-- ============================================

-- 1. UPDATE existing styles with detailed, professional prompts

UPDATE public.styles SET
  description = 'Majestic royal court portrait with crown, robes, and regal grandeur',
  prompt_template = 'Create a majestic royal portrait of the pet in this photo. Dress the pet in lavish royal attire: an ornate golden crown encrusted with rubies and emeralds, a rich crimson velvet robe with ermine fur trim, and a jeweled medallion around the neck. Place the pet on an elaborate gilded throne against a backdrop of deep burgundy velvet drapes with gold tassels. Use dramatic Renaissance-style lighting with warm candlelight glow from the left. Paint in the style of a 17th-century Flemish court portrait — rich oil paint textures, visible brushwork in the fabric, luminous skin/fur rendering. Include heraldic elements: a family crest in the background and a royal scepter. The expression should be dignified and commanding. Museum-quality composition with a dark vignette frame.',
  sort_order = 1
WHERE name = 'Renaissance';

UPDATE public.styles SET
  description = 'Museum-quality oil painting with rich golden tones and Dutch Master technique',
  prompt_template = 'Transform this pet photo into a breathtaking classical oil painting in the style of the Dutch Golden Age masters — think Rembrandt, Vermeer, and Frans Hals. Render the pet with extraordinary attention to fur texture using visible, confident brushstrokes with thick impasto highlights. Use a rich, warm color palette: deep burnt umber shadows, golden ochre midtones, and luminous cream highlights. The background should be a traditional dark studio backdrop with a subtle warm gradient. Add dramatic chiaroscuro lighting — a single strong light source from the upper left creating deep, velvety shadows and brilliant highlights on the fur. Include subtle details: a worn leather collar, a glimpse of a wooden table edge, perhaps a draped fabric. The overall feel should be timeless, warm, and museum-worthy. Canvas texture visible throughout.',
  sort_order = 2
WHERE name = 'Oil Painting';

UPDATE public.styles SET
  description = 'Dreamy watercolor with soft washes, bleeding edges, and ethereal beauty',
  prompt_template = 'Transform this pet photo into an exquisite watercolor painting with masterful technique. Use soft, luminous color washes that bleed and flow naturally into each other — wet-on-wet technique creating beautiful, unpredictable color gradients. The pet should be rendered with a mix of precise detail in the eyes and nose, and loose, expressive brushwork in the fur and edges. Colors: a harmonious palette of soft dusty rose, cerulean blue, warm gold, and sage green. Let the white of the paper show through in highlights, creating luminosity. Add delicate splatter marks and drips at the edges for artistic expression. The background should dissolve into abstract washes of complementary colors — suggesting a garden or meadow without being literal. Include a few tiny botanical details (a flower, a leaf) rendered in fine line work. The overall mood should be dreamy, tender, and emotionally warm. Professional fine-art watercolor quality.',
  sort_order = 3
WHERE name = 'Watercolor';

UPDATE public.styles SET
  description = 'Bold Warhol-inspired pop art with electric colors and graphic energy',
  prompt_template = 'Create a stunning pop art portrait of this pet in the iconic style of Andy Warhol and Roy Lichtenstein. Use a bold, electric color palette: hot magenta, electric cyan, sunshine yellow, and vivid orange. Apply strong black outlines around the pet with graphic precision. Fill areas with flat, saturated color blocks. Add Ben-Day dot halftone patterns in the background and shadow areas. The pet''s expression should be captured with maximum personality and attitude. Create a high-contrast composition with dramatic shadows rendered as solid black shapes. The background should be a single vivid color (electric pink or cyan) with radiating graphic elements. Add subtle screen-print texture and slight color registration offset for authenticity. The overall effect should be bold, energetic, Instagram-worthy, and immediately eye-catching — like the pet is a celebrity icon.',
  sort_order = 4
WHERE name = 'Pop Art';

UPDATE public.styles SET
  description = 'Elegant Art Nouveau with flowing botanical lines and Mucha-inspired decoration',
  prompt_template = 'Transform this pet photo into a stunning Art Nouveau masterpiece inspired by Alphonse Mucha and Gustav Klimt. Frame the pet within an elaborate decorative border of flowing, organic lines — sinuous vines, stylized flowers (iris, lily, rose), and elegant scrollwork. Use a rich but harmonious color palette: deep forest green, burnished gold, dusty lavender, and warm copper. The pet should be rendered in a semi-realistic style with flowing, decorative fur lines that echo the surrounding ornamental patterns. Add a circular or arched halo-like frame behind the pet''s head, filled with intricate geometric and floral patterns. Include gold leaf accents and mosaic-like details reminiscent of Klimt. The background should feature a gradient from deep teal to warm gold. Typography-style decorative elements at the top and bottom complete the poster-like composition. Elegant, ornate, and breathtakingly detailed.',
  sort_order = 5
WHERE name = 'Art Nouveau';

UPDATE public.styles SET
  description = 'Sun-drenched Impressionist scene with vibrant brushwork and garden light',
  prompt_template = 'Paint this pet in a luminous Impressionist style inspired by Claude Monet, Pierre-Auguste Renoir, and Berthe Morisot. Place the pet in a sun-dappled garden scene — perhaps among blooming flowers, beside a lily pond, or on a sunlit terrace. Use visible, energetic brushstrokes in every area — thick dabs of pure color placed side by side to create vibrant optical mixing. The color palette should sing with light: cobalt blue shadows, cadmium yellow sunlight, viridian green foliage, and touches of rose madder in the flowers. Capture the specific quality of outdoor light — how it filters through leaves creating dancing patterns of warm and cool on the pet''s fur. The edges should be soft and atmospheric, dissolving into the landscape. Include impressionistic details: a garden path, a stone wall, wildflowers. The overall mood should be joyful, sun-warmed, and alive with color and light.',
  sort_order = 6
WHERE name = 'Impressionist';

UPDATE public.styles SET
  description = 'Luminous stained glass window with jewel tones and cathedral grandeur',
  prompt_template = 'Create a magnificent stained glass window portrait of this pet in the style of medieval cathedral rose windows and Louis Comfort Tiffany. Divide the composition into elegant geometric segments with bold black leading lines (3-5mm thick). Fill each segment with rich, jewel-toned translucent colors: deep sapphire blue, ruby red, emerald green, amethyst purple, and warm amber gold. The pet should be the central figure, rendered with simplified but recognizable features — faithful to the subject while embracing the stained glass aesthetic. Surround the pet with decorative elements: floral borders, geometric patterns, scrollwork, and perhaps a halo-like arch. Add the characteristic glow of backlit glass — lighter, more luminous colors in the highlights, deeper saturated tones in the shadows. Include a decorative border with repeating motifs. The overall effect should be sacred, luminous, and awe-inspiring — as if this window belongs in a grand cathedral.',
  sort_order = 7
WHERE name = 'Stained Glass';

UPDATE public.styles SET
  description = 'Refined graphite pencil drawing with hyper-detailed shading',
  prompt_template = 'Create a stunning hyperrealistic pencil sketch portrait of this pet using only graphite on white paper. Render with extraordinary precision: every individual hair/fur strand should be visible in key areas (around the eyes, ears, nose). Use a full range of graphite values from the lightest whisper of HB to rich, velvety 8B blacks in the deepest shadows. Build up texture through varied techniques: fine parallel hatching for smooth fur, cross-hatching for shadows, stippling for nose texture, and smooth blending for soft areas. The eyes must be the focal point — rendered with photorealistic detail showing reflections, the iris pattern, and catchlights that bring the portrait to life. Let the drawing fade from hyper-detailed center to loose, suggestive sketch marks at the edges — a vignette effect that draws attention to the face. Include subtle paper texture. The composition should be a classic 3/4 portrait angle. Museum-quality fine art pencil drawing.',
  sort_order = 8
WHERE name = 'Pencil Sketch';

-- 2. ADD NEW TRENDING STYLES

INSERT INTO public.styles (name, description, prompt_template, sort_order, is_active) VALUES
(
  'The General',
  'Distinguished military commander portrait with medals, epaulettes, and battlefield gravitas',
  'Create a distinguished military portrait of this pet as a decorated General or Admiral. Dress the pet in an elaborate 19th-century military dress uniform: navy blue or forest green coat with gold braid frogging, polished brass buttons in double rows, ornate gold epaulettes with heavy bullion fringe, and a chest full of military medals and decorations (including a prominent star-shaped medal of honor). Add a crimson silk sash across the chest and a high stiff collar with gold embroidery. The background should suggest a battlefield command tent or a grand military hall with maps and regimental flags. Use portrait lighting from the right — warm and authoritative. Paint in the style of 19th-century military portraiture (think Napoleon''s court painters). The pet''s expression should convey authority, courage, and quiet confidence. Include fine details: leather gloves on a table, a sword hilt at the side. Rich oil painting technique with visible canvas texture.',
  9,
  true
),
(
  'Victorian Noble',
  'Elegant Victorian-era aristocrat with lace, pearls, and old-world sophistication',
  'Transform this pet into an elegant Victorian-era aristocrat portrait. Dress the pet in exquisite Victorian attire: a high-collared dress or jacket in rich fabric (deep jewel tones — emerald, sapphire, or burgundy) with intricate lace collar and cuffs, delicate pearl necklace or pocket watch chain, and perhaps a monocle or cameo brooch. Style the composition as a formal studio portrait from the 1880s — the pet seated in an ornate carved wooden chair with velvet upholstery. Background: a mahogany-paneled study with leather-bound books, a globe, and heavy brocade curtains. Lighting should be soft and warm, as if from gas lamps — creating a gentle glow on the face and golden highlights on the jewelry. Paint in the style of John Singer Sargent or James Tissot — refined, sophisticated brushwork with luminous fabric rendering. The mood should be dignified, cultured, and timelessly elegant.',
  10,
  true
),
(
  'Anime Hero',
  'Dynamic anime-style portrait with expressive eyes and vibrant manga energy',
  'Transform this pet into a stunning anime/manga-style character portrait. Render with classic anime aesthetics: large, expressive, luminous eyes with detailed iris reflections (multiple catchlight sparkles), sleek stylized fur/hair with dynamic flow and movement, and a cute but heroic expression. Use clean, confident line work with varying thickness (thicker for outlines, thinner for details). Color with vibrant, saturated anime palette — rich blues, warm oranges, soft pinks, with dramatic color theory (warm highlights, cool shadows). Add a dynamic background: speed lines, floating cherry blossom petals, or sparkle/bokeh effects. Include anime visual effects: soft glow around the character, subtle blush marks, and dramatic eye highlights. The style should reference high-quality anime like Studio Ghibli or Makoto Shinkai — detailed, emotional, and beautiful. The pet should look like the protagonist of their own adventure anime.',
  11,
  true
),
(
  'Minimalist Line Art',
  'Clean single-line portrait with modern elegance and contemporary gallery appeal',
  'Create an elegant minimalist line art portrait of this pet using a single continuous flowing line or minimal lines on a clean white background. The line should be confident, smooth, and artistic — capturing the essential character and silhouette of the pet with remarkable economy. Use a single color for the line: either classic black, warm terracotta, or deep navy. The line weight should vary subtly — slightly thicker at key contours (back, head) and thinner at delicate areas (whiskers, ears). Capture the most distinctive features: the shape of the ears, the curve of the nose, the expression in the eyes (rendered with just a few precise strokes). Leave generous white space — the emptiness is as important as the line. Add one small accent: a tiny filled dot for the nose, or a subtle watercolor wash behind the head in a soft complementary color (blush pink, sage green, or sky blue). The result should feel like a piece from a high-end contemporary art gallery — sophisticated, modern, and effortlessly cool. Suitable for printing at any size.',
  12,
  true
);
