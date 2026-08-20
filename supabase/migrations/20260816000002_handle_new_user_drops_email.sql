-- handle_new_user() has always inserted into public.profiles (id, username,
-- display_name, email), but profiles has no email column -- not in
-- 20250101000001 and nothing adds one. plpgsql resolves column names at call
-- time rather than definition time, so every migration run passed while every
-- signup rolled back:
--
--     ERROR: column "email" of relation "profiles" does not exist
--
-- The column is not the fix. auth.users.email already holds the address, and
-- profiles is world-readable -- 20250101000002 grants SELECT on the whole table
-- to anon and authenticated (line 315) under a policy that matches every active
-- row (line 30). Adding an email column there would publish every user's email
-- to anyone holding the anon key. So the trigger drops the column instead.
--
-- display_name loses its NEW.email fallback for the same reason. The old
-- COALESCE(full_name, NEW.email) only looks self-chosen: when signup metadata
-- carries no full_name -- the ordinary email/password case -- it wrote the
-- account address into a column every anon caller can read. That is the same
-- PII in the same place, just under a different column name. It now falls back
-- to the generated username instead, which carries no account data.
--
-- CREATE OR REPLACE so existing databases are corrected too, not just fresh ones.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    resolved_username TEXT;
BEGIN
    resolved_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        'user_' || substr(NEW.id::TEXT, 1, 8)
    );

    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        resolved_username,
        COALESCE(NEW.raw_user_meta_data->>'full_name', resolved_username)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
