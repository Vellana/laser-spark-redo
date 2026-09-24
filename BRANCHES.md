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
