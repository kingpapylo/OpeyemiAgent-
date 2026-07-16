#!/usr/bin/env bash
# push_opeyemiagent.sh — publish the OpeyemiAgent bundle to GitHub.
# Usage:  bash push_opeyemiagent.sh
# You will be prompted for your GitHub username and PAT (password).
set -euo pipefail

REPO_URL="https://github.com/kingpapylo/OpeyemiAgent-.git"
BRANCH="main"

command -v git >/dev/null 2>&1 || { echo "Installing git..."; pkg install -y git; }

cd "$(dirname "$0")"

git init -q
git config user.name "kingpapylo"
git config user.email "kingpapylo@users.noreply.github.com"
git checkout -q -B "$BRANCH"
git add -A
git commit -q -m "OpeyemiAgent rebrand: 10 MobileClaw plugins + persona + rebrand script" || echo "Nothing to commit."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
echo "Pushing to $REPO_URL ..."
echo "When prompted:  Username = kingpapylo | Password = your PAT"
git push -u origin "$BRANCH"
echo "DONE. View at https://github.com/kingpapylo/OpeyemiAgent-"
echo "REMINDER: rotate your PAT at github.com/settings/tokens after this push."
