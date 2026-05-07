# Bookmark CLI

A small dependency-free CLI for storing bookmarks in a local JSON file.

## Usage

```bash
bookmark add --title "OpenAI" --url https://openai.com
bookmark list
bookmark remove 1
bookmark remove https://openai.com
```

During development, run the CLI directly with Node:

```bash
node src/cli.js add --title "OpenAI" --url https://openai.com
node src/cli.js list
node src/cli.js remove 1
```

Bookmarks are stored at `~/.bookmark-cli/bookmarks.json` by default. Set
`BOOKMARK_CLI_STORE` to use a different JSON file, which is useful for tests or
isolated manual runs.

## Commands

- `add --title <title> --url <url>` stores a bookmark. URLs must use `http` or
  `https`, and duplicate URLs are rejected.
- `list` prints bookmarks in the order they were added.
- `remove <id-or-url>` deletes a bookmark by its numeric id or exact URL.

## Test

```bash
npm test
```
