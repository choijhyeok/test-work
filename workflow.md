# Workflow: Build Bookmark CLI

## Goal

Build a repository-local bookmark command line tool with `add`, `list`, and `remove` commands.

## Mode

- Goal mode: on

## Startup Answers

- Execution workspace: github
- Linear credentials: exported
- Goal mode: on

## Authority Checklist

- [x] Startup questions answered: GitHub issue branch flow, exported Linear credentials, goal mode on.
- [x] GitHub authority confirmed for branch flow against `https://github.com/choijhyeok/test-work`.
- [x] Linear authority confirmed for issue creation/status sync if credentials are visible to this shell.
- [x] `LINEAR_API_KEY` source confirmed without exposing the secret: user says already exported.
- [ ] `LINEAR_TEAM_ID` available in this shell.
- [ ] `LINEAR_PROJECT_URL` or project UUID available in this shell when project attachment is required.

## Status Model

| Status | Meaning |
| --- | --- |
| Backlog | All discovered work before it is selected for execution. |
| Todo | Ready work, including parallel and serial lanes, waiting to start. |
| In Progress | Work actively being implemented. |
| Rework | Follow-up implementation requested after review or failed verification. |
| Review | Review agent checks the developed code and workflow result. |
| Merging | GitHub or local worktree integration and merge readiness. |
| Done | Work is implemented, verified, and no longer active. |
| Canceled | Work explicitly canceled or made obsolete by scope changes. |
| Duplicate | Work excluded because another issue already covers it. |

## Execution Plan

| ID | Title | Lane | Depends On | Status | Linear Issue | Branch/Worktree | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LWO-001 | Scaffold Node bookmark CLI | serial | - | Done | - | issue/lwo-001-scaffold-node-bookmark-cli | `package.json`, executable CLI entrypoint, and ignore rules exist; the CLI can be run locally without installing third-party dependencies. |
| LWO-002 | Implement bookmark storage and commands | serial | LWO-001 | Done | - | issue/lwo-002-implement-bookmark-storage-and-commands | `add <url> [title]`, `list`, and `remove <id>` persist bookmarks in JSON, validate arguments, and return clear exit codes/messages. |
| LWO-003 | Add regression tests | serial | LWO-002 | Done | - | issue/lwo-001-scaffold-node-bookmark-cli | Automated tests cover add/list/remove behavior, validation failures, and isolated data-file usage. |
| LWO-004 | Document usage | parallel | LWO-002 | Done | - | issue/lwo-001-scaffold-node-bookmark-cli | README documents install/run examples, command syntax, data location, and test command. |
| LWO-005 | Review, verify, and prepare merge | serial | LWO-003, LWO-004 | Done | - | issue/lwo-001-scaffold-node-bookmark-cli | Tests pass, CLI smoke checks pass, workflow acceptance criteria are audited, and branch is ready to push/PR. |

## Goal Mode Continuation Gate

- [x] Current workflow acceptance criteria are complete.
- [x] Review/rework loop has no open findings.
- [x] Merge readiness is verified.
- [x] If goal mode is on, Codex has checked whether another workflow slice is needed: current requested CLI scope is complete; no follow-up slice is required for `add`, `list`, and `remove`.
