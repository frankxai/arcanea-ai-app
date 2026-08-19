-- Add profiles.email.
--
-- 20250101000004_utility_functions.sql defines handle_new_user(), attached to
-- auth.users as an AFTER INSERT trigger, and that function inserts into
-- public.profiles (id, username, display_name, email). No migration ever created an
-- email column on profiles — 20250101000001_initial_schema.sql defines the table
-- without one, and nothing adds it later.
--
-- plpgsql does not resolve table columns when a function is defined, only when it
-- runs, so this never broke a migration. It broke signup: every INSERT into
-- auth.users fired the trigger, the trigger raised
-- `column "email" of relation "profiles" does not exist`, and because the trigger
-- runs inside the signup transaction, the whole registration was rolled back. On any
-- database built from this repo's migrations, no user could be created at all.
--
-- Ordered 000003a so the column exists before the trigger in 000004 can ever fire.
-- ADD COLUMN IF NOT EXISTS, so it is a no-op against a database that already has it.
-- Type matches auth.users.email, which is what handle_new_user() copies in; the
-- column is nullable because auth.users.email is nullable for phone/OAuth-only
-- identities, and a profile should still be created for those users.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;
