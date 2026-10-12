import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting entire login --device with ACCESSIBLE=1...');
const proc = spawn('entire', ['login', '--device'], {
  env: { ...process.env, ACCESSIBLE: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const outPath = path.resolve('entire_auth_info.json');

proc.stdout.on('data', (chunk) => {
  const str = chunk.toString();
  console.log('[entire stdout]:', str);

  const codeMatch = str.match(/Device code:\s*([A-Z0-9-]+)/i);
  const urlMatch = str.match(/https:\/\/in\.auth\.entire\.io\/cli\/auth\?user_code=([A-Z0-9-]+)/i);

  if (codeMatch || urlMatch) {
    const code = codeMatch ? codeMatch[1] : (urlMatch ? urlMatch[1] : '');
    const url = urlMatch ? urlMatch[0] : `https://in.auth.entire.io/cli/auth?user_code=${code}`;
    const data = { code, url, status: 'waiting_for_approval', time: new Date().toISOString() };
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log('[SAVED AUTH INFO]:', data);
  }
});

proc.stderr.on('data', (chunk) => {
  console.error('[entire stderr]:', chunk.toString());
});

proc.on('exit', (code) => {
  console.log(`[entire exit] code: ${code}`);
  if (fs.existsSync(outPath)) {
    const curr = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    curr.status = code === 0 ? 'authenticated' : `exited_${code}`;
    fs.writeFileSync(outPath, JSON.stringify(curr, null, 2));
  }
});
