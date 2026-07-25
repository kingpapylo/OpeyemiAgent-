#!/usr/bin/env bash
set -euo pipefail

DEFAULT_REPO_URL="https://github.com/kingpapylo/OpeyemiAgent-.git"
REPO_URL="${REPO_URL:-$DEFAULT_REPO_URL}"
TARGET_DIR="${1:-OpeyemiAgent-}"
REPO_WEB_URL="${REPO_WEB_URL:-https://github.com/kingpapylo/OpeyemiAgent-}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to install OpeyemiAgent." >&2
  exit 1
fi

if [ -n "${INSTALL_BRANCH:-}" ]; then
  BRANCH="$INSTALL_BRANCH"
elif command -v curl >/dev/null 2>&1; then
  BRANCH="$(curl -fsSL "${REPO_WEB_URL}.git/HEAD" 2>/dev/null | sed 's#ref: refs/heads/##' | tr -d '\r' || true)"
  if [ -z "$BRANCH" ]; then
    BRANCH="$(curl -fsSL "https://api.github.com/repos/kingpapylo/OpeyemiAgent" 2>/dev/null | sed -n 's/.*"default_branch": *"\([^"]*\)".*/\1/p' | head -n 1 || true)"
  fi
else
  BRANCH=""
fi

if [ -z "${BRANCH:-}" ]; then
  BRANCH="main"
fi

if [ -e "$TARGET_DIR/.git" ]; then
  echo "Updating existing clone in $TARGET_DIR"
  cd "$TARGET_DIR"
  git pull --rebase || true
elif [ -e "$TARGET_DIR" ]; then
  echo "Target path exists but is not a git repo: $TARGET_DIR" >&2
  exit 1
else
  git clone --branch "$BRANCH" "$REPO_URL" "$TARGET_DIR"
  cd "$TARGET_DIR"
fi

if [ -f rebrand.sh ]; then
  bash ./rebrand.sh || true
fi

if [ -f setup.sh ]; then
  bash ./setup.sh
else
  echo "setup.sh is missing from the repository checkout." >&2
  exit 1
fi

if command -v opeyemiagent >/dev/null 2>&1; then
  opeyemiagent health || true
fi

echo "OpeyemiAgent installed in $(pwd)"
echo "Next: try: opeyemiagent ask \"build a node cli logger\""
