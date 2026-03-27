# Personal GitHub over SSH (one reliable method)

Use **only SSH** with a **dedicated key** and the host alias **`github-personal`**. No PAT, no HTTPS URLs, no Git credential prompts for GitHub on personal repos.

---

## What you use every time

**Remote URL pattern for personal repos:**

```text
git@github-personal:Shubham-Printe/REPO_NAME.git
```

**Examples:**

```bash
# Check connection (expect: Hi Shubham-Printe!)
ssh -T git@github-personal

# Fix a repo that still uses HTTPS
git remote set-url origin git@github-personal:Shubham-Printe/React_Prep.git

git push
git pull
```

---

## One-time setup (do in order)

### 1. Log into the right GitHub account

In the browser, be logged in as **`Shubham-Printe`** (not your work / Hartley account).

### 2. Register your public key on GitHub

1. GitHub: **Settings → SSH and GPG keys → New SSH key**
2. Copy your **public** key to the clipboard:

   ```bash
   pbcopy < ~/.ssh/id_ed25519_personal.pub
   ```

3. Paste into GitHub and save.

**Important:** The key must be on the **same** GitHub user that owns the repo (here: `Shubham-Printe`).

### 3. Load the private key (macOS)

First time, or after reboot if needed:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_personal
```

### 4. Verify

```bash
ssh -T git@github-personal
```

You should see a message like **Hi Shubham-Printe!** followed by permission success.

If you see **`Permission denied (publickey)`**, the key is missing from GitHub, on the wrong account, or the wrong key was pasted—fix step 2.

---

## SSH config (reference)

Your `~/.ssh/config` should include something like:

```sshconfig
# Personal GitHub only — remotes: git@github-personal:OWNER/REPO.git
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes
  AddKeysToAgent yes
  UseKeychain yes
```

- **`IdentitiesOnly yes`** — GitHub only gets this key (avoids sending the wrong key when you have several).
- **`AddKeysToAgent` / `UseKeychain`** — macOS can remember the key in the login keychain after you unlock it once (this is **not** HTTPS/PAT).

---

## Work vs personal

| | Personal | Work |
|---|----------|------|
| **Host in remote** | `github-personal` | `github.com` or a separate `Host` (e.g. `github-work`) |
| **Key** | `~/.ssh/id_ed25519_personal` | Your work key / HTTPS / company tooling |
| **Remote example** | `git@github-personal:Shubham-Printe/React_Prep.git` | Whatever your employer documents |

Do **not** point **`github-personal`** at work. Do **not** use `https://github.com/...` for personal repos if you want this single, repeatable flow.

---

## New personal repo from GitHub

After creating a repo on GitHub as **Shubham-Printe**, clone with:

```bash
git clone git@github-personal:Shubham-Printe/NEW_REPO.git
```

---

## Troubleshooting

| Problem | What to check |
|--------|----------------|
| `Permission denied (publickey)` | Public key added on **Shubham-Printe**? Correct `.pub` file? Run `ssh-add --apple-use-keychain ~/.ssh/id_ed25519_personal` |
| Wrong GitHub user on push | Remote must use `github-personal`, not a URL that picks up another key |
| Still asks for HTTPS password | `git remote -v` — switch to `git@github-personal:...` |

---

## Homebrew Git note

If `/opt/homebrew/etc/gitconfig` was changed to drop the default `osxkeychain` helper, a future `brew upgrade git` might restore it. Your personal Git flow above does **not** depend on HTTPS credentials for GitHub.

---

## This workspace

**React Prep** remote should be:

```text
git@github-personal:Shubham-Printe/React_Prep.git
```

Confirm:

```bash
git remote -v
```
