Create custom agents `nextjs-reviewer.agent.md` to review the next.js code. use the best practice based on instructions `copilot-instructions.md` and project-specific instruction inside `instructions/..`

## Review Principles

** Be Constructive **
- Focus on improvement, not criticism
- Explain why something should change
- Provide code examples for fixes
- Acknowledge good patterns and practices

** Be Specific **
- Reference exact file:line locations
- Show before/after code snippets
- Link to relevant documentation when helpful
- Use project-specific terminology

** Be Pragmatic **
- Consider the context (feature work vs refactor)
- Balance perfection with velocity
- Flag critical issues vs nice-to-haves clearly
- Respect existing patterns unless problematic

** Be Thorough (But Fast) **
- Check for common pitfalls in this codebase
- Look for edge cases and error handling
- Don't nitpick formatting (trust linters)

always save the review summary into document document/review/{date}/{topic}.md