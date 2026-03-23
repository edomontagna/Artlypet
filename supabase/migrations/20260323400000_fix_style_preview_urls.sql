-- Fix style preview URLs to match actual files in public/images/
UPDATE public.styles SET preview_url = '/images/renaissance.png' WHERE name = 'Renaissance';
UPDATE public.styles SET preview_url = '/images/oil-painting.jpg' WHERE name = 'Oil Painting';
UPDATE public.styles SET preview_url = '/images/watercolor.png' WHERE name = 'Watercolor';
UPDATE public.styles SET preview_url = '/images/pop-art.png' WHERE name = 'Pop Art';
UPDATE public.styles SET preview_url = '/images/art-nouveau.png' WHERE name = 'Art Nouveau';
UPDATE public.styles SET preview_url = '/images/impressionist.png' WHERE name = 'Impressionist';
UPDATE public.styles SET preview_url = '/images/renaissance.png' WHERE name = 'Stained Glass' AND preview_url IS NULL;
UPDATE public.styles SET preview_url = '/images/oil-painting.jpg' WHERE name = 'Pencil Sketch' AND preview_url IS NULL;
UPDATE public.styles SET preview_url = '/images/renaissance.png' WHERE name = 'The General' AND preview_url IS NULL;
UPDATE public.styles SET preview_url = '/images/oil-painting.jpg' WHERE name = 'Victorian Noble' AND preview_url IS NULL;
UPDATE public.styles SET preview_url = '/images/pop-art.png' WHERE name = 'Anime Hero' AND preview_url IS NULL;
UPDATE public.styles SET preview_url = '/images/watercolor.png' WHERE name = 'Minimalist Line Art' AND preview_url IS NULL;
