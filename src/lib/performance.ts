import type { Comment, Token, Watchlist, WatchlistEntry } from "./types";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const round = (value: number, decimals = 1) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export function getEntryReturnPct(entry: WatchlistEntry) {
  if (entry.entryPrice === 0) {
    return 0;
  }

  return round(((entry.currentPrice - entry.entryPrice) / entry.entryPrice) * 100);
}

export function getCallScore(entry: WatchlistEntry) {
  const returnPct = getEntryReturnPct(entry);

  if (entry.stance === "Avoid") {
    return round(-returnPct);
  }

  if (entry.stance === "Neutral") {
    return round(8 - Math.abs(returnPct));
  }

  if (entry.stance === "Risky") {
    return round(returnPct - (100 - entry.conviction) * 0.08);
  }

  return returnPct;
}

export function isHit(entry: WatchlistEntry) {
  const returnPct = getEntryReturnPct(entry);

  if (entry.stance === "Bullish") {
    return returnPct > 0;
  }

  if (entry.stance === "Avoid") {
    return returnPct < 0;
  }

  if (entry.stance === "Risky") {
    return returnPct > 8;
  }

  return Math.abs(returnPct) <= 6;
}

export function calculateHitRate(entries: WatchlistEntry[]) {
  if (entries.length === 0) {
    return 0;
  }

  const hits = entries.filter(isHit).length;
  return round((hits / entries.length) * 100);
}

export function getBestCall(entries: WatchlistEntry[]) {
  if (entries.length === 0) {
    return null;
  }

  return entries.reduce((best, entry) =>
    getCallScore(entry) > getCallScore(best) ? entry : best,
  );
}

export function getWorstCall(entries: WatchlistEntry[]) {
  if (entries.length === 0) {
    return null;
  }

  return entries.reduce((worst, entry) =>
    getCallScore(entry) < getCallScore(worst) ? entry : worst,
  );
}

export function calculateWatchlistPerformance(watchlist: Watchlist) {
  const returns = watchlist.entries.map(getEntryReturnPct);
  const totalConviction = watchlist.entries.reduce(
    (total, entry) => total + entry.conviction,
    0,
  );
  const averageReturn =
    returns.length === 0
      ? 0
      : returns.reduce((total, value) => total + value, 0) / returns.length;
  const weightedReturn =
    totalConviction === 0
      ? 0
      : watchlist.entries.reduce(
          (total, entry) => total + getEntryReturnPct(entry) * entry.conviction,
          0,
        ) / totalConviction;

  return {
    averageReturn: round(averageReturn),
    weightedReturn: round(weightedReturn),
    hitRate: calculateHitRate(watchlist.entries),
    bestCall: getBestCall(watchlist.entries),
    worstCall: getWorstCall(watchlist.entries),
    positiveCalls: watchlist.entries.filter(
      (entry) => getEntryReturnPct(entry) > 0,
    ).length,
  };
}

export function calculateMergenWatchScore(token: Token, tokenComments: Comment[] = []) {
  const { watchScoreInputs } = token;
  const commentBoost = Math.min(tokenComments.length * 1.6, 8);
  const rawScore =
    watchScoreInputs.communityConviction * 0.25 +
    watchScoreInputs.researchDepth * 0.22 +
    watchScoreInputs.liquidityConfidence * 0.2 +
    watchScoreInputs.riskControl * 0.18 +
    watchScoreInputs.momentum * 0.15 +
    commentBoost;

  return Math.round(clamp(rawScore));
}

export function calculateWatchlistScore(
  watchlist: Watchlist,
  tokens: Token[],
  comments: Comment[],
) {
  if (watchlist.entries.length === 0) {
    return 0;
  }

  const total = watchlist.entries.reduce((sum, entry) => {
    const token = tokens.find(
      (item) =>
        item.address.toLowerCase() === entry.tokenAddress.toLowerCase(),
    );

    if (!token) {
      return sum;
    }

    const tokenComments = comments.filter(
      (comment) =>
        comment.targetType === "token" &&
        comment.targetId.toLowerCase() === token.address.toLowerCase(),
    );

    return sum + calculateMergenWatchScore(token, tokenComments);
  }, 0);

  return Math.round(total / watchlist.entries.length);
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${round(value)}%`;
}

export function formatUsd(value: number) {
  if (value < 0.01) {
    return `$${value.toFixed(6)}`;
  }

  if (value < 1) {
    return `$${value.toFixed(4)}`;
  }

  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

export function formatCompact(value: number) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
