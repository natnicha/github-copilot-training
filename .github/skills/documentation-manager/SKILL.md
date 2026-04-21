---
name: documentation-manager
description: 'Automated document creation and indexing. Use when saving meeting notes, research findings, or technical specs so files follow document/date/001_topic.md naming and each date folder keeps an up-to-date index.'
---

# Documentation Manager

Use this skill when creating markdown documents that must be filed into dated folders and tracked in a folder-level index.

## When to Use This Skill
- Creating meeting notes, design docs, research notes, or technical specs
- Saving markdown documents into a date-based archive
- Maintaining an index file for each date folder
- Enforcing consistent file naming and summary tracking

## Rules
- Save each document under `document/{YYYY-MM-DD}/{running_number}_{topic}.md`.
- Use the current date for `{YYYY-MM-DD}`.
- Derive `{topic}` from the document title as a lowercase, URL-friendly slug.
- Use a 3-digit zero-padded `{running_number}` based on the existing files in that date folder.
- Include YAML frontmatter in every document with `title`, `date`, and `tags`.
- Keep or create `index.md` in the same date folder.
- Update `index.md` whenever a new document is created.
- The index entry must include the file link, timestamp, and a short summary.

## Workflow
1. Determine the target title and derive a slug from it.
2. Read the current date and find the target folder under `document/`.
3. Scan existing markdown files in that folder to determine the next running number.
4. Create the new document with frontmatter and the requested content.
5. Update or create the folder's `index.md` with a new row or bullet entry for the document.
6. Keep summaries short and specific.

## Document Template

```markdown
---
title: Example Title
date: 2026-04-21
tags:
  - meeting-notes
  - roadmap
---

Document content goes here.
```

## Index Template

```markdown
# Index - 2026-04-21

- Document file: `001_example-title.md` — 2026-04-21 10:30 — Short summary.
```

## Troubleshooting
- If the folder already contains files, increment from the highest existing number.
- If the title is empty, ask for a title before creating the file.
- If the slug would be empty, fall back to `untitled`.
- If `index.md` exists, append the new entry without removing older ones.

## References
- Use this skill alongside repo docs when generating structured markdown archives.
