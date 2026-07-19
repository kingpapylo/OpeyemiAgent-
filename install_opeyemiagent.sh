#!/usr/bin/env bash
set -euo pipefail

DEFAULT_REPO_URL="https://github.com/kingpapylo/OpeyemiAgent-.git"
REPO_URL="${REPO_URL:-$DEFAULT_REPO_URL}"
TARGET_DIR="${1:-OpeyemiAgent-}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to install OpeyemiAgent." >&2
  exit 1
fi

if [ -e "$TARGET_DIR/.git" ]; then
  echo "Updating existing clone in $TARGET_DIR"
  cd "$TARGET_DIR"
  git pull --rebase || true
elif [ -e "$TARGET_DIR" ]; then
  echo "Target path exists but is not a git repo: $TARGET_DIR" >&2
  exit 1
else
  git clone "$REPO_URL" "$TARGET_DIR"
  cd "$TARGET_DIR"
fi

if [ -f rebrand.sh ]; then
  bash ./rebrand.sh || true
fi

echo "OpeyemiAgent installed in $(pwd)"
echo "Next: review README.md and run the quick start steps for your environment."
