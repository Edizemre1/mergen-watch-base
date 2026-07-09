import type { Comment, Token, UserProfile, Watchlist } from "./types";

export const baseTokens: Token[] = [
  {
    address: "0x0000000000000000000000000000000000000a01",
    symbol: "AERO",
    name: "Aerodrome Finance",
    sector: "Base liquidity",
    chain: "Base",
    summary:
      "Liquidity hub exposure with strong Base-native distribution and recurring governance catalysts.",
    price: 1.42,
    change24h: 3.2,
    change7d: 14.8,
    liquidityUsd: 212_400_000,
    holders: 168_300,
    socialVelocity: 82,
    contractRisk: 24,
    volatility: 58,
    mentions: 12_840,
    followers: 32_400,
    watchScoreInputs: {
      communityConviction: 86,
      researchDepth: 78,
      liquidityConfidence: 91,
      riskControl: 70,
      momentum: 84,
    },
  },
  {
    address: "0x0000000000000000000000000000000000000b07",
    symbol: "BRETT",
    name: "Brett",
    sector: "Base culture",
    chain: "Base",
    summary:
      "High mindshare culture token with durable retail attention and elevated volatility.",
    price: 0.093,
    change24h: -1.4,
    change7d: 8.6,
    liquidityUsd: 86_900_000,
    holders: 735_000,
    socialVelocity: 88,
    contractRisk: 36,
    volatility: 77,
    mentions: 21_500,
    followers: 154_200,
    watchScoreInputs: {
      communityConviction: 91,
      researchDepth: 54,
      liquidityConfidence: 75,
      riskControl: 48,
      momentum: 80,
    },
  },
  {
    address: "0x0000000000000000000000000000000000000705",
    symbol: "TOSHI",
    name: "Toshi",
    sector: "Base social",
    chain: "Base",
    summary:
      "Community-heavy Base social token with sticky comment volume and watchlist overlap.",
    price: 0.00034,
    change24h: 5.6,
    change7d: 21.1,
    liquidityUsd: 41_250_000,
    holders: 298_700,
    socialVelocity: 79,
    contractRisk: 42,
    volatility: 83,
    mentions: 17_930,
    followers: 92_100,
    watchScoreInputs: {
      communityConviction: 84,
      researchDepth: 49,
      liquidityConfidence: 64,
      riskControl: 45,
      momentum: 88,
    },
  },
  {
    address: "0x0000000000000000000000000000000000000d67",
    symbol: "DEGEN",
    name: "Degen",
    sector: "Social protocol",
    chain: "Base",
    summary:
      "Social token with strong builder network relevance and shifting reward-cycle sensitivity.",
    price: 0.0068,
    change24h: 0.9,
    change7d: -3.2,
    liquidityUsd: 58_300_000,
    holders: 512_000,
    socialVelocity: 71,
    contractRisk: 33,
    volatility: 68,
    mentions: 15_120,
    followers: 131_000,
    watchScoreInputs: {
      communityConviction: 76,
      researchDepth: 68,
      liquidityConfidence: 72,
      riskControl: 61,
      momentum: 57,
    },
  },
  {
    address: "0x0000000000000000000000000000000000000f10",
    symbol: "VIRTUAL",
    name: "Virtuals Protocol",
    sector: "AI agents",
    chain: "Base",
    summary:
      "AI agent infrastructure narrative with strong research depth and crowded positioning.",
    price: 2.18,
    change24h: 2.1,
    change7d: 11.4,
    liquidityUsd: 134_800_000,
    holders: 221_500,
    socialVelocity: 74,
    contractRisk: 29,
    volatility: 64,
    mentions: 9_720,
    followers: 78_500,
    watchScoreInputs: {
      communityConviction: 79,
      researchDepth: 84,
      liquidityConfidence: 82,
      riskControl: 69,
      momentum: 76,
    },
  },
  {
    address: "0x0000000000000000000000000000000000000444",
    symbol: "HIGHER",
    name: "Higher",
    sector: "Creator economy",
    chain: "Base",
    summary:
      "Creator-led community asset with improving distribution and thin liquidity windows.",
    price: 0.041,
    change24h: -4.8,
    change7d: -12.5,
    liquidityUsd: 12_700_000,
    holders: 86_400,
    socialVelocity: 62,
    contractRisk: 48,
    volatility: 81,
    mentions: 6_430,
    followers: 44_800,
    watchScoreInputs: {
      communityConviction: 69,
      researchDepth: 58,
      liquidityConfidence: 46,
      riskControl: 42,
      momentum: 38,
    },
  },
  {
    address: "0x0000000000000000000000000000000000000c47",
    symbol: "KEYCAT",
    name: "Keyboard Cat",
    sector: "Meme liquidity",
    chain: "Base",
    summary:
      "Fast-moving meme asset with narrow order-book tolerance and active holder chatter.",
    price: 0.0039,
    change24h: 6.9,
    change7d: 18.7,
    liquidityUsd: 9_450_000,
    holders: 54_900,
    socialVelocity: 66,
    contractRisk: 52,
    volatility: 89,
    mentions: 4_890,
    followers: 28_200,
    watchScoreInputs: {
      communityConviction: 73,
      researchDepth: 36,
      liquidityConfidence: 39,
      riskControl: 34,
      momentum: 79,
    },
  },
  {
    address: "0x0000000000000000000000000000000000000ca9",
    symbol: "CAW",
    name: "Crow with Knife",
    sector: "Base meme",
    chain: "Base",
    summary:
      "Fast social meme asset with high comment velocity and sharp weekly sentiment swings.",
    price: 0.000000084,
    change24h: 4.4,
    change7d: 16.3,
    liquidityUsd: 18_600_000,
    holders: 96_200,
    socialVelocity: 83,
    contractRisk: 46,
    volatility: 86,
    mentions: 8_720,
    followers: 61_400,
    watchScoreInputs: {
      communityConviction: 80,
      researchDepth: 43,
      liquidityConfidence: 52,
      riskControl: 39,
      momentum: 82,
    },
  },
  {
    address: "0x0000000000000000000000000000000000000d09",
    symbol: "DOGINME",
    name: "doginme",
    sector: "Base culture",
    chain: "Base",
    summary:
      "Base-native culture token with persistent retail mindshare and active squad overlap.",
    price: 0.00072,
    change24h: 2.8,
    change7d: 12.9,
    liquidityUsd: 24_900_000,
    holders: 142_700,
    socialVelocity: 77,
    contractRisk: 41,
    volatility: 74,
    mentions: 11_360,
    followers: 83_500,
    watchScoreInputs: {
      communityConviction: 82,
      researchDepth: 47,
      liquidityConfidence: 58,
      riskControl: 44,
      momentum: 78,
    },
  },
];

export const users: UserProfile[] = [
  {
    address: "0x7a1a000000000000000000000000000000000001",
    handle: "base_signal",
    displayName: "Base Signal Desk",
    role: "Liquidity researcher",
    avatar: "BS",
    bio: "Tracks Base-native liquidity, emissions, social velocity, and risk-adjusted watchlist calls.",
    joined: "2026-01-14",
    followers: 18_240,
    following: 312,
    reputation: 92,
    badges: [
      {
        label: "Liquidity Mapper",
        description: "Publishes depth-aware notes before adding tokens.",
        tone: "green",
      },
      {
        label: "Public Thesis",
        description: "Every watchlist entry includes a thesis and risk note.",
        tone: "cyan",
      },
    ],
    watchlistIds: ["base-liquidity-core", "ai-agents-on-base"],
  },
  {
    address: "0x7a1a000000000000000000000000000000000002",
    handle: "onchain_mira",
    displayName: "Mira",
    role: "Social discovery curator",
    avatar: "MR",
    bio: "Compares token comments, holder growth, and creator distribution before sentiment gets crowded.",
    joined: "2026-02-03",
    followers: 12_880,
    following: 508,
    reputation: 86,
    badges: [
      {
        label: "Comment Quality",
        description: "High signal-to-noise ratio across public comments.",
        tone: "violet",
      },
      {
        label: "Early Watch",
        description: "Often flags assets before social velocity peaks.",
        tone: "amber",
      },
    ],
    watchlistIds: ["base-social-radar"],
  },
  {
    address: "0x7a1a000000000000000000000000000000000003",
    handle: "risk_layer",
    displayName: "Risk Layer",
    role: "Contract and volatility reviewer",
    avatar: "RL",
    bio: "Scores community signals against volatility, liquidity depth, and contract concentration risk.",
    joined: "2025-12-19",
    followers: 9_740,
    following: 221,
    reputation: 81,
    badges: [
      {
        label: "Risk Notes",
        description: "Risk copy is attached to every public stance.",
        tone: "rose",
      },
      {
        label: "Neutral Calls",
        description: "Uses Neutral when data is inconclusive.",
        tone: "cyan",
      },
    ],
    watchlistIds: ["base-risk-watch"],
  },
];

export const watchlists: Watchlist[] = [
  {
    id: "base-liquidity-core",
    title: "Base Liquidity Core",
    ownerAddress: users[0].address,
    description:
      "A focused list of Base assets where liquidity depth, protocol usage, and social confirmation line up.",
    createdAt: "2026-04-18",
    updatedAt: "2026-07-06",
    followers: 7_940,
    horizon: "2 to 8 weeks",
    tags: ["liquidity", "protocols", "higher confidence"],
    entries: [
      {
        tokenAddress: baseTokens[0].address,
        stance: "Bullish",
        conviction: 86,
        entryPrice: 1.08,
        currentPrice: baseTokens[0].price,
        addedAt: "2026-06-12",
        thesis:
          "Liquidity incentives and aggregator volume still point toward recurring demand.",
        riskNote:
          "Emissions rotation can compress multiples quickly if fee capture slows.",
      },
      {
        tokenAddress: baseTokens[4].address,
        stance: "Bullish",
        conviction: 78,
        entryPrice: 1.84,
        currentPrice: baseTokens[4].price,
        addedAt: "2026-06-18",
        thesis:
          "Agent narrative has real builder activity and better research depth than most peers.",
        riskNote:
          "Crowded narrative can reverse hard when launches miss expectations.",
      },
      {
        tokenAddress: baseTokens[3].address,
        stance: "Neutral",
        conviction: 54,
        entryPrice: 0.007,
        currentPrice: baseTokens[3].price,
        addedAt: "2026-06-23",
        thesis:
          "Social relevance remains intact, but the next catalyst needs cleaner volume.",
        riskNote:
          "Reward-cycle expectations can distort short-term sentiment.",
      },
    ],
  },
  {
    id: "base-social-radar",
    title: "Base Social Radar",
    ownerAddress: users[1].address,
    description:
      "Community assets with fast comment velocity, creator reach, and visible holder discussion.",
    createdAt: "2026-05-02",
    updatedAt: "2026-07-07",
    followers: 6_380,
    horizon: "1 to 4 weeks",
    tags: ["social", "culture", "momentum"],
    entries: [
      {
        tokenAddress: baseTokens[1].address,
        stance: "Bullish",
        conviction: 74,
        entryPrice: 0.071,
        currentPrice: baseTokens[1].price,
        addedAt: "2026-06-08",
        thesis:
          "Mindshare remains broad enough to absorb rotations while staying Base-native.",
        riskNote:
          "Volatility is high and social drawdowns can move faster than liquidity.",
      },
      {
        tokenAddress: baseTokens[2].address,
        stance: "Risky",
        conviction: 63,
        entryPrice: 0.00027,
        currentPrice: baseTokens[2].price,
        addedAt: "2026-06-21",
        thesis:
          "Comment velocity is accelerating, but the setup is already reflexive.",
        riskNote:
          "Thin liquidity during social spikes increases slippage and drawdown risk.",
      },
      {
        tokenAddress: baseTokens[6].address,
        stance: "Risky",
        conviction: 48,
        entryPrice: 0.0034,
        currentPrice: baseTokens[6].price,
        addedAt: "2026-06-29",
        thesis:
          "Momentum is real, but position sizing needs to reflect meme liquidity limits.",
        riskNote:
          "Order-book depth can disappear during intraday reversals.",
      },
    ],
  },
  {
    id: "base-risk-watch",
    title: "Base Risk Watch",
    ownerAddress: users[2].address,
    description:
      "Tokens where community interest is worth tracking, but liquidity, volatility, or contract factors require caution.",
    createdAt: "2026-05-22",
    updatedAt: "2026-07-05",
    followers: 4_720,
    horizon: "48 hours to 3 weeks",
    tags: ["risk", "volatility", "contract review"],
    entries: [
      {
        tokenAddress: baseTokens[5].address,
        stance: "Avoid",
        conviction: 71,
        entryPrice: 0.053,
        currentPrice: baseTokens[5].price,
        addedAt: "2026-06-19",
        thesis:
          "Creator distribution is promising, but liquidity windows are too narrow for most users.",
        riskNote:
          "Spread and drawdown risk can dominate the social thesis.",
      },
      {
        tokenAddress: baseTokens[6].address,
        stance: "Risky",
        conviction: 58,
        entryPrice: 0.0042,
        currentPrice: baseTokens[6].price,
        addedAt: "2026-07-01",
        thesis:
          "Momentum is visible, but current liquidity makes the signal fragile.",
        riskNote:
          "A small holder rotation can invalidate the setup quickly.",
      },
      {
        tokenAddress: baseTokens[3].address,
        stance: "Neutral",
        conviction: 61,
        entryPrice: 0.0065,
        currentPrice: baseTokens[3].price,
        addedAt: "2026-06-30",
        thesis:
          "The community base is durable, but near-term upside needs a cleaner catalyst.",
        riskNote:
          "Social attention can remain high while price trends sideways.",
      },
    ],
  },
  {
    id: "ai-agents-on-base",
    title: "AI Agents on Base",
    ownerAddress: users[0].address,
    description:
      "A narrower watchlist for Base AI assets where product traction can be compared with public social signals.",
    createdAt: "2026-06-03",
    updatedAt: "2026-07-04",
    followers: 3_960,
    horizon: "1 to 6 weeks",
    tags: ["ai", "agents", "research"],
    entries: [
      {
        tokenAddress: baseTokens[4].address,
        stance: "Bullish",
        conviction: 82,
        entryPrice: 1.62,
        currentPrice: baseTokens[4].price,
        addedAt: "2026-06-04",
        thesis:
          "Research depth and ecosystem integrations are stronger than the average AI token.",
        riskNote:
          "Narrative fatigue could reduce follow-through after major announcements.",
      },
      {
        tokenAddress: baseTokens[0].address,
        stance: "Neutral",
        conviction: 57,
        entryPrice: 1.33,
        currentPrice: baseTokens[0].price,
        addedAt: "2026-06-27",
        thesis:
          "Liquidity exposure helps AI launches, but it is not a pure agent thesis.",
        riskNote:
          "Correlation with broader Base liquidity can dilute the signal.",
      },
    ],
  },
];

export const comments: Comment[] = [
  {
    id: "cmt-001",
    authorAddress: users[1].address,
    targetType: "token",
    targetId: baseTokens[0].address,
    stance: "Bullish",
    body:
      "Fee capture and social velocity are finally pointing in the same direction. I still want to see liquidity hold after the next incentive rotation.",
    createdAt: "2026-07-07T10:18:00Z",
    likes: 84,
  },
  {
    id: "cmt-002",
    authorAddress: users[2].address,
    targetType: "token",
    targetId: baseTokens[1].address,
    stance: "Risky",
    body:
      "The community is strong, but this is not a low-volatility setup. Position sizing matters more than the headline sentiment.",
    createdAt: "2026-07-07T09:41:00Z",
    likes: 66,
  },
  {
    id: "cmt-003",
    authorAddress: users[0].address,
    targetType: "watchlist",
    targetId: "base-social-radar",
    stance: "Neutral",
    body:
      "This list has excellent mindshare coverage. I would separate durable Base culture from short-window momentum trades.",
    createdAt: "2026-07-06T18:22:00Z",
    likes: 51,
  },
  {
    id: "cmt-004",
    authorAddress: users[1].address,
    targetType: "token",
    targetId: baseTokens[2].address,
    stance: "Risky",
    body:
      "Comment velocity is real. The caution is that reflexive token moves need an exit plan before the social peak is obvious.",
    createdAt: "2026-07-06T14:09:00Z",
    likes: 73,
  },
  {
    id: "cmt-005",
    authorAddress: users[2].address,
    targetType: "watchlist",
    targetId: "base-risk-watch",
    stance: "Avoid",
    body:
      "A useful public list because it labels risk directly instead of disguising every signal as bullish.",
    createdAt: "2026-07-05T21:44:00Z",
    likes: 39,
  },
  {
    id: "cmt-006",
    authorAddress: users[0].address,
    targetType: "token",
    targetId: baseTokens[4].address,
    stance: "Bullish",
    body:
      "The agent thesis is stronger when paired with actual integrations. Social volume alone is not enough here.",
    createdAt: "2026-07-05T16:12:00Z",
    likes: 92,
  },
  {
    id: "cmt-007",
    authorAddress: users[1].address,
    targetType: "token",
    targetId: baseTokens[5].address,
    stance: "Neutral",
    body:
      "Creator distribution is improving, but the liquidity profile still makes this a research watch rather than a clean entry.",
    createdAt: "2026-07-04T11:28:00Z",
    likes: 45,
  },
];

export const roadmapItems = [
  "Base Sepolia first for registry tests and wallet UX rehearsal.",
  "MergenWatchRegistry contract later for public watchlist attestations.",
  "Builder Code attribution later for downstream swap attribution.",
  "Paymaster and sponsored transactions later for low-friction watch actions.",
  "Real token price indexing later with liquidity and volatility safeguards.",
  "Comment moderation later before opening public write access.",
  "Future integration with the main Mergen Finance site.",
];

export function getTokenByAddress(address: string) {
  return baseTokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase(),
  );
}

export function getUserByAddress(address: string) {
  return users.find(
    (user) => user.address.toLowerCase() === address.toLowerCase(),
  );
}

export function getWatchlistById(id: string) {
  return watchlists.find((watchlist) => watchlist.id === id);
}

export function getCommentsForToken(address: string) {
  return comments.filter(
    (comment) =>
      comment.targetType === "token" &&
      comment.targetId.toLowerCase() === address.toLowerCase(),
  );
}

export function getCommentsForWatchlist(id: string) {
  return comments.filter(
    (comment) =>
      comment.targetType === "watchlist" && comment.targetId === id,
  );
}

export function getWatchlistsForUser(address: string) {
  return watchlists.filter(
    (watchlist) =>
      watchlist.ownerAddress.toLowerCase() === address.toLowerCase(),
  );
}

export function getWatchlistsForToken(address: string) {
  return watchlists.filter((watchlist) =>
    watchlist.entries.some(
      (entry) => entry.tokenAddress.toLowerCase() === address.toLowerCase(),
    ),
  );
}
