# Mergen Watch Base

Mergen Watch Base is a standalone public demo for a Base-native social
watchlist and token research layer.

The product lets visitors browse public Base token watchlists, inspect user
profiles, compare stance-tagged calls, read mock comments, review token-level
social signals, and see informational watchlist performance. It is designed to
feel like a real social research and token discovery surface, not a transaction
farming app.

## Why It Exists

Base has a fast-moving token ecosystem where social context, liquidity quality,
contract risk, and community conviction often move before polished research
does. Mergen Watch Base explores how public watchlists could make those signals
more legible:

- Token pages show social velocity, stance distribution, comments, mock
  liquidity, risk, and a Mergen Watch Score.
- Watchlist pages show thesis notes, risk notes, stance badges, hit rate, best
  call, worst call, and conviction-weighted performance.
- Profile pages show researcher identity, followers, badges, comments, and
  public watchlist history.
- The dashboard gives a compact view of public Base token watchlists and recent
  research comments.

## Current Demo Status

This repository is an MVP demo built with Next.js, TypeScript, Tailwind CSS,
App Router, ESLint, and npm.

Everything is local and mocked. The app does not connect to wallets, execute
swaps, call token APIs, index live prices, submit comments, or write onchain
state.

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
- Watchlists, stance badges, thesis notes, risk notes, and conviction scores
- Comments, likes, and social activity
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
