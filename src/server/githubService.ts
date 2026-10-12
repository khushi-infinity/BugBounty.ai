import { Octokit } from 'octokit';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export interface GitHubPushOptions {
  checkpointId: string;
  issueId: string;
  bugTitle: string;
  originalCode: string;
  finalCode: string;
  testCase?: string;
  token?: string;
  owner?: string;
  repo?: string;
  branch?: string;
}

export interface GitHubPushResult {
  success: boolean;
  commitSha: string;
  commitUrl: string;
  repo: string;
  owner: string;
  branch: string;
  filePath: string;
  timestamp: string;
  simulated: boolean;
  message: string;
  error?: string;
}

/**
 * Automatically pushes the verified code state and checkpoint metadata to GitHub using Octokit.
 * Also performs local git commit to trigger Entire CLI session linking hooks.
 */
export async function pushWorkflowToGitHub(
  options: GitHubPushOptions
): Promise<GitHubPushResult> {
  const token = options.token || process.env.GITHUB_TOKEN || '';
  const owner = options.owner || process.env.GITHUB_OWNER || '';
  const repo = options.repo || process.env.GITHUB_REPO || '';
  const branch = options.branch || process.env.GITHUB_BRANCH || 'main';

  const timestamp = new Date().toISOString();
  const filePath = `fixes/${options.checkpointId}.ts`;
  const commitMessage = `fix(autofix): resolve ${options.bugTitle} (Checkpoint: ${options.checkpointId})

- Issue: ${options.issueId}
- Verified by: BugBounty.ai Autonomous Review Agent (Gemini 3.8 Flash)
- Checkpoint: ${options.checkpointId}`;

  // Content for the patch file including original bug context, unit test, and verified fix
  const fileContent = `/**
 * Autonomous Fix by BugBounty.ai
 * Issue: ${options.issueId} - ${options.bugTitle}
 * Checkpoint: ${options.checkpointId}
 * Timestamp: ${timestamp}
 */

// --- VERIFIED CODE PATCH ---
${options.finalCode}

${
  options.testCase
    ? `// --- VERIFICATION TEST CASE ---\n${options.testCase}`
    : ''
}
`;

  // 1. Also save locally in git workspace so Entire CLI session hooks capture it
  try {
    const localFixDir = path.resolve('checkpoints');
    if (!fs.existsSync(localFixDir)) {
      fs.mkdirSync(localFixDir, { recursive: true });
    }
    const localFilePath = path.join(localFixDir, `${options.checkpointId}.json`);
    fs.writeFileSync(
      localFilePath,
      JSON.stringify(
        {
          checkpointId: options.checkpointId,
          issueId: options.issueId,
          bugTitle: options.bugTitle,
          originalCode: options.originalCode,
          finalCode: options.finalCode,
          testCase: options.testCase,
          timestamp,
        },
        null,
        2
      )
    );

    // Commit to local git repository
    await execAsync(
      `git add checkpoints/${options.checkpointId}.json && git commit -m "${commitMessage.replace(/"/g, '\\"')}" || true`
    );
  } catch (localErr) {
    console.warn('[GitHubService] Local git commit note:', localErr);
  }

  // 2. Real GitHub Push via Octokit if credentials are provided
  if (token && owner && repo) {
    try {
      const octokit = new Octokit({ auth: token });

      // Check if file already exists to obtain SHA for update
      let existingFileSha: string | undefined = undefined;
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: branch,
        });
        if (!Array.isArray(data) && 'sha' in data) {
          existingFileSha = data.sha;
        }
      } catch (checkErr: any) {
        // 404 is normal for a new file
        if (checkErr.status !== 404) {
          console.warn('[GitHubService] Error checking existing file:', checkErr);
        }
      }

      // Base64 encode the file content
      const contentBase64 = Buffer.from(fileContent).toString('base64');

      // Create or update file contents
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: commitMessage,
        content: contentBase64,
        branch,
        sha: existingFileSha,
      });

      const commitSha = response.data.commit.sha || '';
      const commitUrl =
        response.data.commit.html_url ||
        `https://github.com/${owner}/${repo}/commit/${commitSha}`;

      console.log(`[GitHubService] Pushed to GitHub: ${commitUrl}`);

      return {
        success: true,
        commitSha,
        commitUrl,
        repo,
        owner,
        branch,
        filePath,
        timestamp,
        simulated: false,
        message: `Successfully pushed fix commit to ${owner}/${repo}@${branch}`,
      };
    } catch (err: any) {
      console.error('[GitHubService] Octokit push error:', err);
      return {
        success: false,
        commitSha: `err_${Date.now().toString(16)}`,
        commitUrl: `https://github.com/${owner}/${repo}`,
        repo,
        owner,
        branch,
        filePath,
        timestamp,
        simulated: false,
        message: `GitHub API push error: ${err.message}`,
        error: err.message,
      };
    }
  }

  // 3. Fallback / Local simulated mode when remote GitHub repo is not yet configured
  let localSha = 'local_head';
  try {
    const { stdout } = await execAsync('git rev-parse --short HEAD');
    localSha = stdout.trim() || localSha;
  } catch {}

  return {
    success: true,
    commitSha: localSha,
    commitUrl: `https://github.com/${owner || 'user'}/${repo || 'bugbounty-repo'}/commit/${localSha}`,
    repo: repo || 'local-repo',
    owner: owner || 'autonomous-agent',
    branch,
    filePath,
    timestamp,
    simulated: true,
    message: token
      ? 'GitHub Owner/Repo not configured. Fix committed locally to git.'
      : 'Saved and committed to local Git repo. Add GITHUB_TOKEN & GITHUB_REPO to push directly to remote GitHub.',
  };
}

/**
 * Validates GitHub connection via Octokit
 */
export async function testGitHubConnection(
  token: string,
  owner?: string,
  repo?: string
): Promise<{ ok: boolean; user?: string; repoFound?: boolean; error?: string }> {
  if (!token) {
    return { ok: false, error: 'GitHub token is required.' };
  }

  try {
    const octokit = new Octokit({ auth: token });
    const { data: user } = await octokit.rest.users.getAuthenticated();

    let repoFound = false;
    if (owner && repo) {
      try {
        await octokit.rest.repos.get({ owner, repo });
        repoFound = true;
      } catch {
        repoFound = false;
      }
    }

    return {
      ok: true,
      user: user.login,
      repoFound,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || 'GitHub authentication failed',
    };
  }
}
