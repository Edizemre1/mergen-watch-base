export type Stance = "Bullish" | "Neutral" | "Risky" | "Avoid";

export type BadgeTone = "green" | "cyan" | "amber" | "rose" | "violet";

export type ResearchBadge = {
  label: string;
  description: string;
  tone: BadgeTone;
};

export type Token = {
  address: string;
  symbol: string;
  name: string;
  sector: string;
  chain: "Base";
  summary: string;
  price: number;
  change24h: number;
  change7d: number;
  liquidityUsd: number;
  holders: number;
  socialVelocity: number;
  contractRisk: number;
  volatility: number;
  mentions: number;
  followers: number;
  watchScoreInputs: {
    communityConviction: number;
    researchDepth: number;
    liquidityConfidence: number;
    riskControl: number;
    momentum: number;
  };
};

export type UserProfile = {
  address: string;
  handle: string;
  displayName: string;
  role: string;
  avatar: string;
  bio: string;
  joined: string;
  followers: number;
  following: number;
  reputation: number;
  badges: ResearchBadge[];
  watchlistIds: string[];
};

export type WatchlistEntry = {
  tokenAddress: string;
  stance: Stance;
  conviction: number;
  entryPrice: number;
  currentPrice: number;
  addedAt: string;
  thesis: string;
  riskNote: string;
};

export type Watchlist = {
  id: string;
  title: string;
  ownerAddress: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  followers: number;
  horizon: string;
  tags: string[];
  entries: WatchlistEntry[];
};

export type CommentTarget = "token" | "watchlist";

export type Comment = {
  id: string;
  authorAddress: string;
  targetType: CommentTarget;
  targetId: string;
  stance?: Stance;
  body: string;
  createdAt: string;
  likes: number;
};
