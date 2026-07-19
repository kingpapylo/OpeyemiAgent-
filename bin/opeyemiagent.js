#!/usr/bin/env node
import process from 'node:process';
import { createAgent } from '../lib/agent.js';

const [, , command = 'help', ...args] = process.argv;
const agent = createAgent();

function printHelp() {
  console.log(`OpeOpeNationAiAgent v3

Usage:
  opeyemiagent <command> [options]

Commands:
  automation   Track an automation task
  research     Track a research task
  coding       Track a coding task
  memory       Show memory stats
  teach        Add a teaching note
  health       Run a boot/health scan
  status       Show the current session status
  help         Show this help text

Examples:
  opeyemiagent automation "backup my downloads folder"
  opeyemiagent research "termux battery optimization"
  opeyemiagent coding "build a node cli logger"
  opeyemiagent teach rules "Always ask before shell commands"
`);
}

function printStatus() {
  const { state } = agent;
  console.log(`OpeOpeNationAiAgent v3`);
  console.log(`Identity: ${state.identity.name}`);
  console.log(`Role: ${state.identity.role}`);
  console.log(`Last saved: ${state.healthState.lastSavedAt || 'never'}`);
  console.log(`Current session: ${state.sessions.current ? 'active' : 'none'}`);
}

function runTask(kind, input) {
  if (!input) {
    console.log(`Provide a ${kind} prompt.`);
    return;
  }
  agent.startSession(input);
  agent.addMemory('episodic', `${kind}: ${input}`);
  const response = agent.responseFor(kind, input);
  console.log(response);
  agent.finishSession(input, response);
}

function runTeach(kind, input) {
  if (!input) {
    console.log('Provide a teaching note.');
    return;
  }
  if (!agent.state.teachings[kind]) {
    console.log(`Unknown teaching bucket: ${kind}`);
    return;
  }
  agent.addTeaching(kind, input);
  console.log(`Saved teaching to ${kind}: ${input}`);
}

switch (command) {
  case 'automation':
    runTask('automation', args.join(' '));
    break;
  case 'research':
    runTask('research', args.join(' '));
    break;
  case 'coding':
    runTask('coding', args.join(' '));
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
  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;
  default:
    console.log(`Unknown command: ${command}`);
    printHelp();
}
