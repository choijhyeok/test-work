'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const {
  DATA_PATH_ENV,
  ensureStore,
  getDataPath,
  readStore,
  writeStore
} = require('../src/storage');

function tempStorePath() {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bookmark-cli-')), 'store.json');
}

test('data path can be overridden for isolated tests', () => {
  const filePath = tempStorePath();

  assert.equal(getDataPath({ [DATA_PATH_ENV]: filePath }), filePath);
});

test('ensureStore persists an empty JSON bookmark store', () => {
  const filePath = tempStorePath();

  const result = ensureStore(filePath);

  assert.deepEqual(result.store, { bookmarks: [] });
  assert.deepEqual(JSON.parse(fs.readFileSync(filePath, 'utf8')), { bookmarks: [] });
});

test('writeStore and readStore persist bookmark data', () => {
  const filePath = tempStorePath();
  const store = {
    bookmarks: [
      {
        id: '1',
        url: 'https://example.com',
        title: 'Example'
      }
    ]
  };

  writeStore(store, filePath);

  assert.deepEqual(readStore(filePath), store);
});

test('CLI entrypoint initializes the overridden store path', () => {
  const filePath = tempStorePath();
  const result = spawnSync(process.execPath, ['bin/bookmark.js', 'init'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, [DATA_PATH_ENV]: filePath },
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), filePath);
  assert.deepEqual(JSON.parse(fs.readFileSync(filePath, 'utf8')), { bookmarks: [] });
});
