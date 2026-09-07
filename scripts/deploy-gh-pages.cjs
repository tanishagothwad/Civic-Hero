#!/usr/bin/env node

/**
 * Automated script to build and deploy Civic Hero to GitHub Pages.
 * Triggers automatically from git hooks or directly via `npm run deploy`.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

console.log('🚀 [Auto-Deploy] Starting automated build for GitHub Pages...');

try {
  // 1. Compile production assets
  console.log('📦 [Auto-Deploy] Compiling TypeScript & building with Vite...');
  execSync('npm run build', { cwd: repoRoot, stdio: 'inherit' });

  // 2. Commit dist/ directly to gh-pages branch without dirtying working directory
  console.log('🌿 [Auto-Deploy] Updating gh-pages branch...');
  const tempIndex = path.join(repoRoot, '.git', 'temp-deploy-index');
  const env = { ...process.env, GIT_INDEX_FILE: tempIndex };

  execSync('git add -f dist/', { cwd: repoRoot, env });
  const tree = execSync('git write-tree --prefix=dist', { cwd: repoRoot, env }).toString().trim();
  
  const currentHeadCommit = execSync('git rev-parse HEAD', { cwd: repoRoot }).toString().trim().slice(0, 7);
  const commitMsg = `Auto-deploy from commit ${currentHeadCommit} [skip ci]`;
  
  const commit = execSync(
    `git commit-tree ${tree} -p refs/heads/gh-pages -m "${commitMsg}"`,
    { cwd: repoRoot }
  ).toString().trim();

  execSync(`git update-ref refs/heads/gh-pages ${commit}`, { cwd: repoRoot });
  if (fs.existsSync(tempIndex)) {
    fs.unlinkSync(tempIndex);
  }

  // 3. Push to origin gh-pages
  console.log('⬆️ [Auto-Deploy] Pushing to origin/gh-pages...');
  execSync('git push origin gh-pages', { cwd: repoRoot, stdio: 'inherit' });

  // 4. Trigger GitHub Pages build API
  console.log('📡 [Auto-Deploy] Triggering GitHub Pages deployment build API...');
  try {
    const originUrl = execSync('git remote get-url origin', { cwd: repoRoot }).toString().trim();
    const tokenMatch = originUrl.match(/https:\/\/([^@]+)@/);
    const token = tokenMatch ? tokenMatch[1] : process.env.GITHUB_TOKEN;

    if (token) {
      execSync(
        `curl -s -X POST -H "Authorization: Bearer ${token}" -H "Accept: application/vnd.github+json" https://api.github.com/repos/tanishagothwad/Civic-Hero/pages/builds`,
        { cwd: repoRoot, stdio: 'pipe' }
      );
      console.log('✅ [Auto-Deploy] GitHub Pages build queued successfully!');
    }
  } catch (err) {
    console.warn('⚠️ [Auto-Deploy] Note on API trigger:', err.message);
  }

  console.log('🎉 [Auto-Deploy] Done! Live site: https://tanishagothwad.github.io/Civic-Hero/');
} catch (error) {
  console.error('❌ [Auto-Deploy] Deployment failed:', error.message);
  process.exit(1);
}
