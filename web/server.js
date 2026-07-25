import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAgent } from '../lib/agent.js';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const webDir = path.dirname(fileURLToPath(import.meta.url));
const indexHtml = fs.readFileSync(path.join(webDir, 'index.html'));

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function getSummary(agent) {
  return {
    identity: agent.state.identity,
    memory: {
      episodic: agent.state.memory.episodic.length,
      semantic: agent.state.memory.semantic.length,
      procedural: agent.state.memory.procedural.length,
    },
    sessions: agent.state.sessions.history.length,
    lastSavedAt: agent.state.healthState.lastSavedAt || null,
    health: agent.bootScan(),
  };
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && url.pathname === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(indexHtml);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/status') {
    sendJson(response, 200, getSummary(createAgent()));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/ask') {
    try {
      const body = await readJson(request);
      const input = String(body.input || '').trim();
      if (!input) {
        sendJson(response, 400, { error: 'Enter a request for the agent.' });
        return;
      }

      const agent = createAgent();
      const route = agent.routeMode(input);
      const mode = ['automation', 'research', 'coding'].includes(body.mode) ? body.mode : route.mode;
      const responseText = agent.responseFor(mode, input);
      agent.startSession(input);
      agent.addMemory('episodic', `${mode}: ${input}`);
      agent.finishSession(input, responseText);

      sendJson(response, 200, {
        mode,
        confidence: route.confidence,
        response: responseText,
        summary: getSummary(agent),
      });
    } catch (error) {
      sendJson(response, 400, { error: error.message || 'Invalid request.' });
    }
    return;
  }

  sendJson(response, 404, { error: 'Not found.' });
});

server.listen(port, host, () => {
  console.log(`OpeOpeNationAiAgent web interface listening on http://${host}:${port}`);
});
