#!/usr/bin/env node

import { addBookmark, loadBookmarks, removeBookmark } from "./bookmarks.js";

const [command, ...args] = process.argv.slice(2);

try {
  if (command === "add") {
    const bookmark = await addBookmark(parseAddArgs(args));
    console.log(`Added ${bookmark.id}: ${bookmark.title} <${bookmark.url}>`);
  } else if (command === "list") {
    const bookmarks = await loadBookmarks();
    printBookmarks(bookmarks);
  } else if (command === "remove") {
    const removed = await removeBookmark(args[0]);
    console.log(`Removed ${removed.id}: ${removed.title} <${removed.url}>`);
  } else {
    printUsage();
    process.exitCode = command ? 1 : 0;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

function parseAddArgs(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--title" || arg === "-t") {
      options.title = args[index + 1];
      index += 1;
    } else if (arg === "--url" || arg === "-u") {
      options.url = args[index + 1];
      index += 1;
    } else if (!options.url) {
      options.url = arg;
    } else if (!options.title) {
      options.title = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  return options;
}

function printBookmarks(bookmarks) {
  if (bookmarks.length === 0) {
    console.log("No bookmarks saved.");
    return;
  }

  for (const bookmark of bookmarks) {
    console.log(`${bookmark.id}. ${bookmark.title} - ${bookmark.url}`);
  }
}

function printUsage() {
  console.log(`Usage:
  bookmark add --title "OpenAI" --url https://openai.com
  bookmark list
  bookmark remove <id-or-url>

Environment:
  BOOKMARK_CLI_STORE  Override the JSON store path for tests or custom storage.`);
}
