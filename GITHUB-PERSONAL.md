# Personal GitHub with HTTPS + PAT

You use a **Personal Access Token (PAT)** with **HTTPS** remotes. No SSH key required.

---

## Remote URL (use this pattern)

Put your **GitHub username** in the URL so Git does not pick up the wrong account:

```text
https://Shubham-Printe@github.com/Shubham-Printe/REPO_NAME.git
```

**This repo (React Prep):**

```text
https://Shubham-Printe@github.com/Shubham-Printe/React_Prep.git
```

Fix a repo that still uses SSH or a URL without the username:

```bash
git remote set-url origin https://Shubham-Printe@github.com/Shubham-Printe/React_Prep.git
git remote -v
```

---

## Create the PAT (one-time, or when it expires)

1. In the browser, log in as **`Shubham-Printe`** (not your work account).
2. **Settings → Developer settings → Personal access tokens**
3. Create a token with **`repo`** scope (classic) or fine-grained access that includes **Contents: Read and write** for your repositories.
4. Copy the token once and store it somewhere safe (password manager). GitHub will not show it again.

---

## Push / pull

```bash
cd "/Users/shubhamprinte/Documents/Shubham/React Prep"
git pull
git push
```

When Git asks for credentials:

| Prompt | What to enter |
|--------|----------------|
| **Username** | `Shubham-Printe` |
| **Password** | Your **PAT** (paste the long token). **Not** your GitHub account password. |

GitHub does not accept account passwords for Git over HTTPS.

---

## Credential helper (your machine)

`~/.gitconfig` should **not** rely on confusing Keychain popups for GitHub if you prefer typing the PAT when asked. A simple setup:

```ini
[credential]
	helper = cache --timeout=1
```

That keeps the PAT in memory only for about a second so the next `git push` / `git pull` usually asks again—good if you do not want macOS Keychain involved.

If a dialog says **git-credential-osxkeychain** wants to use Keychain: that dialog wants your **Mac login / Keychain password** to unlock Keychain, **not** your PAT. To avoid that flow entirely, keep the Homebrew Git system config without `osxkeychain` as the default helper, or cancel and fix credential helpers.

---

## Common errors

| Error | Meaning |
|-------|--------|
| **`403`** … **denied** to some other username | Your PAT belongs to another GitHub user (e.g. work). Create a PAT while logged in as **Shubham-Printe** and use that token only for this remote. |
| **`not found`** | Repo missing or no access—check URL and account. |
| **Authentication failed** | Wrong/expired PAT, or username mismatch. Regenerate the token and try again. |

---

## Work vs personal

- **Personal:** `https://Shubham-Printe@github.com/Shubham-Printe/...` + PAT from **Shubham-Printe**.
- **Work:** use a different remote URL and credentials for that employer account—do not reuse the personal PAT.

---

## Optional: SSH instead of PAT

If you later add an SSH key to **Shubham-Printe**, you can switch the remote to `git@github.com:Shubham-Printe/React_Prep.git` (or a `Host` alias in `~/.ssh/config`). PAT and SSH are **either/or** per remote, not both.
