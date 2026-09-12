import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Guards against regression: this project was migrated off jQuery entirely.
// If jQuery (or any of the legacy theme plugins that depended on it) ever
// creeps back in, these tests will fail loudly.

const projectRoot = path.resolve(__dirname, '..');

const SCAN_DIRS = ['src', 'public'];
const IGNORED_DIRS = new Set(['node_modules', 'build', '.git']);
const TEXT_FILE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css']);
const IGNORED_FILENAMES = new Set(['resumeData.json']);
const TEST_FILE_PATTERN = /\.test\.(js|jsx|ts|tsx)$/;

function collectFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    if (IGNORED_FILENAMES.has(entry.name)) continue;
    if (TEST_FILE_PATTERN.test(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(collectFiles(fullPath));
    } else if (TEXT_FILE_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }

  return results;
}

const filesToScan = [
  ...SCAN_DIRS.flatMap((dir) => {
    const fullDir = path.join(projectRoot, dir);
    return fs.existsSync(fullDir) ? collectFiles(fullDir) : [];
  }),
  path.join(projectRoot, 'index.html'),
  path.join(projectRoot, 'package.json'),
].filter((file) => fs.existsSync(file));

describe('jQuery is not used in this project', () => {
  it('has no jQuery, jquery-migrate, or legacy theme plugin files under public/js', () => {
    const jsDir = path.join(projectRoot, 'public', 'js');
    if (!fs.existsSync(jsDir)) return;

    const files = fs.readdirSync(jsDir).map((f) => f.toLowerCase());
    const bannedFilenames = [
      'jquery',
      'jquery-migrate',
      'jquery.flexslider',
      'jquery.fittext',
      'magnific-popup',
      'waypoints',
      'init.js',
    ];

    for (const banned of bannedFilenames) {
      const match = files.find((f) => f.includes(banned));
      expect(match, `Found legacy jQuery-dependent file: ${match}`).toBeUndefined();
    }
  });

  it('has no jQuery dependency declared in package.json', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')
    );
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(allDeps).some((name) => /jquery/i.test(name))).toBe(false);
  });

  it('does not reference jQuery ($ or window.jQuery) anywhere in source, public, or index.html', () => {
    const jqueryPatterns = [
      /\bjQuery\b/,
      /window\.\$\b/,
      /\$\(document\)\.ready/,
      /\$\(['"]/, // e.g. $('.selector')
      /ajax\.googleapis\.com\/ajax\/libs\/jquery/,
    ];

    const offenders = [];

    for (const file of filesToScan) {
      const contents = fs.readFileSync(file, 'utf8');
      for (const pattern of jqueryPatterns) {
        if (pattern.test(contents)) {
          offenders.push(`${path.relative(projectRoot, file)} matched ${pattern}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('does not load jQuery from a CDN or local script tag in index.html', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
    expect(html.toLowerCase()).not.toMatch(/jquery/);
  });

  it('has no global window.jQuery or window.$ set at runtime', () => {
    expect(typeof window.jQuery).toBe('undefined');
    expect(typeof window.$).toBe('undefined');
  });
});
