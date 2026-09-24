# Branches

`main` is the source of truth. Edit here, commit here.

`lovable-sync` exists because of a GitHub reconnect on 2026-09-21, and **Lovable builds from it**.
It must always mirror `main`, or the live site silently serves whatever `lovable-sync` last had:

    git push origin origin/main:refs/heads/lovable-sync

Why this matters more than it looks. When the two diverge, every signal still says success - the
push lands on `main`, Lovable's API reports your commit as `latest_commit_sha`, and Publish returns
success - while the live site never changes, not even its `x-deployment-id`, because the build input
never changed. It reads as "publish is broken" when it is really "publish is building something
else".

Check before assuming a publish failed:

    git merge-base --is-ancestor <fix-commit> origin/lovable-sync && echo YES || echo NO

It cost six days in September 2026: a page title fix from the 18th and an address correction from
the 23rd both sat unpublished, so the live CoolPeel page advertised the wrong suite number while the
same page's structured data carried the right one.

`_agent-publish` is historical and is 50+ commits behind. Do not build from it.
