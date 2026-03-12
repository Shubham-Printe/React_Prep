# Use personal GitHub for this repo (HTTPS, no SSH)

Use **personal** name/email and **personal** GitHub for this repo only. No SSH keys.

---

## One-time setup (this repo)

Run from the **repo root** (replace placeholders):

```bash
cd "/Users/shubhamprinte/Documents/Shubham/React Prep"

# 1. Personal identity for commits (this repo only)
git config --local user.name "Your Personal Name"
git config --local user.email "your-personal@gmail.com"

# 2. Store credentials for this repo only (so work creds aren’t used)
git config --local credential.helper store

# 3. Personal remote (use your repo URL; create repo on GitHub first if needed)
git remote add origin https://github.com/YOUR_USERNAME/React-Prep.git
# If origin already exists:
# git remote set-url origin https://github.com/YOUR_USERNAME/React-Prep.git
```

First time you **push** or **pull**, Git will ask for:
- **Username:** your personal GitHub username  
- **Password:** a [Personal Access Token](https://github.com/settings/tokens) (repo scope), not your GitHub password  

Those are saved only for this repo’s URL. Other repos keep using work credentials.

---

## Repeat for another repo

Same pattern for any repo where you want personal GitHub:

```bash
cd /path/to/other-repo
git config --local user.name "Your Personal Name"
git config --local user.email "your-personal@gmail.com"
git config --local credential.helper store
git remote set-url origin https://github.com/YOUR_USERNAME/other-repo.git
```

Then push/pull once and enter personal username + PAT when prompted.
