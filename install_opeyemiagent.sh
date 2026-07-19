#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-}"
TARGET_DIR="${1:-OpeyemiAgent}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to install OpeyemiAgent." >&2
  exit 1
fi

if [ -z "$REPO_URL" ]; then
  SCRIPT_URL="${SCRIPT_URL:-${BASH_SOURCE[0]}}"
  case "$SCRIPT_URL" in
    https://raw.githubusercontent.com/*)
      REPO_URL="${SCRIPT_URL#https://raw.githubusercontent.com/}"
      REPO_URL="https://github.com/${REPO_URL%%/*}/${REPO_URL#*/}"
      REPO_URL="${REPO_URL%/*}"
      REPO_URL="${REPO_URL%.git}.git"
      ;;
    *)
      REPO_URL="https://github.com/kingpapylo/OpeyemiAgent-.git"
      ;;
  esac
fi

if [ -e "$TARGET_DIR" ]; then
  echo "Target directory already exists: $TARGET_DIR" >&2
  exit 1
fi

git clone "$REPO_URL" "$TARGET_DIR"
cd "$TARGET_DIR"

if [ -f rebrand.sh ]; then
  bash ./rebrand.sh || true
fi

echo "OpeyemiAgent installed in $(pwd)"
echo "Next: review README.md and run the quick start steps for your environment."
