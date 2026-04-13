-- Add Song of Van Linh to Open Library
-- Vietnamese mythology × Arcanea novel series

INSERT INTO public.books (slug, title, subtitle, tier, status, genre, tags, license, ai_metadata, acknowledgments)
VALUES (
    'song-of-van-linh',
    'The Girl Who Heard the River',
    'Book One — The Song of Van Linh',
    'featured',
    'in-progress',
    'contemporary-fantasy',
    ARRAY['vietnamese-mythology', 'contemporary-fantasy', 'romantasy', 'ecological', 'ghibli', 'arcanea-universe'],
    'CC-BY-NC-SA-4.0',
    jsonb_build_object(
        'models_used', jsonb_build_array(jsonb_build_object('id', 'claude-opus-4-6', 'provider', 'anthropic', 'role', 'story-architecture-and-drafting')),
        'human_contribution', 25,
        'ai_contribution', 75
    ),
    'Book One of The Song of Van Linh — a four-book series set in modern Vietnam where ancient mythology bleeds through the cracks of the contemporary world. Connected to the Arcanea universe through the Unity Gate and Tu Linh sacred animals.'
) ON CONFLICT (slug) DO NOTHING;

-- Add author
INSERT INTO public.book_authors (book_id, user_id, author_name, role, order_index)
SELECT b.id, '00000000-0000-0000-0000-000000000000', 'FrankX', 'creator', 0
FROM public.books b WHERE b.slug = 'song-of-van-linh'
ON CONFLICT DO NOTHING;

-- Add cover reference
INSERT INTO public.book_covers (book_id, storage_tier, public_url, model_id, prompt_hash)
SELECT b.id, 'git', '/images/books/song-of-van-linh-cover.png', 'canva-ai', 'hoan-kiem-turtle-cover'
FROM public.books b WHERE b.slug = 'song-of-van-linh'
ON CONFLICT DO NOTHING;

-- Set active cover
UPDATE public.books
SET cover_id = (
    SELECT bc.id FROM public.book_covers bc
    JOIN public.books b2 ON bc.book_id = b2.id
    WHERE b2.slug = 'song-of-van-linh'
    ORDER BY bc.created_at DESC LIMIT 1
)
WHERE slug = 'song-of-van-linh';
