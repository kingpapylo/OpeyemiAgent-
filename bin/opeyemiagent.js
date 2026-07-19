#!/usr/bin/env node
import process from 'node:process';
import { createAgent } from '../lib/agent.js';

const argv = process.argv.slice(2);
const explicitCommand = argv[0] || 'help';
const agent = createAgent();

function printHelp() {
  console.log(`OpeOpeNationAiAgent v3

Usage:
  opeyemiagent <command> [options]

Commands:
  automation   Track an automation task
  research     Track a research task
  coding       Track a coding task
  ask          Auto-route free text to the best mode
  memory       Show memory stats
  teach        Add a teaching note
  teach:auto   Auto-pick the teaching bucket
  health       Run a boot/health scan
  status       Show the current session status
  tools        Show the tool catalog
  help         Show this help text

Examples:
  opeyemiagent automation "backup my downloads folder"
  opeyemiagent research "termux battery optimization"
  opeyemiagent coding "build a node cli logger"
  opeyemiagent teach rules "Always ask before shell commands"
  opeyemiagent teach auto "When requests mention install steps, use workflows"
  opeyemiagent tools
`);
}

function printStatus() {
  const { state } = agent;
  console.log(`OpeOpeNationAiAgent v3`);
  console.log(`Identity: ${state.identity.name}`);
  console.log(`Role: ${state.identity.role}`);
  console.log(`Last saved: ${state.healthState.lastSavedAt || 'never'}`);
  console.log(`Current session: ${state.sessions.current ? 'active' : 'none'}`);
  console.log(`Skill loaded: ${agent.docs.skillPath}`);
  console.log(`Tools loaded: ${agent.docs.toolsPath}`);
}

function printTools() {
  console.log(agent.docs.tools);
}

function normalizeInput(text) {
  return String(text || '').trim();
}

function detectMode(text) {
  const lower = normalizeInput(text).toLowerCase();
  if (!lower) return 'help';
  if (lower.includes('research') || lower.includes('find') || lower.includes('compare') || lower.includes('what is')) return 'research';
  if (lower.includes('code') || lower.includes('bug') || lower.includes('repo') || lower.includes('build')) return 'coding';
  if (lower.includes('install') || lower.includes('setup') || lower.includes('backup') || lower.includes('script') || lower.includes('automate')) return 'automation';
  return 'automation';
}

function runTask(kind, input) {
  if (!input) {
    console.log(`Provide a ${kind} prompt.`);
    return;
  }
  agent.startSession(input);
  const response = agent.responseFor(kind, input);
  const memoryBucket = kind === 'memory' ? agent.classifyMemory(input) : 'episodic';
  agent.addMemory(memoryBucket, `${kind}: ${input}`);
  console.log(response);
  agent.finishSession(input, response);
}

function runAsk(input) {
  const mode = agent.routeMode(input);
  if (mode === 'help') {
    printHelp();
    return;
  }
  console.log(`Auto-routed to: ${mode}`);
  runTask(mode, input);
}

function runTeach(kind, input) {
  if (!input) {
    console.log('Provide a teaching note.');
    return;
  }
  const bucket = kind === 'auto' ? agent.classifyTeachingBucket(input) : kind;
  if (!agent.state.teachings[bucket]) {
    console.log(`Unknown teaching bucket: ${bucket}`);
    return;
  }
  agent.addTeaching(bucket, input);
  console.log(`Saved teaching to ${bucket}: ${input}`);
}

switch (explicitCommand) {
  case 'automation':
    runTask('automation', argv.slice(1).join(' '));
    break;
  case 'research':
    runTask('research', argv.slice(1).join(' '));
    break;
  case 'coding':
    runTask('coding', argv.slice(1).join(' '));
    break;
  case 'ask':
    runAsk(argv.slice(1).join(' '));
    break;
  case 'memory':
    console.log(`Episodic: ${agent.state.memory.episodic.length}`);
    console.log(`Semantic: ${agent.state.memory.semantic.length}`);
    console.log(`Procedural: ${agent.state.memory.procedural.length}`);
    break;
  case 'teach': {
    const [bucket = 'rules', ...rest] = args;
    runTeach(bucket, rest.join(' '));
    break;
  }
  case 'health':
    console.log('Boot scan:');
    for (const line of agent.bootScan()) {
      console.log(`- ${line}`);
    }
    agent.state.healthState.lastScanAt = new Date().toISOString();
    agent.save();
    break;
  case 'status':
    printStatus();
    break;
  case 'tools':
    printTools();
    break;
  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;
  default:
    if (argv.length > 0) {
      runAsk(argv.join(' '));
      break;
    }
    console.log(`Unknown command: ${explicitCommand}`);
    printHelp();
}
