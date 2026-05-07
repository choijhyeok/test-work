const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawnSync } = require("node:child_process");

const cli = path.join(__dirname, "..", "bin", "bookmark.js");

function runBookmark(args, dataFile) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    env: {
      ...process.env,
      BOOKMARK_CLI_DATA: dataFile,
    },
  });
}

function withDataFile() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bookmark-cli-test-"));
  return path.join(dir, "bookmarks.json");
}

test("add stores a bookmark and list prints it", () => {
  const dataFile = withDataFile();

  const add = runBookmark(["add", "https://example.com/docs", "Example Docs"], dataFile);
  assert.equal(add.status, 0);
  assert.match(add.stdout, /Added #1: Example Docs/);

  const list = runBookmark(["list"], dataFile);
  assert.equal(list.status, 0);
  assert.equal(list.stdout.trim(), "#1 Example Docs - https://example.com/docs");
});

test("add defaults title to hostname", () => {
  const dataFile = withDataFile();

  const add = runBookmark(["add", "https://example.com/path"], dataFile);
  assert.equal(add.status, 0);

  const bookmarks = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  assert.equal(bookmarks[0].title, "example.com");
});

test("remove deletes an existing bookmark", () => {
  const dataFile = withDataFile();

  runBookmark(["add", "https://example.com", "Example"], dataFile);
  const remove = runBookmark(["remove", "1"], dataFile);
  assert.equal(remove.status, 0);
  assert.match(remove.stdout, /Removed #1/);

  const list = runBookmark(["list"], dataFile);
  assert.equal(list.status, 0);
  assert.equal(list.stdout.trim(), "No bookmarks found.");
});

test("invalid input exits with an error", () => {
  const dataFile = withDataFile();

  const add = runBookmark(["add", "ftp://example.com"], dataFile);
  assert.equal(add.status, 1);
  assert.match(add.stderr, /URL must start with http/);

  const remove = runBookmark(["remove", "missing"], dataFile);
  assert.equal(remove.status, 1);
  assert.match(remove.stderr, /positive numeric id/);
});
