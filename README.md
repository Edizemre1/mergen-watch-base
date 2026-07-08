# Mergen Watch Base

Mergen Watch Base is a standalone public demo for a Base-native weekly squad
game called Mergen Watch League.

The product lets visitors build a weekly Base token squad, inspect collectible
token character cards, follow mock performance scoring, earn XP and badges, and
climb a weekly leaderboard. It still keeps the social watchlist DNA, but the v4
direction is a browser-game-style product lobby rather than a crypto dashboard.

## Why It Exists

Base has a fast-moving token ecosystem where social context, liquidity quality,
contract risk, and community conviction often move before polished research
does. Mergen Watch League explores how watchlist performance could become a
simple game loop:

- Pick 3 to 5 Base tokens for a weekly squad.
- Each token appears as a character-style card with stance, XP, points, level,
  and weekly performance.
- Watchlist performance powers mock weekly scoring.
- Players earn badges such as Win Streak, Early Watcher, Token Scout, Squad
  Builder, High Roller, and Veteran.
- Profiles preview future wallet identities, XP history, and market reputation.
- Future versions could mint onchain badges and season achievements.

## Current Demo Status

This repository is an MVP demo built with Next.js, TypeScript, Tailwind CSS,
App Router, ESLint, and npm.

Everything is local and mocked. The app does not connect to wallets, execute
swaps, call token APIs, index live prices, submit comments, or write onchain
state.

The League interface is still mock data only. It does not execute real swaps,
wallet transactions, badge minting, or onchain writes.

The current UI is simplified around a squad-builder-first experience: pick Base
tokens, build a five-slot squad, earn weekly XP, and climb the leaderboard.

The UI supports English and Turkish through a small internal dictionary and a
visible EN / TR toggle. English is the default language because the public demo
is aimed at the Base builder ecosystem. Turkish support is included for local
product review and stakeholder feedback.

## Routes

- `/`
- `/watch`
- `/watch/profile/[address]`
- `/watch/list/[id]`
- `/watch/token/[address]`

## What Is Mocked

- Base tokens, addresses, prices, liquidity, holders, followers, mentions, and
  volatility
- User profiles, followers, reputation, and research badges
- Weekly squads, token character cards, stance badges, XP, points, and levels
- Watchlists, thesis notes, risk notes, and conviction scores
- Activity feed events, likes, badges, and leaderboard ranks
- Watchlist performance, hit rate, best call, worst call, and Mergen Watch Score

No real API keys, private keys, seed phrases, or wallet transaction flows are
required or included.

## Performance Utilities

The app includes utilities for:

- Watchlist performance
- Stance-aware hit rate
- Best call
- Worst call
- Mergen Watch Score

These calculations are informational and run only against the mock dataset.

## Future Onchain Roadmap

The intended onchain path is deliberately staged:

1. Base Sepolia first for registry tests and wallet UX rehearsal.
2. `MergenWatchRegistry` contract later for public watchlist attestations.
3. Builder Code attribution later for downstream swap attribution.
4. Paymaster and sponsored transactions later for low-friction watch actions.
5. Real token price indexing later with liquidity and volatility safeguards.
6. Comment moderation later before public write access.
7. Future integration with the main Mergen Finance site.

## Safety Notes

Community signals are not financial advice. Watchlist performance is
informational. Users should verify liquidity, contract risk, and volatility
before trading. This demo does not execute swaps or guarantee returns.

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Validation commands:

```bash
npm run lint
npm run build
```

On Windows PowerShell systems with script execution disabled, use:

```bash
npm.cmd run lint
npm.cmd run build
```

## Secrets Policy

Do not commit secrets. This demo should remain safe to run publicly without
API keys, private keys, seed phrases, production credentials, or privileged
environment variables.
