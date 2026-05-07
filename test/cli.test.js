import { execFile } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { test } from "node:test";
import assert from "node:assert/strict";

const execFileAsync = promisify(execFile);
const cliPath = join(process.cwd(), "src", "cli.js");

test("CLI add, list, and remove work against an isolated store", async () => {
  const env = await testEnv();

  const add = await runCli(
    ["add", "--title", "OpenAI", "--url", "https://openai.com"],
    env,
  );
  assert.match(add.stdout, /Added 1: OpenAI <https:\/\/openai\.com>/);

  const list = await runCli(["list"], env);
  assert.equal(list.stdout.trim(), "1. OpenAI - https://openai.com");

  const remove = await runCli(["remove", "1"], env);
  assert.match(remove.stdout, /Removed 1: OpenAI <https:\/\/openai\.com>/);

  const empty = await runCli(["list"], env);
  assert.equal(empty.stdout.trim(), "No bookmarks saved.");
});

test("CLI exits non-zero for invalid add input", async () => {
  const env = await testEnv();

  await assert.rejects(
    runCli(["add", "--title", "Broken", "--url", "ftp://example.com"], env),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /valid URL/);
      return true;
    },
  );
});

async function runCli(args, env) {
  return execFileAsync(process.execPath, [cliPath, ...args], { env });
}

async function testEnv() {
  const directory = await mkdtemp(join(tmpdir(), "bookmark-cli-"));
  return {
    ...process.env,
    BOOKMARK_CLI_STORE: join(directory, "bookmarks.json"),
  };
}
