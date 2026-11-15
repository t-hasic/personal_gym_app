# Lift

A small mobile gym log with set history, progress charts, and JSON/CSV backups.

## Try locally

Requires Node 22 and npm. Run `npm ci`, then `npm run dev`. Without Supabase configuration it runs in local demo mode; records are saved only in this browser. Clearing browser storage removes demo data. Export a backup regularly.

## Connect private cloud storage

1. Create a free Supabase project. In Authentication → Users create your email/password user (confirm it in the dashboard). Disable new user signups in authentication settings. Keep your password private.
2. Run `supabase/schema.sql` once in the SQL editor. Then open `supabase/set-owner.sql`, replace `REPLACE-WITH-YOUR-EMAIL` with your login email, and run it in the SQL editor. This finds the UUID for you. Only that account can access records, even if another account exists.
3. Copy `.env.example` to `.env.local`. Set the project URL and **publishable** key from the Supabase project settings. Never use the service-role/secret key. Restart the dev server.
4. Sign in. Demo records are separate; export demo JSON before configuring Supabase, then restore it after signing in if desired.

## Deploy to GitHub Pages

Use a public GitHub repository for free Pages hosting. Add repository Actions variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. In Settings → Pages choose GitHub Actions. Push to `main`; the included workflow tests, builds, and deploys automatically. Open the deployment URL in Safari; Share → Add to Home Screen gives quick access. For a repository named `<username>.github.io`, change workflow `BASE_PATH` to `/`.

Cloud login and saves require internet. Failed saves retain a draft locally; retry uses the same set ID to prevent duplicates. Supabase Free can pause after inactivity; resume it in the dashboard. A new browser starts with the default lift list; recorded lift names are recovered from cloud history. Sign out on shared devices; unsaved drafts remain in this browser.

## Checks and backups

`npm test` checks mixed-unit chart aggregation; `npm run build` checks TypeScript and produces static output. Before launch, test on the actual iPhone over cellular: sign in, save/reload/edit/delete, retry a failed save, inspect chart tooltips and data lists, and restore an exported JSON backup. Verify a signed-out client and a second authenticated account cannot read or write sets.

Settings exports JSON for restoration and CSV for spreadsheets. Restore JSON through Settings in a fresh configured app; matching set UUIDs update existing sets. Verify counts and chart totals after restoring. Exported files contain private workout data and should stay out of Git.

Implementation uses a single sets table, grouping sessions by local workout date. Lift names and order are local preferences; rename a lift by editing its entries. Favorites sort lifts first and are stored on this device. Archived exercise management and a separate session/exercise model from the initial plan are deferred. No offline synchronization or service worker is included.
