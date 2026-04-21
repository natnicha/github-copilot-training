<!--
generate me a concise prompt in natural language for create a skill `documentation-manager`. It must save docs as document/{date}/{running_number}_{topic}.md and auto-update an index file within each date folder for tracking.

# the result must be a prompt for create a new skill
# show me the result in text code block.
-->

Create a new skill named `documentation-manager` that automates the creation and indexing of markdown documents. 

### Core Requirements:
1.  **Storage Pattern**: Documents must be saved using the path structure: `document/{YYYY-MM-DD}/{running_number}_{topic}.md`.
2.  **Naming Convention**: 
    - `{date}`: Current date in `YYYY-MM-DD` format.
    - `{running_number}`: A 3-digit padded number (e.g., `001`, `002`) that increments based on existing files in the specific date folder.
    - `{topic}`: A URL-friendly, lowercase string derived from the document title.
3.  **Automatic Indexing**: 
    - Maintain an `index.md` file within each `{date}` folder.
    - Every time a new document is created, auto-update this index with a table or list containing the file link, timestamp, and a brief summary.
4.  **Frontmatter**: Ensure every generated document includes standard YAML frontmatter (title, date, tags).

### Skill Definition:
- **Name**: `documentation-manager`
- **Description**: "Automated system for organized document creation and indexing. Use when saving meeting notes, research findings, or technical specs to ensure consistent pathing (`document/date/001_topic.md`) and automatic folder-level index updates."