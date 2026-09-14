import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Architecture tests: enforce structural conventions that behavioral unit
// tests don't check. These fail fast if someone reintroduces patterns this
// codebase deliberately moved away from (jQuery, class components,
// ReactDOM.render) or drops a convention it depends on (PropTypes on every
// component). Unlike a test named "...without jQuery", these assert on the
// actual source text, so a regression can't slip through un-flagged.

const SRC_DIR = join(process.cwd(), 'src');
const COMPONENTS_DIR = join(SRC_DIR, 'Components');

function readAllSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readAllSourceFiles(fullPath));
    } else if (/\.jsx?$/.test(entry.name) && !entry.name.endsWith('.test.jsx') && !entry.name.endsWith('.test.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

const sourceFiles = readAllSourceFiles(SRC_DIR);
const componentFiles = readdirSync(COMPONENTS_DIR)
  .filter((name) => name.endsWith('.jsx') && !name.endsWith('.test.jsx'))
  .map((name) => join(COMPONENTS_DIR, name));

describe('Architecture: no jQuery', () => {
  it('does not depend on jquery in package.json', () => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(allDeps)).not.toContain('jquery');
  });

  it.each(sourceFiles.map((file) => [file]))('does not reference jQuery in %s', (file) => {
    const contents = readFileSync(file, 'utf-8');
    expect(contents).not.toMatch(/\bjQuery\b|\$\(document\)|\$\.ajax/);
  });
});

describe('Architecture: React 19 function-component conventions', () => {
  it.each(sourceFiles.map((file) => [file]))('does not use class components in %s', (file) => {
    const contents = readFileSync(file, 'utf-8');
    expect(contents).not.toMatch(/extends\s+(React\.)?Component\b/);
  });

  it('does not use the legacy ReactDOM.render API anywhere', () => {
    const legacyRenderUsage = sourceFiles.filter((file) => {
      const contents = readFileSync(file, 'utf-8');
      return /ReactDOM\.render\s*\(/.test(contents);
    });
    expect(legacyRenderUsage).toEqual([]);
  });

  it('bootstraps with createRoot in src/index.jsx', () => {
    const contents = readFileSync(join(SRC_DIR, 'index.jsx'), 'utf-8');
    expect(contents).toMatch(/createRoot\s*\(/);
  });
});

describe('Architecture: every Components/*.jsx exports PropTypes', () => {
  it.each(componentFiles.map((file) => [file]))('%s defines .propTypes', (file) => {
    const contents = readFileSync(file, 'utf-8');
    expect(contents).toMatch(/\.propTypes\s*=/);
  });
});

describe('Architecture: no leftover debug statements', () => {
  it.each(sourceFiles.map((file) => [file]))('does not call console.log or debugger in %s', (file) => {
    const contents = readFileSync(file, 'utf-8');
    expect(contents).not.toMatch(/console\.log\s*\(/);
    expect(contents).not.toMatch(/\bdebugger\b/);
  });
});
