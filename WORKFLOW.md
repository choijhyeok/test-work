---
tracker:
  kind: linear
  project_slug: "f543e08eb7e9"
workspace:
  root: ~/code/workspaces
hooks:
  after_create: |
    git clone "$SYMPHONY_REPO_URL" .
    git fetch origin
    git checkout -B "$SYMPHONY_ISSUE_BRANCH" "origin/$SYMPHONY_BASE_BRANCH"
agent:
  max_concurrent_agents: 10
  max_turns: 20
github:
  repo_url: https://github.com/choijhyeok/test-work.git
  base_branch: main
codex:
  command: codex exec --dangerously-bypass-approvals-and-sandbox "$SYMPHONY_ISSUE_PROMPT"
---

# Workflow: 북마크 CLI를 만들고 싶어. add, list, remove 명령이 필요해

## Goal

북마크 CLI를 만들고 싶어. add, list, remove 명령이 필요해

## Mode

- Goal mode: on

## Startup Answers

- Execution workspace: github
- Linear credentials: exported
- Goal mode: on
- Max concurrent agents: 10
- Max turns: 20

## Authority Checklist

- [ ] Startup questions answered: GitHub branch flow or local worktree flow, Linear credential source, and goal mode.
- [ ] GitHub authority confirmed for branches, worktrees, commits, PRs, and merge checks.
- [ ] Linear authority confirmed for issue creation and status updates.
- [ ] `LINEAR_API_KEY` source confirmed without exposing the secret.
- [ ] `LINEAR_TEAM_ID` confirmed.
- [ ] `LINEAR_PROJECT_URL` or project UUID confirmed when project attachment is required.

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
| LWO-001 | Scaffold bookmark CLI package and storage | serial | - | Todo | HOW-93 | - | package metadata and executable CLI entrypoint exist; bookmark data is persisted in a JSON store under a user-writable path; test isolation can override the data path |
| LWO-002 | Implement add command | parallel | LWO-001 | Backlog | HOW-94 | - | `add` stores a bookmark with title and URL; invalid or duplicate input returns a clear non-zero failure; command behavior is covered by tests |
| LWO-003 | Implement list command | parallel | LWO-001 | Backlog | HOW-95 | - | `list` prints stored bookmarks in deterministic order; empty state is handled cleanly; output is covered by tests |
| LWO-004 | Implement remove command | parallel | LWO-001 | Backlog | HOW-96 | - | `remove` deletes a bookmark by stable identifier or URL; missing targets return a clear non-zero failure; remove behavior is covered by tests |
| LWO-005 | Document and validate bookmark CLI | serial | LWO-002, LWO-003, LWO-004 | Backlog | HOW-97 | - | README shows add/list/remove usage; automated tests pass; manual smoke evidence is recorded |

## Goal Mode Continuation Gate

- [ ] Current workflow acceptance criteria are complete.
- [ ] Review/rework loop has no open findings.
- [ ] Merge readiness is verified.
- [ ] If goal mode is on, Codex has checked whether another workflow slice is needed.
