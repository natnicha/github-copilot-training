<!--
Generate a concise natural-language prompt for creating a new skill named `documentation-manager`.
The skill must save documents as `document/{date}/{running_number}_{topic}.md`, where `{date}` uses `YYYY-MM-DD`, `{running_number}` is a 3-digit increment within the date folder, and `{topic}` is a lowercase URL-friendly slug.
It must also automatically update an `index.md` file inside each date folder to track the document link, timestamp, and a short summary.
Return only the prompt itself in a text code block.
-->

Create a new skill named `documentation-manager` that creates and organizes markdown documents with consistent file naming and folder-level indexing. Save each document under `document/{YYYY-MM-DD}/{running_number}_{topic}.md`, using a 3-digit running number that increments from existing files in the same date folder and a lowercase URL-friendly topic slug. Automatically update an `index.md` file in that date folder every time a document is created, including the document link, timestamp, and a brief summary. Include standard YAML frontmatter in every document, such as title, date, and tags. Return the final result as a text code block only.
