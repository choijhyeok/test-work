# Bookmark CLI

A small dependency-free Node.js command line tool for storing bookmarks locally.

## Usage

Run it directly from the repository:

```bash
node bin/bookmark.js add https://example.com "Example"
node bin/bookmark.js list
node bin/bookmark.js remove 1
```

Or install/link it as a package and use the `bookmark` command:

```bash
npm link
bookmark add https://example.com "Example"
bookmark list
bookmark remove 1
```

## Commands

- `bookmark add <url> [title]` stores an HTTP or HTTPS URL. When `title` is omitted, the URL hostname is used.
- `bookmark list` prints saved bookmarks by numeric id.
- `bookmark remove <id>` removes the bookmark with that numeric id.

Bookmarks are stored at `~/.bookmark-cli/bookmarks.json` by default. Set `BOOKMARK_CLI_DATA=/path/to/bookmarks.json` to use a different file, which is useful for tests or separate profiles.

## Test

```bash
npm test
```
