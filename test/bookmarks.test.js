import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import assert from "node:assert/strict";
import { addBookmark, loadBookmarks, removeBookmark } from "../src/bookmarks.js";

test("addBookmark persists a bookmark to the configured store", async () => {
  const storePath = await tempStore();

  const bookmark = await addBookmark(
    { title: "OpenAI", url: "https://openai.com" },
    storePath,
  );

  assert.equal(bookmark.id, "1");
  assert.equal(bookmark.title, "OpenAI");
  assert.equal(bookmark.url, "https://openai.com");
  assert.deepEqual(await loadBookmarks(storePath), [bookmark]);
});

test("addBookmark rejects duplicate URLs", async () => {
  const storePath = await tempStore();
  await addBookmark({ title: "OpenAI", url: "https://openai.com" }, storePath);

  await assert.rejects(
    addBookmark({ title: "Duplicate", url: "https://openai.com" }, storePath),
    /already exists/,
  );
});

test("loadBookmarks returns bookmarks in stored order", async () => {
  const storePath = await tempStore();
  await addBookmark({ title: "First", url: "https://example.com/1" }, storePath);
  await addBookmark({ title: "Second", url: "https://example.com/2" }, storePath);

  assert.deepEqual(
    (await loadBookmarks(storePath)).map((bookmark) => bookmark.title),
    ["First", "Second"],
  );
});

test("removeBookmark removes by id", async () => {
  const storePath = await tempStore();
  await addBookmark({ title: "First", url: "https://example.com/1" }, storePath);
  await addBookmark({ title: "Second", url: "https://example.com/2" }, storePath);

  const removed = await removeBookmark("1", storePath);

  assert.equal(removed.title, "First");
  assert.deepEqual(
    (await loadBookmarks(storePath)).map((bookmark) => bookmark.title),
    ["Second"],
  );
});

test("removeBookmark removes by URL", async () => {
  const storePath = await tempStore();
  await addBookmark({ title: "First", url: "https://example.com/1" }, storePath);

  const removed = await removeBookmark("https://example.com/1", storePath);

  assert.equal(removed.id, "1");
  assert.deepEqual(await loadBookmarks(storePath), []);
});

test("removeBookmark rejects missing targets", async () => {
  const storePath = await tempStore();

  await assert.rejects(removeBookmark("missing", storePath), /No bookmark found/);
});

test("save format is JSON with a bookmarks array", async () => {
  const storePath = await tempStore();
  await addBookmark({ title: "OpenAI", url: "https://openai.com" }, storePath);

  const parsed = JSON.parse(await readFile(storePath, "utf8"));

  assert.equal(Array.isArray(parsed.bookmarks), true);
});

async function tempStore() {
  const directory = await mkdtemp(join(tmpdir(), "bookmark-cli-"));
  return join(directory, "bookmarks.json");
}
