# Git Core Concepts & Commands – Practical Reference

This document is a concise but deep reference for understanding **how Git actually works internally**, why certain commands exist, and **when to use them safely in real-world team workflows**.

---

## 1. The Fundamental Concept: Commits

### What is a Git commit?

A **commit** is the most fundamental object in Git.

A commit:

* Represents a snapshot of the project at a point in time
* Points to one or more **parent commits**
* Contains metadata (author, timestamp, message)

Git history is a **directed acyclic graph (DAG)** of commits.

> Everything in Git ultimately points to commits.

---

## 2. Branches, HEAD, and Pointers

### Branch

A **branch** is nothing more than a **movable pointer to a commit**.

* Branches do not contain commits
* Commits are not stored inside branches
* Branches simply reference commits

When you make a commit, Git moves the **current branch pointer forward**.

### HEAD

* `HEAD` is a pointer to the **currently checked-out reference**
* Usually points to a branch
* Can point directly to a commit (detached HEAD)

```
commit ← branch ← HEAD
```

---

## 3. Detached HEAD

A **detached HEAD** occurs when HEAD points directly to a commit instead of a branch.

Examples:

```bash
git checkout <commit>
git checkout HEAD~2
git checkout HEAD^
```

Characteristics:

* No branch pointer moves
* Commits made here can be lost
* Useful for inspection and experimentation

Escape hatch:

```bash
git checkout -b new-branch
```

---

## 4. Relative References

Relative refs allow navigation through commit history.

### `^` (caret)

* Refers to a **specific parent**
* Mainly used with merge commits

```bash
HEAD^   # first parent
HEAD^2  # second parent (merge commit only)
```

### `~` (tilde)

* Walks through **first-parent ancestry**

```bash
HEAD~3  # 3 commits back via first parents
```

Key distinction:

* `^` selects a parent
* `~` walks generations

---

## 5. git branch

Used to manage branch pointers.

Capabilities:

* List branches
* Create branches
* Delete branches
* Force-move branch pointers

Examples:

```bash
git branch feature
git branch hotfix HEAD~2
git branch -f main HEAD~3
```

Important:

* `git branch` does **not** move HEAD
* Pointer movement usually happens via commits

---

## 6. git checkout / git switch

Used to move HEAD.

```bash
git checkout branch-name
git checkout <commit>
git checkout -b new-branch
```

Effects:

* Moves HEAD
* Updates working tree
* May detach HEAD

Modern alternative:

```bash
git switch branch-name
git switch -c new-branch
```

---

## 7. git merge

### What merge does

`git merge` **combines histories** of two branches.

Typical usage:

```bash
git checkout main
git merge feature
```

### Merge commit

* Created in a **non–fast-forward merge**
* Has **two parent commits**
* Preserves parallel history

```
A---B---C-------M
     \         /
      D---E---
```

### Why use merge

* Does not rewrite history
* Safe for shared branches
* Shows when parallel work was integrated

Recommended for:

* `main`, `develop`, `release`

---

## 8. Fast-forward vs No-FF Merge

### Fast-forward

Occurs when base branch has not moved.

```
A---B---C---D---E
```

### No-FF merge

Forces a merge commit:

```bash
git merge --no-ff feature
```

Used when history visibility matters.

---

## 9. git rebase

### Purpose

Used to integrate work from one branch onto another **by rewriting history**.

```bash
git checkout feature
git rebase main
```

### What rebase does

* Finds common ancestor
* Takes commits unique to current branch
* Replays them on top of target branch
* Creates new commits with new hashes

### Effects

* Parallel work appears sequential
* Old commits become unreferenced
* Branch being rebased is rewritten

### Rules

* Safe on **private/local branches**
* Dangerous on shared branches

---

## 10. Interactive Rebase (`git rebase -i`)

An interactive version of rebase for history cleanup.

```bash
git rebase -i HEAD~5
```

Git opens the default editor with instructions.

Capabilities:

* Reorder commits
* Drop commits
* Squash commits
* Reword commit messages

Common use case:

* Clean feature branch before PR

---

## 11. git reset

### Purpose

Moves the current branch pointer to a specified commit.

Modes:

| Mode    | Branch | Index     | Working Tree |
| ------- | ------ | --------- | ------------ |
| --soft  | moved  | unchanged | unchanged    |
| --mixed | moved  | reset     | unchanged    |
| --hard  | moved  | reset     | reset        |

Example:

```bash
git reset --hard HEAD~1
```

### Warning

* Rewrites history
* Unsafe for pushed/shared branches

---

## 12. git revert

### Purpose

Safely undo a commit by creating a new commit.

```bash
git revert <commit>
```

Result:

```
A---B---C---R
```

Characteristics:

* Does not remove commits
* Preserves history
* Safe for shared branches

---

## 13. git cherry-pick

### Purpose

Apply a **specific commit** onto the current branch.

```bash
git checkout main
git cherry-pick <commit>
```

### Behavior

* Applies the commit’s diff
* Creates a new commit
* New hash (different parent)

Best used for:

* Hotfixes
* Backports
* Selective fixes

---

## 14. History Safety Net: git reflog

Reflog tracks where HEAD and branches have been.

```bash
git reflog
git reset --hard HEAD@{n}
```

Use reflog to:

* Recover from bad rebase
* Recover deleted commits
* Undo resets

---

## 15. Practical Usage Summary

| Scenario                 | Recommended Command |
| ------------------------ | ------------------- |
| Update feature branch    | rebase              |
| Merge into shared branch | merge               |
| Undo local mistake       | reset               |
| Undo pushed commit       | revert              |
| Pick one commit          | cherry-pick         |
| Clean history            | interactive rebase  |

---

## Final Mental Model

* Commits are immutable graph nodes
* Branches are pointers
* HEAD points to a pointer (or commit)
* Most Git commands move pointers or create new commits

Once this model is internalized, Git becomes predictable rather than magical.

---

**End of Reference**
