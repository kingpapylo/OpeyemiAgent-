import { createSessionEntry, loadState, saveState } from './state.js';

export function bootScan() {
  const checks = [];
  checks.push(`Node.js: ${process.version}`);
  checks.push(`Platform: ${process.platform}`);
  checks.push(`Arch: ${process.arch}`);
  checks.push(`Shell: ${process.env.SHELL || 'unknown'}`);
  checks.push(`Home: ${process.env.HOME || 'unknown'}`);
  return checks;
}

export function createAgent() {
  const state = loadState();

  function save() {
    state.healthState.lastSavedAt = new Date().toISOString();
    saveState(state);
  }

  function addMemory(kind, text) {
    state.memory[kind].unshift({ text, createdAt: new Date().toISOString() });
    save();
  }

  function addTeaching(kind, text) {
    state.teachings[kind].unshift({ text, createdAt: new Date().toISOString() });
    save();
  }

  function startSession(message) {
    state.sessions.current = {
      startedAt: new Date().toISOString(),
      lastMessage: message,
      lastResponse: '',
    };
    save();
  }

  function finishSession(message, response) {
    state.sessions.current = {
      startedAt: state.sessions.current?.startedAt || new Date().toISOString(),
      lastMessage: message,
      lastResponse: response,
      finishedAt: new Date().toISOString(),
    };
    state.sessions.history.unshift(createSessionEntry(message, response));
    state.sessions.history = state.sessions.history.slice(0, 50);
    save();
  }

  function responseFor(command, input) {
    switch (command) {
      case 'automation':
        return `Automation task received: ${input}\nNext: convert this into a safe command plan or script.`;
      case 'research':
        return `Research topic: ${input}\nNext: collect sources, compare them, and write a short summary.`;
      case 'coding':
        return `Coding request: ${input}\nNext: define the smallest working implementation and test it.`;
      case 'memory':
        return `Memory counts — episodic: ${state.memory.episodic.length}, semantic: ${state.memory.semantic.length}, procedural: ${state.memory.procedural.length}`;
      case 'teach':
        return `Teachings — rules: ${state.teachings.rules.length}, workflows: ${state.teachings.workflows.length}, corrections: ${state.teachings.corrections.length}`;
      case 'health':
        return `Health check complete. Stored last scan at ${state.healthState.lastScanAt || 'never'}.`;
      default:
        return `Unknown command: ${command}`;
    }
  }

  return {
    state,
    bootScan,
    save,
    addMemory,
    addTeaching,
    startSession,
    finishSession,
    responseFor,
  };
}
