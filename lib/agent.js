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

  function classifyMemory(text) {
    const lower = text.toLowerCase();
    if (lower.includes('how to') || lower.includes('step') || lower.includes('workflow') || lower.includes('install')) {
      return 'procedural';
    }
    if (lower.includes('fact') || lower.includes('definition') || lower.includes('research') || lower.includes('what is')) {
      return 'semantic';
    }
    return 'episodic';
  }

  function classifyTeachingBucket(text) {
    const lower = text.toLowerCase();
    if (lower.includes('always') || lower.includes('never') || lower.includes('rule')) return 'rules';
    if (lower.includes('how to') || lower.includes('workflow') || lower.includes('when to')) return 'workflows';
    if (lower.includes('instead') || lower.includes('wrong') || lower.includes('fix')) return 'corrections';
    if (lower.includes('fact') || lower.includes('know') || lower.includes('remember')) return 'knowledge';
    return 'examples';
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

  function relevantGuidance(command, input) {
    const needle = `${command} ${input}`.toLowerCase();
    const skillLines = docs.skill.split('\n').filter((line) => line.toLowerCase().includes(command) || line.toLowerCase().includes(needle));
    const toolLines = docs.tools.split('\n').filter((line) => line.toLowerCase().includes(command) || line.toLowerCase().includes(needle));
    return {
      skillLines: skillLines.slice(0, 3),
      toolLines: toolLines.slice(0, 3),
    };
  }

  function recommendCommand(command, input) {
    const lower = input.toLowerCase();
    if (command === 'research' && (lower.includes('install') || lower.includes('fix') || lower.includes('script'))) {
      return 'Use automation for command plans or setup work.';
    }
    if (command === 'automation' && (lower.includes('explain') || lower.includes('code') || lower.includes('bug'))) {
      return 'Use coding if you want repository changes or implementation help.';
    }
    if (command === 'coding' && (lower.includes('what is') || lower.includes('compare') || lower.includes('find'))) {
      return 'Use research if you want facts, comparisons, or summaries first.';
    }
    return '';
  }

  function responseFor(command, input) {
    const guidance = relevantGuidance(command, input);
    const skillHint = guidance.skillLines.length ? `\nSkill guidance: ${guidance.skillLines.join(' | ')}` : '';
    const toolHint = guidance.toolLines.length ? `\nTool guidance: ${guidance.toolLines.join(' | ')}` : '';
    const commandHint = recommendCommand(command, input) ? `\nRecommendation: ${recommendCommand(command, input)}` : '';

    switch (command) {
      case 'automation':
        return `Automation task received: ${input}\nNext: convert this into a safe command plan or script.${skillHint}${toolHint}${commandHint}`;
      case 'research':
        return `Research topic: ${input}\nNext: collect sources, compare them, and write a short summary.${skillHint}${toolHint}${commandHint}`;
      case 'coding':
        return `Coding request: ${input}\nNext: define the smallest working implementation and test it.${skillHint}${toolHint}${commandHint}`;
      case 'memory': {
        const kind = classifyMemory(input || '');
        return `Memory counts — episodic: ${state.memory.episodic.length}, semantic: ${state.memory.semantic.length}, procedural: ${state.memory.procedural.length}\nSuggested memory bucket: ${kind}${skillHint}${toolHint}${commandHint}`;
      }
      case 'teach': {
        const bucket = classifyTeachingBucket(input || '');
        return `Teachings — rules: ${state.teachings.rules.length}, workflows: ${state.teachings.workflows.length}, corrections: ${state.teachings.corrections.length}, knowledge: ${state.teachings.knowledge.length}, examples: ${state.teachings.examples.length}\nSuggested teaching bucket: ${bucket}${skillHint}${toolHint}${commandHint}`;
      }
      case 'health':
        return `Health check complete. Stored last scan at ${state.healthState.lastScanAt || 'never'}.${skillHint}${toolHint}${commandHint}`;
      default:
        return `Unknown command: ${command}${skillHint}${toolHint}${commandHint}`;
    }
  }

  return {
    state,
    docs,
    bootScan,
    save,
    addMemory,
    classifyMemory,
    classifyTeachingBucket,
    addTeaching,
    startSession,
    finishSession,
    responseFor,
  };
}
