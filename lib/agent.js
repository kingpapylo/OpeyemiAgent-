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

  function tokenize(text) {
    return String(text || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  }

  function scoreText(text, tokens) {
    const haystack = String(text || '').toLowerCase();
    return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
  }

  function collectGuidance(command, input) {
    const tokens = tokenize(`${command} ${input}`);
    const skillLines = docs.skill.split('\n').filter((line) => scoreText(line, tokens) > 0);
    const toolLines = docs.tools.split('\n').filter((line) => scoreText(line, tokens) > 0);
    const memoryLines = [
      ...state.memory.episodic,
      ...state.memory.semantic,
      ...state.memory.procedural,
    ]
      .map((entry) => entry.text)
      .filter((text) => scoreText(text, tokens) > 0);
    return {
      skillLines: skillLines.slice(0, 3),
      toolLines: toolLines.slice(0, 3),
      memoryLines: memoryLines.slice(0, 3),
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

  function routeMode(input) {
    const tokens = tokenize(input);
    const memorySignals = [
      { mode: 'research', terms: ['research', 'compare', 'summary', 'source', 'what'] },
      { mode: 'coding', terms: ['code', 'bug', 'repo', 'build', 'implement'] },
      { mode: 'automation', terms: ['install', 'setup', 'backup', 'script', 'automate'] },
    ];

    const scored = memorySignals.map((item) => {
      const commandScore = item.terms.reduce((score, term) => score + (tokens.includes(term) ? 2 : 0), 0);
      const docScore = scoreText(docs.skill, item.terms) + scoreText(docs.tools, item.terms);
      const memoryScore = [
        ...state.memory.episodic,
        ...state.memory.semantic,
        ...state.memory.procedural,
      ].reduce((score, entry) => score + scoreText(entry.text, item.terms), 0);
      return { mode: item.mode, score: commandScore + docScore + memoryScore };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    const second = scored[1] || { score: 0 };
    const total = Math.max(best.score + second.score, 1);
    const confidence = best.score <= 0 ? 0 : Math.min(99, Math.round((best.score / total) * 100));
    const gap = best.score - second.score;
    const mixed = confidence < 55 || gap <= 2;

    return {
      mode: best.score > 0 ? best.mode : 'automation',
      confidence,
      mixed,
      secondaryMode: second.score > 0 ? second.mode : null,
      scores: scored,
    };
  }

  function responseFor(command, input) {
    const guidance = collectGuidance(command, input);
    const skillHint = guidance.skillLines.length ? `\nSkill guidance: ${guidance.skillLines.join(' | ')}` : '';
    const toolHint = guidance.toolLines.length ? `\nTool guidance: ${guidance.toolLines.join(' | ')}` : '';
    const memoryHint = guidance.memoryLines.length ? `\nMemory guidance: ${guidance.memoryLines.join(' | ')}` : '';
    const commandHint = recommendCommand(command, input) ? `\nRecommendation: ${recommendCommand(command, input)}` : '';

    switch (command) {
      case 'automation':
        return `Automation task received: ${input}\nNext: convert this into a safe command plan or script.${skillHint}${toolHint}${memoryHint}${commandHint}`;
      case 'research':
        return `Research topic: ${input}\nNext: collect sources, compare them, and write a short summary.${skillHint}${toolHint}${memoryHint}${commandHint}`;
      case 'coding':
        return `Coding request: ${input}\nNext: define the smallest working implementation and test it.${skillHint}${toolHint}${memoryHint}${commandHint}`;
      case 'memory': {
        const kind = classifyMemory(input || '');
        return `Memory counts — episodic: ${state.memory.episodic.length}, semantic: ${state.memory.semantic.length}, procedural: ${state.memory.procedural.length}\nSuggested memory bucket: ${kind}${skillHint}${toolHint}${memoryHint}${commandHint}`;
      }
      case 'teach': {
        const bucket = classifyTeachingBucket(input || '');
        return `Teachings — rules: ${state.teachings.rules.length}, workflows: ${state.teachings.workflows.length}, corrections: ${state.teachings.corrections.length}, knowledge: ${state.teachings.knowledge.length}, examples: ${state.teachings.examples.length}\nSuggested teaching bucket: ${bucket}${skillHint}${toolHint}${memoryHint}${commandHint}`;
      }
      case 'health':
        return `Health check complete. Stored last scan at ${state.healthState.lastScanAt || 'never'}.${skillHint}${toolHint}${memoryHint}${commandHint}`;
      default:
        return `Unknown command: ${command}${skillHint}${toolHint}${memoryHint}${commandHint}`;
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
    routeMode,
    addTeaching,
    startSession,
    finishSession,
    responseFor,
  };
}
