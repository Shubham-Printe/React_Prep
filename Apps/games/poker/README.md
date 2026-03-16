# Poker Assistant

Frontend-only Next.js app to **track chips, bets, and pot** when playing poker with physical cards and no chips.

- Set **number of players**, names, and starting stack.
- Configure **rules**: game variant (Texas Hold'em, Omaha, Short Deck), small/big blind, min raise.
- During the hand: see **pot**, each player’s **stack** and **current bet**, and who’s to act.
- **Actions**: Fold, Call, Bet/Raise; advance to next street (Flop, Turn, River); start a new hand or go back to setup.

No backend; state lives in React context. Run `npm install` then `npm run dev` and open the app in the browser.
