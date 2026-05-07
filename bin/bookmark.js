#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const DATA_FILE =
  process.env.BOOKMARK_CLI_DATA ||
  path.join(os.homedir(), ".bookmark-cli", "bookmarks.json");

function usage() {
  return [
    "Usage:",
    "  bookmark add <url> [title]",
    "  bookmark list",
    "  bookmark remove <id>",
  ].join("\n");
}

function readBookmarks() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    throw new Error(`Could not read bookmark data: ${error.message}`);
  }
}

function writeBookmarks(bookmarks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(bookmarks, null, 2)}\n`);
}

function nextId(bookmarks) {
  return bookmarks.reduce((max, bookmark) => Math.max(max, bookmark.id || 0), 0) + 1;
}

function addBookmark(args) {
  const [url, ...titleParts] = args;
  if (!url) {
    throw new Error("add requires a URL");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`invalid URL: ${url}`);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("URL must start with http:// or https://");
  }

  const bookmarks = readBookmarks();
  const bookmark = {
    id: nextId(bookmarks),
    url: parsedUrl.toString(),
    title: titleParts.join(" ").trim() || parsedUrl.hostname,
    createdAt: new Date().toISOString(),
  };

  bookmarks.push(bookmark);
  writeBookmarks(bookmarks);
  return `Added #${bookmark.id}: ${bookmark.title} (${bookmark.url})`;
}

function listBookmarks() {
  const bookmarks = readBookmarks();
  if (bookmarks.length === 0) {
    return "No bookmarks found.";
  }

  return bookmarks
    .map((bookmark) => `#${bookmark.id} ${bookmark.title} - ${bookmark.url}`)
    .join("\n");
}

function removeBookmark(args) {
  const [idText] = args;
  const id = Number(idText);
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("remove requires a positive numeric id");
  }

  const bookmarks = readBookmarks();
  const nextBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
  if (nextBookmarks.length === bookmarks.length) {
    throw new Error(`bookmark #${id} was not found`);
  }

  writeBookmarks(nextBookmarks);
  return `Removed #${id}.`;
}

function run(argv) {
  const [command, ...args] = argv;

  if (command === "add") {
    return addBookmark(args);
  }
  if (command === "list") {
    return listBookmarks();
  }
  if (command === "remove") {
    return removeBookmark(args);
  }

  throw new Error(command ? `unknown command: ${command}` : "missing command");
}

if (require.main === module) {
  try {
    const output = run(process.argv.slice(2));
    if (output) {
      console.log(output);
    }
  } catch (error) {
    console.error(error.message);
    console.error(usage());
    process.exitCode = 1;
  }
}

module.exports = {
  DATA_FILE,
  addBookmark,
  listBookmarks,
  readBookmarks,
  removeBookmark,
  run,
  usage,
};
