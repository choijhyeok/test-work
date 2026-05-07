import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const DEFAULT_STORE = join(homedir(), ".bookmark-cli", "bookmarks.json");

export function getStorePath(env = process.env) {
  return env.BOOKMARK_CLI_STORE || DEFAULT_STORE;
}

export async function loadBookmarks(storePath = getStorePath()) {
  try {
    const data = await readFile(storePath, "utf8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Bookmark store is not valid JSON: ${storePath}`);
    }
    throw error;
  }
}

export async function saveBookmarks(bookmarks, storePath = getStorePath()) {
  await mkdir(dirname(storePath), { recursive: true });
  await writeFile(
    storePath,
    `${JSON.stringify({ bookmarks }, null, 2)}\n`,
    "utf8",
  );
}

export async function addBookmark({ title, url }, storePath = getStorePath()) {
  const cleanTitle = String(title || "").trim();
  const cleanUrl = String(url || "").trim();

  if (!cleanTitle) {
    throw new Error("Title is required.");
  }
  if (!isValidUrl(cleanUrl)) {
    throw new Error("A valid URL is required.");
  }

  const bookmarks = await loadBookmarks(storePath);
  if (bookmarks.some((bookmark) => bookmark.url === cleanUrl)) {
    throw new Error(`Bookmark already exists for ${cleanUrl}.`);
  }

  const bookmark = {
    id: nextId(bookmarks),
    title: cleanTitle,
    url: cleanUrl,
    createdAt: new Date().toISOString(),
  };

  await saveBookmarks([...bookmarks, bookmark], storePath);
  return bookmark;
}

export async function removeBookmark(target, storePath = getStorePath()) {
  const cleanTarget = String(target || "").trim();
  if (!cleanTarget) {
    throw new Error("Bookmark id or URL is required.");
  }

  const bookmarks = await loadBookmarks(storePath);
  const nextBookmarks = bookmarks.filter(
    (bookmark) => String(bookmark.id) !== cleanTarget && bookmark.url !== cleanTarget,
  );

  if (nextBookmarks.length === bookmarks.length) {
    throw new Error(`No bookmark found for ${cleanTarget}.`);
  }

  await saveBookmarks(nextBookmarks, storePath);
  return bookmarks.find(
    (bookmark) => String(bookmark.id) === cleanTarget || bookmark.url === cleanTarget,
  );
}

function nextId(bookmarks) {
  const maxId = bookmarks.reduce((max, bookmark) => {
    return Math.max(max, Number.parseInt(bookmark.id, 10) || 0);
  }, 0);
  return String(maxId + 1);
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
