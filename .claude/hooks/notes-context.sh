#!/usr/bin/env bash
# SessionStart hook: put this project's notes INDEX into Claude's context.
# Usage (from .claude/settings.json): bash .claude/hooks/notes-context.sh <project-slug>
# Looks for the private notes repo (patriciosebastian/notes) next to this repo,
# linked in as .notes/, or in ~/notes. Prints nothing scary if it isn't there.

slug="${1:-}"
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
[ -n "$slug" ] || exit 0

for dir in "$root/.notes" "$root/../notes" "$(dirname "$root")/notes" "$HOME/notes"; do
  if [ -f "$dir/projects/$slug/INDEX.md" ]; then
    notes_dir="$(cd "$dir" && pwd -P)"
    break
  fi
done

# Cloud sessions may clone attached repos elsewhere; do one shallow search.
if [ -z "${notes_dir:-}" ]; then
  hit=$(find "$(dirname "$root")" "$HOME" -maxdepth 5 -type f -path "*/projects/$slug/INDEX.md" 2>/dev/null | head -n 1)
  [ -n "$hit" ] && notes_dir="$(cd "$(dirname "$hit")/../.." && pwd)"
fi

if [ -n "${notes_dir:-}" ]; then
  echo "Project notes for '$slug' are in the notes repo at: $notes_dir"
  echo "Registry: $notes_dir/projects.yaml. Agent rules and playbooks: $notes_dir/agents/. Notes edits go to its agent-notes branch."
  echo
  cat "$notes_dir/projects/$slug/INDEX.md"
else
  echo "Project notes for '$slug' live in the private repo patriciosebastian/notes (projects/$slug/), which isn't checked out in this session. Ask Patricio to attach it if the task needs specs, plans or past incidents."
fi
exit 0
