import { createSessionEntry, loadState, saveState } from './state.js';
import { loadDocs } from './docs.js';

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
  const docs = loadDocs();

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

  function relevantGuidance(command) {
    const skillLines = docs.skill.split('\n').filter((line) => line.toLowerCase().includes(command));
    const toolLines = docs.tools.split('\n').filter((line) => line.toLowerCase().includes(command));
    return {
      skillLines: skillLines.slice(0, 3),
      toolLines: toolLines.slice(0, 3),
    };
  }

  function responseFor(command, input) {
    const guidance = relevantGuidance(command);
    const skillHint = guidance.skillLines.length ? `\nSkill guidance: ${guidance.skillLines.join(' | ')}` : '';
    const toolHint = guidance.toolLines.length ? `\nTool guidance: ${guidance.toolLines.join(' | ')}` : '';

    switch (command) {
      case 'automation':
        return `Automation task received: ${input}\nNext: convert this into a safe command plan or script.${skillHint}${toolHint}`;
      case 'research':
        return `Research topic: ${input}\nNext: collect sources, compare them, and write a short summary.${skillHint}${toolHint}`;
      case 'coding':
        return `Coding request: ${input}\nNext: define the smallest working implementation and test it.${skillHint}${toolHint}`;
      case 'memory':
        return `Memory counts — episodic: ${state.memory.episodic.length}, semantic: ${state.memory.semantic.length}, procedural: ${state.memory.procedural.length}${skillHint}${toolHint}`;
      case 'teach':
        return `Teachings — rules: ${state.teachings.rules.length}, workflows: ${state.teachings.workflows.length}, corrections: ${state.teachings.corrections.length}${skillHint}${toolHint}`;
      case 'health':
        return `Health check complete. Stored last scan at ${state.healthState.lastScanAt || 'never'}.${skillHint}${toolHint}`;
      default:
        return `Unknown command: ${command}${skillHint}${toolHint}`;
    }
  }

  return {
    state,
    docs,
    bootScan,
    save,
    addMemory,
    addTeaching,
    startSession,
    finishSession,
    responseFor,
  };
}
