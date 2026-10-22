# Claude Code project guidance

## Claude Code usage efficiency

- Preserve correctness, security, project-specific instructions, and required validation above token savings.
- Locate relevant code with targeted search; read only necessary files and ranges. Avoid repeated repository-wide scans.
- Make small, targeted edits rather than rewriting complete files for minor changes.
- Avoid redundant searches, repeat tests without changes, unnecessary background tasks, and excessive tool output. Batch independent operations where useful.
- Use a concise response: changes, verification, and next action. Keep a brief handoff at the end of substantial tasks.
- Warn before unusually expensive work or spawning multiple agents; request approval before costly API calls or installing routers/hooks.
- Model guidance: use Sonnet for routine coding, Opus for complex architecture or difficult debugging, and Haiku subagents only for clearly bounded mechanical work when supported. Do not claim this file automatically switches the main session model.
- Do not automatically change model, effort, subscription settings, API credentials, trading execution, or production configuration.
