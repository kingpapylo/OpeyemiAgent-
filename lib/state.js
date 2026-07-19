import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const APP_DIR = path.join(os.homedir(), '.opeope_nation');
export const MEMORY_DIR = path.join(APP_DIR, 'memory');
export const SESSIONS_DIR = path.join(APP_DIR, 'sessions');
export const TEACHINGS_DIR = path.join(APP_DIR, 'teachings');

const DEFAULT_STATE = {
  identity: {
    name: 'OpeOpeNationAiAgent',
    version: 'v3',
    role: 'The Operation Agent — ROOM!',
  },
  userProfile: {},
  relationship: {},
  behaviors: [],
  errorPatterns: [],
  healthState: {},
  memory: {
    episodic: [],
    semantic: [],
    procedural: [],
  },
  sessions: {
    current: null,
    history: [],
  },
  teachings: {
    rules: [],
    workflows: [],
    corrections: [],
    knowledge: [],
    examples: [],
  },
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

export function ensureStorage() {
  ensureDir(APP_DIR);
  ensureDir(MEMORY_DIR);
  ensureDir(SESSIONS_DIR);
  ensureDir(TEACHINGS_DIR);
}

export function loadState() {
  ensureStorage();
  return {
    ...DEFAULT_STATE,
    identity: readJson(path.join(APP_DIR, 'identity.json'), DEFAULT_STATE.identity),
    userProfile: readJson(path.join(APP_DIR, 'user_profile.json'), DEFAULT_STATE.userProfile),
    relationship: readJson(path.join(APP_DIR, 'relationship.json'), DEFAULT_STATE.relationship),
    behaviors: readJson(path.join(APP_DIR, 'behaviors.json'), DEFAULT_STATE.behaviors),
    errorPatterns: readJson(path.join(APP_DIR, 'error_patterns.json'), DEFAULT_STATE.errorPatterns),
    healthState: readJson(path.join(APP_DIR, 'health_state.json'), DEFAULT_STATE.healthState),
    memory: {
      episodic: readJson(path.join(MEMORY_DIR, 'episodic.json'), DEFAULT_STATE.memory.episodic),
      semantic: readJson(path.join(MEMORY_DIR, 'semantic.json'), DEFAULT_STATE.memory.semantic),
      procedural: readJson(path.join(MEMORY_DIR, 'procedural.json'), DEFAULT_STATE.memory.procedural),
    },
    sessions: {
      current: readJson(path.join(SESSIONS_DIR, 'current_session.json'), DEFAULT_STATE.sessions.current),
      history: readJson(path.join(SESSIONS_DIR, 'history.json'), DEFAULT_STATE.sessions.history),
    },
    teachings: {
      rules: readJson(path.join(TEACHINGS_DIR, 'rules.json'), DEFAULT_STATE.teachings.rules),
      workflows: readJson(path.join(TEACHINGS_DIR, 'workflows.json'), DEFAULT_STATE.teachings.workflows),
      corrections: readJson(path.join(TEACHINGS_DIR, 'corrections.json'), DEFAULT_STATE.teachings.corrections),
      knowledge: readJson(path.join(TEACHINGS_DIR, 'knowledge.json'), DEFAULT_STATE.teachings.knowledge),
      examples: readJson(path.join(TEACHINGS_DIR, 'examples.json'), DEFAULT_STATE.teachings.examples),
    },
  };
}

export function saveState(state) {
  ensureStorage();
  writeJson(path.join(APP_DIR, 'identity.json'), state.identity);
  writeJson(path.join(APP_DIR, 'user_profile.json'), state.userProfile);
  writeJson(path.join(APP_DIR, 'relationship.json'), state.relationship);
  writeJson(path.join(APP_DIR, 'behaviors.json'), state.behaviors);
  writeJson(path.join(APP_DIR, 'error_patterns.json'), state.errorPatterns);
  writeJson(path.join(APP_DIR, 'health_state.json'), state.healthState);
  writeJson(path.join(MEMORY_DIR, 'episodic.json'), state.memory.episodic);
  writeJson(path.join(MEMORY_DIR, 'semantic.json'), state.memory.semantic);
  writeJson(path.join(MEMORY_DIR, 'procedural.json'), state.memory.procedural);
  writeJson(path.join(SESSIONS_DIR, 'current_session.json'), state.sessions.current);
  writeJson(path.join(SESSIONS_DIR, 'history.json'), state.sessions.history);
  writeJson(path.join(TEACHINGS_DIR, 'rules.json'), state.teachings.rules);
  writeJson(path.join(TEACHINGS_DIR, 'workflows.json'), state.teachings.workflows);
  writeJson(path.join(TEACHINGS_DIR, 'corrections.json'), state.teachings.corrections);
  writeJson(path.join(TEACHINGS_DIR, 'knowledge.json'), state.teachings.knowledge);
  writeJson(path.join(TEACHINGS_DIR, 'examples.json'), state.teachings.examples);
}

export function createSessionEntry(message, response) {
  return {
    id: Date.now().toString(36),
    message,
    response,
    createdAt: new Date().toISOString(),
  };
}
