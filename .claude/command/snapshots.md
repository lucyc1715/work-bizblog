---
description: Summarize current changes and next TODOs, save to .claude/snapshots/
---
Create a development snapshot summarizing the current state of changes and next steps.

## Instructions

1. Run `git status` and `git diff --stat` to understand current changes.
2. Run `git log --oneline -5` to see recent commits for context.
3. Summarize the following in **Traditional Chinese (zh-TW)**:
   - **Branch**: current branch name
   - **Changed files summary**: group modified/added/deleted files by area (e.g. components, pages, styles, etc.) with brief descriptions of what changed
   - **Key changes**: bullet points of the most important changes
   - **Next TODOs**: items that still need to be done, based on uncommitted work, TODO comments, or obvious incomplete patterns
4. Save the snapshot to `.claude/snapshots/<timestamp>.md` where `<timestamp>` is in the format `YYYYMMDD_HHMMSS`..
5. After saving, tell me the file path and print the full snapshot content.

## Snapshot file format

```markdown
# Snapshot <timestamp>

**Branch:** `<branch>`
**Date:** <human readable date>

## Changes Summary

<grouped file changes>

## Key Changes

<bullet points>

## Next TODOs

<bullet points of pending work>
```
