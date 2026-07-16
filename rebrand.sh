#!/usr/bin/env bash
# rebrand.sh — swap "Agent Zero" -> "OpeyemiAgent" across an AgentZero fork.
# Run from the fork root AFTER forking. MIT: keep the original LICENSE untouched.
set -euo pipefail

OLD="Agent Zero"
NEW="OpeyemiAgent"
OLD_LOWER="agent zero"
NEW_LOWER="opeyemiagent"

echo "Rebranding '$OLD' -> '$NEW' ..."

# 1) Find every occurrence first (dry report)
echo "== Occurrences before =="
grep -rIl "$OLD" . --exclude-dir=.git --exclude=LICENSE --exclude-dir=venv --exclude-dir=node_modules || true

# 2) Replace in tracked text files (skip LICENSE, deps, git)
find . -type f \
  -not -path './.git/*' \
  -not -path './venv/*' \
  -not -path './node_modules/*' \
  -not -name 'LICENSE' \
  \( -name '*.md' -o -name '*.py' -o -name '*.txt' -o -name '*.yaml' -o -name '*.yml' -o -name '*.json' -o -name '*.html' -o -name '*.js' -o -name '*.css' \) \
  -print0 | while IFS= read -r -d '' f; do
    # case-sensitive "Agent Zero" -> "OpeyemiAgent"
    sed -i "s/$OLD/$NEW/g" "$f"
    # lowercase "agent zero" -> "opeyemiagent" (e.g. package/var names)
    sed -i "s/$OLD_LOWER/$NEW_LOWER/g" "$f"
  done

# 3) Rename directories/files containing "agent_zero" or "agent-zero"
find . -type d -name '*agent*zero*' -not -path './.git/*' | while read -r d; do
  mv "$d" "$(echo "$d" | sed -E 's/agent[-_]zero/opeyemiagent/gI')"
done
find . -type f -name '*agent*zero*' -not -path './.git/*' | while read -r f; do
  mv "$f" "$(echo "$f" | sed -E 's/agent[-_]zero/opeyemiagent/gI')"
done

echo "== Occurrences after (should be none in tracked files) =="
grep -rIl "$OLD" . --exclude-dir=.git --exclude=LICENSE || echo "None. Rebrand complete."

echo "REMINDER: keep the original LICENSE file (MIT notice) and add the"
echo " 'Based on Agent Zero (MIT)' attribution to your README."
