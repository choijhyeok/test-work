'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const APP_DIR = 'bookmark-cli';
const STORE_FILE = 'bookmarks.json';
const DATA_PATH_ENV = 'BOOKMARK_CLI_DATA_PATH';

function getDefaultDataPath(env = process.env, platform = process.platform) {
  if (platform === 'win32') {
    const base = env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    return path.join(base, APP_DIR, STORE_FILE);
  }

  if (platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', APP_DIR, STORE_FILE);
  }

  const base = env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share');
  return path.join(base, APP_DIR, STORE_FILE);
}

function getDataPath(env = process.env) {
  const override = env[DATA_PATH_ENV];
  return path.resolve(override || getDefaultDataPath(env));
}

function emptyStore() {
  return { bookmarks: [] };
}

function assertStoreShape(value, filePath) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Array.isArray(value.bookmarks)) {
    throw new Error(`Invalid bookmark store at ${filePath}`);
  }
  return value;
}

function readStore(filePath = getDataPath()) {
  if (!fs.existsSync(filePath)) {
    return emptyStore();
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.trim()) {
    return emptyStore();
  }

  return assertStoreShape(JSON.parse(raw), filePath);
}

function writeStore(store, filePath = getDataPath()) {
  assertStoreShape(store, filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const tempPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
  fs.renameSync(tempPath, filePath);
  return store;
}

function ensureStore(filePath = getDataPath()) {
  const store = readStore(filePath);
  writeStore(store, filePath);
  return { path: filePath, store };
}

module.exports = {
  DATA_PATH_ENV,
  emptyStore,
  ensureStore,
  getDataPath,
  getDefaultDataPath,
  readStore,
  writeStore
};
