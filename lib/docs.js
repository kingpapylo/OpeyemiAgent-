import fs from 'node:fs';
import path from 'node:path';

function readText(filePath, fallback = '') {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return fallback;
  }
}

export function loadDocs(baseDir = process.cwd()) {
  const skillPath = path.join(baseDir, 'Skill.md');
  const toolsPath = path.join(baseDir, 'tools.md');

  return {
    skill: readText(skillPath, 'Skill.md not found.'),
    tools: readText(toolsPath, 'tools.md not found.'),
    skillPath,
    toolsPath,
  };
}