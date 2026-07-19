#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo 'Node.js is required. Install Node.js 18+ first.' >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo 'npm is required.' >&2
  exit 1
fi

npm install
npm link

echo 'OpeOpeNationAiAgent is installed.'
echo 'Run: opeyemiagent health'
