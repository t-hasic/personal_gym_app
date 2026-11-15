# Personal gym app — implementation plan

## Goal

A small, private lift tracker for one person: open it on an iPhone 11, record sets quickly, and see progress over time. Use a mobile website with an optional Home Screen shortcut; no App Store release is needed.

## First version

- **Log:** choose a lift, default to today's date, enter weight and reps, and save. Add more sets with the previous values prefilled; show the last session for reference. Allow backdated entries, editing, and deletion with confirmation.
- **History:** browse sessions by date and filter by lift.
- **Progress:** select a lift and view a line chart of the heaviest set per session and a bar chart of session volume (sum of weight × reps). Offer 30-day, 90-day, and all-time views, readable axis labels, tap-to-view values, and an accessible data list. Show best weight with its rep count so changes in reps have context.
- **Personalization:** editable lift names and favorites; start with a small suggested list. Default to pounds, configurable before logging; store units explicitly and normalize chart values when converting.
- **Backup:** export all records as JSON and sets as CSV. Document how to restore JSON into a fresh database; verify a round trip before launch.

Defer routines, coaching, nutrition, social features, wearables, and automatic offline synchronization.

## Recommended implementation

Use **React + TypeScript + Vite**, simple CSS, and **Chart.js**. Build static files for **GitHub Pages** and access **Supabase Auth + Postgres** directly from the browser. This avoids maintaining an application server.

GitHub Pages supports static hosting on public repositories with GitHub Free; source code will be public, while workout records stay in the database. Use the included `github.io` address. See [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Supabase's free plan currently includes a 500 MB database, ample for a personal set log, but low activity over a week can cause a pause. Resume it from the dashboard if needed; show a useful connection error and retain unsaved input. Target $0/month within free allowances, with no paid add-ons. Free terms can change. See [pricing](https://supabase.com/pricing) and [pausing policy](https://supabase.com/docs/guides/platform/free-project-pausing).

## Data and privacy

- `exercises`: ID, owner ID, name, favorite flag, archived flag.
- `sessions`: ID, owner ID, workout date (local calendar date), created timestamp.
- `sets`: client-generated UUID, owner ID, session ID, exercise ID, order, weight, unit, reps, optional note, timestamps.

Require positive integer reps and nonnegative weight. Keep referenced exercises archived rather than deleting their history. Use client-generated set IDs to make a save retry safe against duplicates.

Create the owner's email/password account once and disable public signup. Persist login on the phone. Enable [row level security](https://supabase.com/docs/guides/database/postgres/row-level-security) on every table for every operation: authenticated user ID must match both the row owner and the configured owner account; validate ownership of referenced records. Ship only the project URL and publishable key in the frontend. Keep service-role keys, passwords, and workout exports out of Git.

## Delivery steps

1. **Foundation:** scaffold the app, add database migrations and access policies, configure the owner account, and build the phone layout.
2. **Logging:** implement saves, history, edits, validation, and a local unsaved draft. Mark saved only after database confirmation; preserve drafts after connection failures and offer retry. An internet connection is required for database operations in v1.
3. **Progress:** add charts, date filters, favorites, and backup export/restore instructions.
4. **Deploy:** create the free Supabase project and apply migrations; configure the public project URL/key as GitHub Actions variables; enable Pages with GitHub Actions. Set Vite's base to the repository path and use hash navigation so reloads work. CI runs checks and deploys `dist` on pushes to `main`, following the [Vite Pages guide](https://vite.dev/guide/static-deploy.html#github-pages). Document setup in a short README; later releases require only a push.

## Ready-to-use checks

On the actual iPhone 11 in Safari over cellular: sign in, log a set within a few taps, reload and verify persistence, edit/delete an entry, and inspect charts without horizontal scrolling. Use large touch targets and numeric keyboards. Keep assets small, avoid external fonts, and fetch records only when needed. Verify the Home Screen shortcut, expired-login handling, and draft recovery after a failed save. Test chart calculations and unit conversion, duplicate-save retries, backup restoration, and denial of database access for signed-out users and a second account.
