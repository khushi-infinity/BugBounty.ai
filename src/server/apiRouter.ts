import express, { Request, Response } from 'express';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import {
  callGemini,
  logToNeatlogs,
  payBounty,
  runAgentWorkflow,
  saveToEntire,
} from './agentWorkflow.ts';
import { testGitHubConnection } from './githubService.ts';

const execAsync = promisify(exec);
export const apiRouter = express.Router();

// Parse JSON bodies
apiRouter.use(express.json());

let activeEntireProc: any = null;

/**
 * Health check & environment status
 */
apiRouter.get('/config', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    keys: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      neatlogs: Boolean(process.env.NEATLOGS_API_KEY),
      entire: Boolean(process.env.ENTIRE_API_KEY),
      cfo: Boolean(process.env.CFO_API_KEY),
      github: Boolean(process.env.GITHUB_TOKEN),
    },
    version: '1.0.0',
    model: 'gemini-3.8-flash',
  });
});

/**
 * Streamed agent execution via Server-Sent Events (SSE)
 */
apiRouter.post('/run-agents', async (req: Request, res: Response) => {
  const { code, keys, animationDelay = 1000 } = req.body || {};

  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Code snippet is required.' });
    return;
  }

  // Set SSE response headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const sendEvent = (eventData: any) => {
    res.write(`data: ${JSON.stringify(eventData)}\n\n`);
    // @ts-ignore
    if (res.flush) res.flush();
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Run with paced pacing for visual pixel-art walking & elevator realism
  try {
    await runAgentWorkflow(
      { code, keys },
      async (streamEvent) => {
        sendEvent(streamEvent);
        // Add pacing between visual states so the pixel-art walking animation can be appreciated
        if (
          streamEvent.type === 'agent_move' ||
          streamEvent.type === 'elevator_move' ||
          streamEvent.type === 'agent_speak'
        ) {
          await sleep(Math.min(Math.max(animationDelay, 300), 2000));
        } else {
          await sleep(250);
        }
      }
    );
  } catch (err: any) {
    sendEvent({
      type: 'error',
      timestamp: Date.now(),
      data: { message: err?.message || 'Workflow streaming failure' },
    });
  } finally {
    res.write('event: end\ndata: [DONE]\n\n');
    res.end();
  }
});

/**
 * Trigger Entire CLI device login flow on-demand
 */
apiRouter.post('/entire/login', (req: Request, res: Response) => {
  try {
    if (activeEntireProc) {
      try {
        activeEntireProc.kill();
      } catch {}
    }

    const proc = spawn('entire', ['login', '--device'], {
      env: { ...process.env, ACCESSIBLE: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    activeEntireProc = proc;

    let responded = false;
    let fullOutput = '';

    const timeout = setTimeout(() => {
      if (!responded) {
        responded = true;
        res.status(504).json({ error: 'Timed out waiting for device code from Entire CLI.' });
      }
    }, 8000);

    proc.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      fullOutput += text;

      const codeMatch = text.match(/Device code:\s*([A-Z0-9-]+)/i) || fullOutput.match(/Device code:\s*([A-Z0-9-]+)/i);
      const urlMatch =
        text.match(/https:\/\/in\.auth\.entire\.io\/cli\/auth\?user_code=([A-Z0-9-]+)/i) ||
        fullOutput.match(/https:\/\/in\.auth\.entire\.io\/cli\/auth\?user_code=([A-Z0-9-]+)/i);

      if ((codeMatch || urlMatch) && !responded) {
        clearTimeout(timeout);
        responded = true;
        const code = codeMatch ? codeMatch[1] : urlMatch ? urlMatch[1] : '';
        const url = urlMatch ? urlMatch[0] : `https://in.auth.entire.io/cli/auth?user_code=${code}`;
        res.json({ code, url, status: 'waiting_for_approval' });
      }
    });

    proc.on('exit', (code) => {
      activeEntireProc = null;
      if (!responded) {
        clearTimeout(timeout);
        responded = true;
        res.status(500).json({ error: `Entire CLI exited with code ${code}`, output: fullOutput });
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Check Entire CLI login context
 */
apiRouter.get('/entire/status', async (req: Request, res: Response) => {
  try {
    const { stdout } = await execAsync('entire auth contexts || true');
    const hasContext = !stdout.includes('No login contexts') && stdout.trim().length > 0;
    res.json({ authenticated: hasContext, output: stdout.trim() });
  } catch (err: any) {
    res.json({ authenticated: false, error: err.message });
  }
});

/**
 * Direct single test of any integration
 */
apiRouter.post('/test-integration', async (req: Request, res: Response) => {
  const { service, key, owner, repo } = req.body || {};

  try {
    if (service === 'gemini') {
      const result = await callGemini(
        'Respond with: "Gemini 3.8 Flash operational on BugBounty server!"',
        'You are a testing agent.',
        key
      );
      res.json(result);
    } else if (service === 'neatlogs') {
      const trace = await logToNeatlogs('Manual connection ping test', 'info', { testPing: true }, key);
      res.json({ trace });
    } else if (service === 'entire') {
      const result = await saveToEntire(
        {
          bugTitle: 'Smoke Test Checkpoint',
          rootCause: 'Connection verification ping',
          originalCode: 'const x = 1;',
          proposedFix: 'const x = 2;',
          testCase: 'expect(x).toBe(2);',
          agent: 'ping_tester',
        },
        key
      );
      res.json(result);
    } else if (service === 'cfo') {
      const result = await payBounty(1.0, 'test_qa_wallet', 'Smoke test ping verification', key);
      res.json(result);
    } else if (service === 'github') {
      const result = await testGitHubConnection(key || process.env.GITHUB_TOKEN || '', owner, repo);
      res.json(result);
    } else {
      res.status(400).json({ error: `Unknown service: ${service}` });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Integration test failed' });
  }
});
