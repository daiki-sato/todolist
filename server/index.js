import { createServer } from 'http';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Simple .env loader
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
  env.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && !process.env[key]) {
      process.env[key] = rest.join('=').trim();
    }
  });
} catch {}

const PORT = 3001;

const server = createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/ai') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ error: 'OpenAI API key is not configured' }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const { prompt } = JSON.parse(body || '{}');
        const oaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt ?? '' }],
          }),
        });
        const data = await oaiResp.json();
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ text: data.choices?.[0]?.message?.content ?? '' }));
      } catch (e) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ error: e.message ?? 'OpenAI request failed' }));
      }
    });
  } else {
    res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`api on http://localhost:${PORT}`);
});

