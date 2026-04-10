-- =====================================================================
-- OPEN LIBRARY — Phase 2: Community-Ready Publishing
-- =====================================================================
-- Purpose: Multi-author book publishing with covers, ratings, Guardian reviews
-- Tables: books, book_authors, book_covers, book_chapters, book_ratings,
--         guardian_reviews
-- Storage: book-covers bucket (public read, RLS write)
-- =====================================================================

-- =====================================================================
-- BOOKS TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    tagline TEXT,

    -- Tier system
    tier TEXT NOT NULL DEFAULT 'community'
        CHECK (tier IN ('community', 'featured', 'canon')),
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'in-progress', 'complete', 'archived')),

    -- Display
    cover_id UUID, -- FK added after book_covers table exists
    tags TEXT[] DEFAULT '{}',
    genre TEXT,
    content_rating TEXT DEFAULT 'general',
    license TEXT DEFAULT 'CC-BY-NC-SA-4.0',

    -- Stats (denormalized for performance)
    total_word_count INT DEFAULT 0,
    chapter_count INT DEFAULT 0,
    star_average NUMERIC(3,2),
    rating_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    guardian_score NUMERIC(3,1), -- 0.0 to 10.0

    -- AI transparency (JSONB for flexibility)
    ai_metadata JSONB DEFAULT '{}'::jsonb,

    -- Acknowledgments and attribution
    acknowledgments TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_books_slug ON public.books(slug);
CREATE INDEX IF NOT EXISTS idx_books_tier_status ON public.books(tier, status);
CREATE INDEX IF NOT EXISTS idx_books_published ON public.books(published_at DESC NULLS LAST)
    WHERE status IN ('in-progress', 'complete');

COMMENT ON TABLE public.books IS 'Open Library book registry — multi-author, multi-tier publishing';
COMMENT ON COLUMN public.books.tier IS 'community (auto-merge), featured (curated), canon (Frank-only flagship)';
COMMENT ON COLUMN public.books.ai_metadata IS 'JSONB: {models_used, human_contribution, ai_contribution, method}';

-- =====================================================================
-- BOOK AUTHORS (multi-author support)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.book_authors (
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- For authors without platform accounts (git-only contributors)
    author_name TEXT NOT NULL,
    author_github TEXT,

    role TEXT NOT NULL CHECK (role IN (
        'creator', 'co_author', 'co_creator', 'editor', 'contributor',
        'illustrator', 'translator'
    )),
    contribution_note TEXT,
    order_index INT DEFAULT 0, -- byline order

    added_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    PRIMARY KEY (book_id, author_name)
);

CREATE INDEX IF NOT EXISTS idx_book_authors_user ON public.book_authors(user_id)
    WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_book_authors_book ON public.book_authors(book_id);

COMMENT ON TABLE public.book_authors IS 'Multi-author attribution. user_id nullable for git-only contributors.';

-- =====================================================================
-- BOOK COVERS (versioned, multi-source)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.book_covers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'archived')),

    -- Storage location (hybrid: git OR supabase)
    storage_tier TEXT NOT NULL
        CHECK (storage_tier IN ('git', 'supabase')),
    storage_path TEXT NOT NULL, -- /images/books/... OR book-covers/{slug}/v{n}.png
    public_url TEXT NOT NULL,   -- resolved CDN URL

    -- AI generation metadata
    model_id TEXT,              -- e.g. gemini-3.1-flash-image-preview
    model_tier TEXT,            -- nb2, nbpro, imagen-ultra, human
    prompt TEXT,                -- the full prompt used
    generation_params JSONB DEFAULT '{}'::jsonb,
    generation_cost_usd NUMERIC(6,4),

    -- Attribution chain
    generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,

    -- Image metadata
    width INT,
    height INT,
    file_size_bytes BIGINT,
    mime_type TEXT DEFAULT 'image/png',
    dominant_colors TEXT[], -- extracted palette

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    UNIQUE (book_id, version)
);

CREATE INDEX IF NOT EXISTS idx_book_covers_book ON public.book_covers(book_id);
CREATE INDEX IF NOT EXISTS idx_book_covers_active ON public.book_covers(book_id)
    WHERE status = 'active';

-- Now add FK from books to book_covers
ALTER TABLE public.books
    ADD CONSTRAINT books_cover_id_fkey
    FOREIGN KEY (cover_id) REFERENCES public.book_covers(id) ON DELETE SET NULL;

COMMENT ON TABLE public.book_covers IS 'Versioned book covers with AI generation metadata and attribution chain';
COMMENT ON COLUMN public.book_covers.storage_tier IS 'git (committed to repo) or supabase (uploaded to Storage bucket)';

-- =====================================================================
-- BOOK CHAPTERS (DB-backed chapter index)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,

    slug TEXT NOT NULL,
    number INT NOT NULL, -- 0 for prologue, 1+ for chapters
    title TEXT NOT NULL,
    subtitle TEXT,

    -- Content location (source of truth is git; DB is index)
    git_path TEXT NOT NULL, -- book/{slug}/chapters/{n}-{slug}.md
    word_count INT DEFAULT 0,
    excerpt TEXT,

    -- Publishing state
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'revised')),
    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    UNIQUE (book_id, slug),
    UNIQUE (book_id, number)
);

CREATE INDEX IF NOT EXISTS idx_book_chapters_book ON public.book_chapters(book_id, number);

COMMENT ON TABLE public.book_chapters IS 'Chapter index. Git is source of truth; this table is for queries.';

-- =====================================================================
-- BOOK RATINGS (community stars + reviews)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.book_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    review TEXT,

    -- Moderation
    is_hidden BOOLEAN DEFAULT FALSE,
    reported_count INT DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    UNIQUE (book_id, user_id) -- one rating per user per book
);

CREATE INDEX IF NOT EXISTS idx_book_ratings_book ON public.book_ratings(book_id)
    WHERE is_hidden = FALSE;

-- =====================================================================
-- GUARDIAN REVIEWS (editorial intelligence ratings)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.guardian_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,

    guardian TEXT NOT NULL CHECK (guardian IN (
        'alera', 'draconia', 'lyria', 'lyssandria', 'maylinn'
    )),
    dimension TEXT NOT NULL CHECK (dimension IN (
        'voice', 'craft', 'originality', 'depth', 'resonance'
    )),

    score NUMERIC(3,1) NOT NULL CHECK (score BETWEEN 0 AND 10),
    assessment TEXT,     -- one-line Guardian verdict
    detailed_notes TEXT, -- longer feedback for author

    -- Generation metadata
    model_id TEXT,       -- which LLM ran the review
    prompt_version TEXT, -- which prompt template version

    assessed_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    UNIQUE (book_id, guardian, dimension)
);

CREATE INDEX IF NOT EXISTS idx_guardian_reviews_book ON public.guardian_reviews(book_id);

COMMENT ON TABLE public.guardian_reviews IS 'LLM-based editorial ratings: 5 Guardians score 5 dimensions';

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_covers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_reviews ENABLE ROW LEVEL SECURITY;

-- BOOKS: public read, authors write their own
CREATE POLICY "Books are publicly readable"
    ON public.books FOR SELECT
    USING (status IN ('in-progress', 'complete'));

CREATE POLICY "Authors can insert their own books"
    ON public.books FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.book_authors
            WHERE book_id = books.id AND role IN ('creator', 'co_author', 'co_creator')
        )
        OR auth.uid() IS NOT NULL -- any authenticated user can create a draft
    );

CREATE POLICY "Authors can update their own books"
    ON public.books FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.book_authors
            WHERE book_id = books.id AND role IN ('creator', 'co_author', 'co_creator', 'editor')
        )
    );

-- BOOK AUTHORS: public read, authors manage their own
CREATE POLICY "Book authors are publicly readable"
    ON public.book_authors FOR SELECT
    USING (TRUE);

CREATE POLICY "Authors can add co-authors to their books"
    ON public.book_authors FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.book_authors
            WHERE book_id = book_authors.book_id AND role = 'creator'
        )
    );

-- BOOK COVERS: public read for active, authors write their own
CREATE POLICY "Active book covers are publicly readable"
    ON public.book_covers FOR SELECT
    USING (status = 'active' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authors can upload covers for their books"
    ON public.book_covers FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.book_authors
            WHERE book_id = book_covers.book_id
        )
    );

CREATE POLICY "Authors can update their book covers"
    ON public.book_covers FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.book_authors
            WHERE book_id = book_covers.book_id
        )
    );

-- BOOK CHAPTERS: public read published, authors write
CREATE POLICY "Published chapters are publicly readable"
    ON public.book_chapters FOR SELECT
    USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authors can manage chapters"
    ON public.book_chapters FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.book_authors
            WHERE book_id = book_chapters.book_id
        )
    );

-- BOOK RATINGS: public read, users rate books they're not authors of
CREATE POLICY "Non-hidden ratings are publicly readable"
    ON public.book_ratings FOR SELECT
    USING (is_hidden = FALSE);

CREATE POLICY "Users can rate books (not their own)"
    ON public.book_ratings FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND auth.uid() NOT IN (
            SELECT user_id FROM public.book_authors
            WHERE book_id = book_ratings.book_id
        )
    );

CREATE POLICY "Users can update their own ratings"
    ON public.book_ratings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
    ON public.book_ratings FOR DELETE
    USING (auth.uid() = user_id);

-- GUARDIAN REVIEWS: public read, service role writes
CREATE POLICY "Guardian reviews are publicly readable"
    ON public.guardian_reviews FOR SELECT
    USING (TRUE);

-- (Guardian reviews written via service role from server, no INSERT policy for authenticated users)

-- =====================================================================
-- STORAGE BUCKET: book-covers
-- =====================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'book-covers',
    'book-covers',
    TRUE, -- public read
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Book covers are publicly viewable"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'book-covers');

CREATE POLICY "Authors can upload covers for their books"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'book-covers'
        AND auth.uid() IS NOT NULL
        -- Path must be {book-slug}/v{n}.{ext}
        AND (storage.foldername(name))[1] IN (
            SELECT slug FROM public.books
            WHERE id IN (
                SELECT book_id FROM public.book_authors
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Authors can update their book covers"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'book-covers'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] IN (
            SELECT slug FROM public.books
            WHERE id IN (
                SELECT book_id FROM public.book_authors
                WHERE user_id = auth.uid()
            )
        )
    );

-- =====================================================================
-- HELPER FUNCTIONS
-- =====================================================================

-- Promote a cover version to active (deactivates others)
CREATE OR REPLACE FUNCTION public.set_active_cover(
    p_book_id UUID,
    p_cover_id UUID
)
RETURNS VOID AS $$
BEGIN
    -- Archive all current active covers for this book
    UPDATE public.book_covers
    SET status = 'archived'
    WHERE book_id = p_book_id AND status = 'active';

    -- Activate the new one
    UPDATE public.book_covers
    SET status = 'active'
    WHERE id = p_cover_id AND book_id = p_book_id;

    -- Update book's cover_id reference
    UPDATE public.books
    SET cover_id = p_cover_id, updated_at = now()
    WHERE id = p_book_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update book stats from ratings
CREATE OR REPLACE FUNCTION public.update_book_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.books
    SET
        star_average = (
            SELECT AVG(stars)::NUMERIC(3,2)
            FROM public.book_ratings
            WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
            AND is_hidden = FALSE
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM public.book_ratings
            WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
            AND is_hidden = FALSE
        )
    WHERE id = COALESCE(NEW.book_id, OLD.book_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_book_ratings_update_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.book_ratings
    FOR EACH ROW EXECUTE FUNCTION public.update_book_rating_stats();

-- Update Guardian composite score
CREATE OR REPLACE FUNCTION public.update_guardian_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.books
    SET guardian_score = (
        SELECT AVG(score)::NUMERIC(3,1)
        FROM public.guardian_reviews
        WHERE book_id = NEW.book_id
    )
    WHERE id = NEW.book_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_guardian_reviews_update_score
    AFTER INSERT OR UPDATE ON public.guardian_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_guardian_score();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_books_touch BEFORE UPDATE ON public.books
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_book_chapters_touch BEFORE UPDATE ON public.book_chapters
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_book_ratings_touch BEFORE UPDATE ON public.book_ratings
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================================
-- BACKFILL: Register existing books (Frank's 3 git-tier books)
-- =====================================================================

-- Forge of Ruin
INSERT INTO public.books (slug, title, subtitle, tier, status, genre, tags, license, ai_metadata, acknowledgments)
VALUES (
    'forge-of-ruin',
    'The Forge of Ruin',
    'A Dark Epic Fantasy',
    'featured',
    'in-progress',
    'dark-fantasy',
    ARRAY['dark-fantasy', 'berserker', 'norse', 'grimdark'],
    'CC-BY-NC-SA-4.0',
    '{"models_used":[{"id":"claude-opus-4-6","provider":"anthropic","role":"story-architecture-and-drafting"}],"human_contribution":30,"ai_contribution":70,"method":"Human direction + AI prose, human curation"}'::jsonb,
    'Story conceived by FrankX and Logan. Prose drafted with Claude Opus 4.6, curated by humans.'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.book_authors (book_id, author_name, author_github, role, order_index)
SELECT id, 'FrankX', 'frankxai', 'creator', 0 FROM public.books WHERE slug = 'forge-of-ruin'
ON CONFLICT DO NOTHING;

INSERT INTO public.book_authors (book_id, author_name, role, order_index)
SELECT id, 'Logan', 'co_author', 1 FROM public.books WHERE slug = 'forge-of-ruin'
ON CONFLICT DO NOTHING;

-- Tides of Silence
INSERT INTO public.books (slug, title, subtitle, tier, status, genre, tags, license, ai_metadata, acknowledgments)
VALUES (
    'tides-of-silence',
    'The Tides of Silence',
    'A Literary Water Fantasy',
    'featured',
    'in-progress',
    'literary-fantasy',
    ARRAY['literary-fantasy', 'water-magic', 'ocean', 'le-guin', 'ghibli'],
    'CC-BY-NC-SA-4.0',
    '{"models_used":[{"id":"claude-opus-4-6","provider":"anthropic","role":"story-architecture-and-drafting"}],"human_contribution":30,"ai_contribution":70,"method":"Human direction + AI prose, human curation"}'::jsonb,
    'World concept co-created by FrankX and Mina Aranicki. Prose drafted with Claude Opus 4.6.'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.book_authors (book_id, author_name, author_github, role, order_index)
SELECT id, 'FrankX', 'frankxai', 'creator', 0 FROM public.books WHERE slug = 'tides-of-silence'
ON CONFLICT DO NOTHING;

INSERT INTO public.book_authors (book_id, author_name, role, order_index)
SELECT id, 'Mina Aranicki', 'co_creator', 1 FROM public.books WHERE slug = 'tides-of-silence'
ON CONFLICT DO NOTHING;

-- Heart of Pyrathis
INSERT INTO public.books (slug, title, subtitle, tier, status, genre, tags, license, ai_metadata, acknowledgments)
VALUES (
    'heart-of-pyrathis',
    'The Heart of Pyrathis',
    'Alien Dragons on a Volcano Planet',
    'community',
    'in-progress',
    'epic-fantasy',
    ARRAY['epic-fantasy', 'dragons', 'sci-fi', 'volcano', 'shapeshifters', 'lightsabers'],
    'CC-BY-NC-SA-4.0',
    '{"models_used":[{"id":"claude-opus-4-6","provider":"anthropic","role":"story-architecture-and-drafting"}],"human_contribution":25,"ai_contribution":75,"method":"Human concept mashup, AI architecture and drafting"}'::jsonb,
    'Genre mashup written with Claude Opus 4.6. A cursed wolf, a tiny sage, a fallen star-wanderer, and a scared little dragon walk into a volcano.'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.book_authors (book_id, author_name, author_github, role, order_index)
SELECT id, 'FrankX', 'frankxai', 'creator', 0 FROM public.books WHERE slug = 'heart-of-pyrathis'
ON CONFLICT DO NOTHING;

-- Backfill covers (git-tier for existing books)
INSERT INTO public.book_covers (book_id, version, status, storage_tier, storage_path, public_url, model_id, model_tier)
SELECT id, 2, 'active', 'git', '/images/books/forge-of-ruin-cover-nb2.png', '/images/books/forge-of-ruin-cover-nb2.png', 'gemini-2.5-flash-image', 'nb'
FROM public.books WHERE slug = 'forge-of-ruin'
ON CONFLICT DO NOTHING;

INSERT INTO public.book_covers (book_id, version, status, storage_tier, storage_path, public_url, model_id, model_tier)
SELECT id, 2, 'active', 'git', '/images/books/tides-of-silence-cover-v2.png', '/images/books/tides-of-silence-cover-v2.png', 'gemini-3.1-flash-image-preview', 'nb2'
FROM public.books WHERE slug = 'tides-of-silence'
ON CONFLICT DO NOTHING;

INSERT INTO public.book_covers (book_id, version, status, storage_tier, storage_path, public_url, model_id, model_tier)
SELECT id, 2, 'active', 'git', '/images/books/heart-of-pyrathis-cover-v2.png', '/images/books/heart-of-pyrathis-cover-v2.png', 'gemini-3.1-flash-image-preview', 'nb2'
FROM public.books WHERE slug = 'heart-of-pyrathis'
ON CONFLICT DO NOTHING;

-- Link active covers back to books.cover_id
UPDATE public.books b
SET cover_id = bc.id
FROM public.book_covers bc
WHERE bc.book_id = b.id AND bc.status = 'active';

-- =====================================================================
-- END MIGRATION
-- =====================================================================
