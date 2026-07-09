# Mergen Watch Base

Mergen Watch Base is a public demo and proof-of-build for **Mergen Watch League**: a Base-native social squad and watchlist game prototype.

Live demo: https://mergen-watch-base.vercel.app

GitHub repo: https://github.com/Edizemre1/mergen-watch-base

## What It Is

Mergen Watch League turns Base token discovery into a simple browser-game loop:

- Pick Base token characters.
- Build a weekly squad.
- Earn mock XP and points.
- Climb a weekly leaderboard.
- Create a mock watcher profile.

The demo keeps the social watchlist idea from Mergen Watch, but presents it as a more playful product: collectible token cards, squad slots, seasonal scoring, and profile identity.

## Current Demo Features

- Mock squad builder with five token slots
- Token add and remove flow
- Persistent squad state with localStorage
- Premium token character cards using existing assets
- Mock wallet connect and disconnect flow
- Wallet-keyed mock profile and avatar setup
- Weekly XP, points, rank, and leaderboard panels
- English and Turkish language toggle
- Public Vercel deployment

## What Is Mocked

This is a frontend-only public demo. It intentionally does not include:

- Real swaps
- Real wallet transactions
- Real wallet libraries
- Onchain writes
- Live token indexing
- Financial advice
- Production credentials, API keys, private keys, or seed phrases

All tokens, scores, profiles, leaderboards, wallet state, comments, and performance numbers are mock data or local browser state.

## Why It Exists

Base has a fast-moving token ecosystem where social context, community conviction, and public watchlists can become useful discovery signals. Mergen Watch League explores how those signals could become a clearer product experience:

- More understandable than a dense trading dashboard
- More social than a static token list
- More game-like than a generic watchlist
- Ready to evolve toward future onchain identity, badges, and attestations

## Routes

- `/`
- `/watch`
- `/watch/profile/[address]`
- `/watch/list/[id]`
- `/watch/token/[address]`

## Future Roadmap

- Real wallet connect
- Base Sepolia testing
- `MergenWatchRegistry` contract
- Builder Code attribution
- Onchain badges and achievements
- Real scoring and token indexing
- Public leaderboard seasons
- Private production version for deeper product development

## Safety Notes

Community signals are not financial advice. Watchlist performance is informational. Users should verify liquidity, contract risk, and volatility before trading. This public demo does not execute swaps, submit transactions, or guarantee returns.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Validation:

```bash
npm run lint
npm run build
```

On Windows PowerShell systems with script execution disabled:

```bash
npm.cmd run lint
npm.cmd run build
```

## Secrets Policy

Do not commit secrets. This public demo should remain safe to run without API keys, private keys, seed phrases, production credentials, or privileged environment variables.
