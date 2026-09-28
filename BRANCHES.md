# Branches

`main` is the source of truth. Edit here, commit here.

## What Lovable actually does (re-measured 2026-09-24, 21:12 to 21:25 UTC)

**Lovable writes to `main`, not `lovable-sync`.** Its own edits prove it: the two changes made in
the Lovable editor on 2026-09-24 (Lovable-internal commits 86b64a9 and 8d211dc) arrived on GitHub
`main` as 25b39ce "Work in progress" and 7edbd4f "Changes". `lovable-sync` did not move. The
earlier note here, "Lovable builds from lovable-sync", was wrong.

**But GitHub -> Lovable is halted.** Lovable's own history (`list_edits`, `read_file`) has taken
nothing from GitHub since d1a50e2 (2026-09-21). Not e0723bd (Sep 23), not 29a50a7 (the first
version of this file, which sat on BOTH branches for hours), and not 5e6fc94 or 7615741 (pushed to
`main` at 21:12 UTC and to `lovable-sync` at 21:17 UTC, both still absent at 21:25). So right
now:

- a git push reaches GitHub and never reaches the site;
- `deploy_project` or Publish rebuilds Lovable's own copy, so the live site does not change;
- `get_project.latest_commit_sha` shows Lovable's own head (8d211dc), not GitHub's.

**The fix is the divergence prompt in the Lovable project, Settings > Git > GitHub.** That is
Julien's click, not the bot's. Keep GitHub's side: Lovable's three unsynced commits are already on
`main` with identical content (86b64a9 = 25b39ce, 1c72d72 = e0723bd, 8d211dc = 7edbd4f; compared
diff by diff on 2026-09-24). Keeping Lovable's side would throw away everything on `main` after
d1a50e2, including the Sep 24 SEO commits.

## Before calling any push live

1. `list_edits` for Lovable project 608084ad must show a `developer_update` carrying your commit
   sha, or `read_file` at Lovable's head must return your change. `latest_commit_sha` alone
   proves nothing.
2. Only then run `deploy_project` (or Publish).
3. Byte-check the live site for a string that only your commit contains, with a cache-busting
   query and `curl --compressed`.

## lovable-sync

Created by the GitHub reconnect on 2026-09-21. Keep it a fast-forward mirror of `main`, in case a
future reconnect points at it. Never force it:

    git merge-base --is-ancestor origin/lovable-sync origin/main && git push origin origin/main:refs/heads/lovable-sync

`_agent-publish` is historical and is 50+ commits behind. Do not build from it.

## 2026-09-27/28: the divergence, measured again

- Lovable Settings > Git > GitHub reads "Lovable and GitHub have diverged: 6 commits in Lovable,
  8 commits on GitHub". Lovable's side since d1a50e2 is only its three Sep 24 edits, and every
  change in them is already on `main` (WebSite JSON-LD, previewAuthStorage.ts, client.ts, types.ts
  14.5, the CoolPeel Tysons NAP fix): checked file by file on 2026-09-28. GitHub's side has the
  8 commits e0723bd..8d10df0 (Sep 24 SEO, prerender v5, the GBP phone fix).
- Lovable's docs: when diverged, "the next sync from GitHub replaces Lovable's version of the
  branch with the GitHub version". Disconnect + Connect (done 2026-09-28 ~00:30 UTC) re-linked
  this same repo instead of creating a new one, and the divergence stayed.
- The test push (9d3ec6b) did NOT arrive: Lovable showed "GitHub is 1 commit ahead" and never
  pulled it. Lovable's GitHub App is not installed on this repo (Vellana's account), so GitHub never
  notifies Lovable of a push. Lovable -> GitHub still works (its commits land on `main`).

## How a GitHub commit reaches Lovable now (WORKS, 2026-09-28)

Switching the synced branch makes Lovable pull that branch from GitHub on the spot, and it
resolved the divergence too (Lovable's own commits were already on `main` in content).

1. Push to `main`, then fast-forward `lovable-sync` to it:
   `git merge-base --is-ancestor origin/lovable-sync origin/main && git push origin origin/main:refs/heads/lovable-sync`
2. Lovable > project 608084ad > Settings > Git > GitHub > Branch: pick `lovable-sync`. Wait for
   "In sync with GitHub". Then pick `main` again. Wait for "In sync with GitHub".
3. Check `read_file` at your sha, then `deploy_project`, then byte-check live.
4. Edge functions still need their own deploy: ask the Lovable agent to deploy the named
   functions only ("do not modify any file, do not invoke them"), then probe the `v` marker each
   one returns on its first rejection (no auth / empty body; nothing is sent).

The switch works only in a visible tab (the Branch menu does not open in a hidden one). The
permanent fix is outside our reach: Vellana installs the Lovable GitHub App on this repo, or
transfers the repo to temsagpt-creator.
