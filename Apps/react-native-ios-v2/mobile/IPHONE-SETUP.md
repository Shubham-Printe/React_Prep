# Run Media Demo on your iPhone — every step

Do these **in order**. Don’t skip.

---

## Part A — Mac (one-time prep)

1. **Open Terminal** (or use the terminal in Cursor).

2. **Use Node 20** (this project breaks on Node 18).

   If you use **nvm**:
   ```bash
   nvm install 20
   nvm use 20
   ```
   Check:
   ```bash
   node -v
   ```
   You should see **v20.x.x**.

   If you don’t use nvm: install **Node 20 LTS** from https://nodejs.org , then open a **new** terminal and run `node -v` again.

3. **Go to the app folder:**
   ```bash
   cd "/Users/shubhamprinte/Documents/Shubham/React Prep/Apps/react-native-ios-v2/mobile"
   ```

4. **Pin Node 20 in this folder (optional but recommended):**
   ```bash
   nvm use
   ```
   (Uses the `.nvmrc` file in this folder.)

5. **Install dependencies:**
   ```bash
   npm install
   ```

6. **Create a free Expo account** (if you don’t have one):  
   Open https://expo.dev in a browser → **Sign up**.

7. **Log in on the Mac:**
   ```bash
   npx expo login
   ```
   Enter the **same** email/password as on expo.dev.

---

## Part B — iPhone (one-time prep)

8. On the iPhone, open the **App Store**.

9. Search for **Expo Go** and **install** it.

10. Open **Expo Go** and **sign in** with the **same** Expo account you used in step 7.

---

## Part C — Run the app (every time you develop)

11. On the Mac, in the app folder, **Node 20 must be active:**
    ```bash
    cd "/Users/shubhamprinte/Documents/Shubham/React Prep/Apps/react-native-ios-v2/mobile"
    nvm use
    ```
    (Skip `nvm use` if you don’t use nvm, as long as `node -v` is 20+.)

12. **Start the dev server:**
    ```bash
    npm start
    ```
    Wait until you see a **QR code** in the terminal.

13. Put **iPhone and Mac on the same Wi‑Fi** (same network name).

14. On the iPhone, open the **Camera** app (Apple’s built-in Camera).

15. **Point the camera at the QR code** on your Mac screen. A banner should appear — **tap it** to open in **Expo Go**.

16. Wait for the app to **bundle and load** (first time can take a minute).

---

## If step 15–16 fails (can’t connect)

17. Go back to the **terminal** where `npm start` is running.

18. Press **`s`** on the keyboard to switch connection to **tunnel**.

19. **Scan the new QR code** again with the iPhone Camera app.

---

## Part D — Camera and microphone

20. In the app, open the **Voice** tab. When iOS asks, tap **Allow** for the **microphone**.

21. Open the **Camera** tab. When iOS asks, tap **Allow** for the **camera** (and **microphone** if asked, for video).

22. If you already tapped **Don’t Allow** before:  
    **Settings → Expo Go** → turn **Microphone** and **Camera** **ON**.

---

## Part E — Voice → AI notes (Groq, **no backend**)

Transcription and note generation call **Groq** directly from the **native** app (Expo Go on iPhone). That does **not** work from **Safari/Chrome on your Mac** (browser CORS blocks it).

23. On the Mac, in the same `mobile` folder, create or edit **`.env`** (copy from `.env.example` if needed):
    ```bash
    EXPO_PUBLIC_GROQ_API_KEY=gsk_your_key_here
    ```
    Get a key at [console.groq.com/keys](https://console.groq.com/keys).

24. Restart Metro with a clean cache so the env var loads:
    ```bash
    npx expo start -c
    ```

25. Open the project on the **iPhone** (Expo Go, QR or tunnel as in Part C). Go to **Voice**, record one or more clips, then tap **Generate AI note from all clips**.

---

## Checklist summary

| # | Done? | Step |
|---|-------|------|
| 1 | ☐ | Node 20 (`node -v`) |
| 2 | ☐ | `cd` to `mobile` folder |
| 3 | ☐ | `npm install` |
| 4 | ☐ | Expo account + `npx expo login` |
| 5 | ☐ | Expo Go installed + signed in on iPhone |
| 6 | ☐ | Same Wi‑Fi |
| 7 | ☐ | `npm start` |
| 8 | ☐ | Scan QR with Camera app → Expo Go |
| 9 | ☐ | If needed: press `s` (tunnel), scan again |
| 10 | ☐ | Allow mic + camera in app / Settings |
| 11 | ☐ | Optional AI: `.env` with `EXPO_PUBLIC_GROQ_API_KEY`, then `npx expo start -c` |
| 12 | ☐ | Test **Generate AI note** on **iPhone** (not in Mac browser) |

---

**You do not need Xcode** for this path.
