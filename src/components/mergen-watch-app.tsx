"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LanguageToggle, type CopyKey, useLanguage } from "@/components/language";
import {
  baseTokens,
  comments,
  getCommentsForToken,
  getCommentsForWatchlist,
  getTokenByAddress,
  getUserByAddress,
  getWatchlistById,
  getWatchlistsForToken,
  getWatchlistsForUser,
  users,
  watchlists,
} from "@/lib/mock-data";
import {
  calculateHitRate,
  calculateMergenWatchScore,
  calculateWatchlistPerformance,
  calculateWatchlistScore,
  formatCompact,
  formatPercent,
  formatUsd,
  getBestCall,
  getCallScore,
  getEntryReturnPct,
  shortAddress,
} from "@/lib/performance";
import { getTokenAssetPath } from "@/lib/token-assets";
import type { Comment, Stance, Token, UserProfile, Watchlist, WatchlistEntry } from "@/lib/types";

type LeagueStance = "Bullish" | "Watching" | "Risky" | "Avoid";
type ArtTone = "blue" | "violet" | "cyan" | "green" | "gold" | "rose";
type SquadSlot = { token: Token; entry?: WatchlistEntry } | null;
type WatcherProfile = { nickname: string; avatarSymbol: string };

const githubUrl = "https://github.com/Edizemre1/mergen-watch-base";
const profileStorageKey = "mergen-watch-player-profile";
const squadStorageKey = "mergen-watch-squad-slots";
const walletSessionStorageKey = "mergen-watch-wallet-session";
const mockWalletAddress = "0xBase...Hunter";
const playerRank = 256;
const maxSquadSlots = 5;
const defaultSquadSlotSymbols = ["DEGEN", "BRETT", "TOSHI", null, null] as const;
const squadSelectionSymbols = [
  "CAW",
  "DOGINME",
  "PONKE",
  "BALD",
  "KEYCAT",
  "MIGGLES",
  "SKI",
  "DRB",
  "TOBY",
  "KIBSHI",
  "BENJI",
  "BASED PEPE",
  "BASE GOD",
  "BORED",
  "NOICE",
  "SHIB ON BASE",
  "DINO",
  "PING",
  "HIGHER",
  "RUSSELL",
  "MEOW",
] as const;
const profileAvatarSymbols = [
  "DEGEN",
  "BRETT",
  "TOSHI",
  "CAW",
  "DOGINME",
  "KEYCAT",
  "MIGGLES",
  "BASE GOD",
] as const;

const tokenTones: Record<string, ArtTone> = {
  AERO: "blue",
  BRETT: "cyan",
  TOSHI: "green",
  DEGEN: "violet",
  CAW: "rose",
  DOGINME: "green",
  VIRTUAL: "gold",
  HIGHER: "rose",
  KEYCAT: "blue",
  PONKE: "gold",
  BALD: "blue",
  MIGGLES: "cyan",
  SKI: "blue",
  DRB: "violet",
  TOBY: "green",
  KIBSHI: "rose",
  BENJI: "gold",
  "BASED PEPE": "green",
  "BASE GOD": "blue",
  BORED: "violet",
  NOICE: "cyan",
  "SHIB ON BASE": "rose",
  DINO: "gold",
  PING: "cyan",
  RUSSELL: "green",
  MEOW: "violet",
};

function createSelectionToken(
  symbol: string,
  name: string,
  sector: string,
  index: number,
  change7d: number,
  socialVelocity: number,
): Token {
  return {
    address: `0x${(0xe00 + index).toString(16).padStart(40, "0")}`,
    symbol,
    name,
    sector,
    chain: "Base",
    summary: `${name} is a mock Mergen Watch League fighter card for weekly Base squad play.`,
    price: Number((0.0004 + index * 0.0017).toPrecision(3)),
    change24h: Number((change7d / 3).toFixed(1)),
    change7d,
    liquidityUsd: 4_800_000 + index * 1_450_000,
    holders: 18_000 + index * 6_200,
    socialVelocity,
    contractRisk: 34 + (index % 5) * 5,
    volatility: 58 + (index % 6) * 4,
    mentions: 2_400 + index * 620,
    followers: 9_000 + index * 3_900,
    watchScoreInputs: {
      communityConviction: 62 + (index % 7) * 4,
      researchDepth: 38 + (index % 6) * 5,
      liquidityConfidence: 44 + (index % 5) * 5,
      riskControl: 39 + (index % 5) * 4,
      momentum: 58 + (index % 7) * 4,
    },
  };
}

const selectionOnlyTokens: Token[] = [
  createSelectionToken("PONKE", "Ponke", "Base meme", 1, 9.4, 70),
  createSelectionToken("BALD", "Bald", "Base culture", 2, -2.8, 58),
  createSelectionToken("MIGGLES", "Mister Miggles", "Base culture", 3, 13.7, 74),
  createSelectionToken("SKI", "Ski Mask Dog", "Meme liquidity", 4, 7.9, 63),
  createSelectionToken("DRB", "Degen Rebels", "Social protocol", 5, 5.1, 61),
  createSelectionToken("TOBY", "Toby", "Base social", 6, 10.6, 68),
  createSelectionToken("KIBSHI", "Kibshi", "Base meme", 7, -4.2, 55),
  createSelectionToken("BENJI", "Benji", "Base culture", 8, 6.8, 64),
  createSelectionToken("BASED PEPE", "Based Pepe", "Base meme", 9, 15.5, 79),
  createSelectionToken("BASE GOD", "Base God", "Base culture", 10, 19.8, 84),
  createSelectionToken("BORED", "Bored", "NFT culture", 11, 3.6, 59),
  createSelectionToken("NOICE", "Noice", "Base social", 12, 8.8, 66),
  createSelectionToken("SHIB ON BASE", "Shib On Base", "Base meme", 13, 11.2, 72),
  createSelectionToken("DINO", "Dino", "Base meme", 14, -1.9, 53),
  createSelectionToken("PING", "Ping", "Base social", 15, 4.5, 60),
  createSelectionToken("RUSSELL", "Russell", "Base culture", 16, 12.1, 71),
  createSelectionToken("MEOW", "Meow", "Meme liquidity", 17, 6.2, 65),
];

const squadTokenPool = [...baseTokens, ...selectionOnlyTokens];

function getSquadTokenBySymbol(symbol: string) {
  return squadTokenPool.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}

const squadSelectionTokens = squadSelectionSymbols.flatMap((symbol) => {
  const token = getSquadTokenBySymbol(symbol);
  return token ? [token] : [];
});

const profileAvatarTokens = profileAvatarSymbols.flatMap((symbol) => {
  const token = getSquadTokenBySymbol(symbol);
  return token ? [token] : [];
});

const leaderboard = [
  { handle: "@defi_king", avatar: "DK", points: 15240 },
  { handle: "@token_sorcerer", avatar: "TS", points: 9870 },
  { handle: "@based_bruh", avatar: "BB", points: 7230 },
  { handle: "@longbase", avatar: "LB", points: 6420 },
  { handle: "@nft_baseset", avatar: "NB", points: 5890 },
];

const avatarOptions = ["BH", "WK", "KG", "SH", "RG", "MS", "CT", "AV"];

const badgeKeys = [
  ["badge.winStreak", "badge.winStreakMeta", "green"],
  ["badge.top10", "badge.top10Meta", "blue"],
  ["badge.earlyWatcher", "badge.earlyWatcherMeta", "gold"],
  ["badge.baseResearcher", "badge.baseResearcherMeta", "violet"],
  ["badge.tokenScout", "badge.tokenScoutMeta", "green"],
  ["badge.squadBuilder", "badge.squadBuilderMeta", "blue"],
  ["badge.highRoller", "badge.highRollerMeta", "gold"],
  ["badge.veteran", "badge.veteranMeta", "violet"],
] as const;

function mapStance(stance: Stance): LeagueStance {
  return stance === "Neutral" ? "Watching" : stance;
}

function stanceKey(stance: LeagueStance): CopyKey {
  return `stance.${stance}` as CopyKey;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toneGradient(tone: ArtTone) {
  const gradients: Record<ArtTone, string> = {
    blue: "from-blue-500/30 via-sky-400/20 to-slate-950",
    violet: "from-violet-500/35 via-fuchsia-400/20 to-slate-950",
    cyan: "from-cyan-400/35 via-blue-400/20 to-slate-950",
    green: "from-emerald-400/30 via-lime-300/16 to-slate-950",
    gold: "from-amber-300/35 via-orange-400/20 to-slate-950",
    rose: "from-rose-400/32 via-orange-300/18 to-slate-950",
  };

  return gradients[tone];
}

function formatPoints(value: number) {
  return value.toLocaleString("en-US");
}

function getTokenXp(token: Token, index = 0) {
  return Math.max(180, Math.round(token.socialVelocity * 4 + Math.abs(token.change7d) * 18 + index * 45));
}

function getTokenPoints(token: Token, entry?: WatchlistEntry) {
  const returnScore = entry ? Math.max(0, getEntryReturnPct(entry) * 58) : Math.max(0, token.change7d * 52);
  return Math.round(900 + token.socialVelocity * 8 + returnScore);
}

function getTokenLevel(token: Token, index = 0) {
  return Math.max(8, Math.round(10 + token.watchScoreInputs.researchDepth / 12 + index));
}

function getEntryForToken(token: Token) {
  const allEntries = watchlists.flatMap((watchlist) => watchlist.entries);

  return allEntries.find(
    (watchlistEntry) =>
      watchlistEntry.tokenAddress.toLowerCase() === token.address.toLowerCase(),
  );
}

function getSquadSlots(symbols: readonly (string | null)[]): SquadSlot[] {
  return symbols.map((symbol) => {
    if (!symbol) {
      return null;
    }

    const token = getSquadTokenBySymbol(symbol);

    return token ? { token, entry: getEntryForToken(token) } : null;
  });
}

function getStoredSquadSlots() {
  if (typeof window === "undefined") {
    return getSquadSlots(defaultSquadSlotSymbols);
  }

  try {
    const storedSquad = window.localStorage.getItem(squadStorageKey);

    if (!storedSquad) {
      return getSquadSlots(defaultSquadSlotSymbols);
    }

    const parsedSquad = JSON.parse(storedSquad);

    if (!Array.isArray(parsedSquad)) {
      return getSquadSlots(defaultSquadSlotSymbols);
    }

    const seenSymbols = new Set<string>();
    const symbols = Array.from({ length: maxSquadSlots }, (_, index) => {
      const symbol = parsedSquad[index];

      if (typeof symbol !== "string") {
        return null;
      }

      const token = getSquadTokenBySymbol(symbol);

      if (!token || seenSymbols.has(token.symbol)) {
        return null;
      }

      seenSymbols.add(token.symbol);
      return token.symbol;
    });

    return getSquadSlots(symbols);
  } catch {
    return getSquadSlots(defaultSquadSlotSymbols);
  }
}

function getProfileStorageKey(walletAddress: string) {
  return `${profileStorageKey}:${walletAddress}`;
}

function loadStoredWalletSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedWallet = window.localStorage.getItem(walletSessionStorageKey);
  return storedWallet === mockWalletAddress ? storedWallet : null;
}

function getSquadTotals(squad: SquadSlot[] = getSquadSlots(defaultSquadSlotSymbols)) {
  const filledSquad = squad.filter((slot): slot is NonNullable<SquadSlot> => Boolean(slot));

  return {
    weeklyXp: filledSquad.reduce((sum, item, index) => sum + getTokenXp(item.token, index), 0),
    weeklyPoints: filledSquad.reduce(
      (sum, item) => sum + getTokenPoints(item.token, item.entry),
      0,
    ),
  };
}

function loadStoredWatcherProfile(walletAddress: string | null): WatcherProfile | null {
  if (typeof window === "undefined" || !walletAddress) {
    return null;
  }

  try {
    const storedProfile = window.localStorage.getItem(getProfileStorageKey(walletAddress));

    if (!storedProfile) {
      return null;
    }

    const parsedProfile = JSON.parse(storedProfile) as Partial<WatcherProfile>;

    if (
      typeof parsedProfile.nickname === "string" &&
      typeof parsedProfile.avatarSymbol === "string"
    ) {
      return {
        nickname: parsedProfile.nickname,
        avatarSymbol: parsedProfile.avatarSymbol,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function formatWatcherHandle(profile: WatcherProfile | null) {
  const nickname = profile?.nickname.trim();

  if (!nickname) {
    return "@basehunter";
  }

  return nickname.startsWith("@") ? nickname : `@${nickname}`;
}

function formatMockWalletAddress(walletAddress: string | null) {
  return walletAddress ?? mockWalletAddress;
}

function gameActionForComment(comment: Comment) {
  if (comment.targetType === "token") {
    const token = getTokenByAddress(comment.targetId);
    if (comment.stance === "Bullish") {
      return { key: "signal.upgraded" as CopyKey, token, points: 320 };
    }
    if (comment.stance === "Risky") {
      return { key: "signal.discovered" as CopyKey, token, points: 120 };
    }
    return { key: "signal.added" as CopyKey, token, points: 210 };
  }

  return { key: "signal.earned" as CopyKey, token: null, points: 500 };
}

function userWatchStats(user: UserProfile) {
  const ownedLists = getWatchlistsForUser(user.address);
  const entries = ownedLists.flatMap((watchlist) => watchlist.entries);
  const bestEntry = getBestCall(entries);
  const bestToken = bestEntry ? getTokenByAddress(bestEntry.tokenAddress) : null;

  return {
    ownedLists,
    entries,
    bestEntry,
    bestToken,
    hitRate: calculateHitRate(entries),
  };
}

function dominantTokenStance(token: Token): LeagueStance {
  const relatedEntries = getWatchlistsForToken(token.address).flatMap((watchlist) =>
    watchlist.entries.filter(
      (entry) => entry.tokenAddress.toLowerCase() === token.address.toLowerCase(),
    ),
  );

  const top = (["Bullish", "Neutral", "Risky", "Avoid"] as Stance[])
    .map((stance) => ({
      stance,
      count: relatedEntries.filter((entry) => entry.stance === stance).length,
    }))
    .sort((a, b) => b.count - a.count)[0]?.stance;

  return mapStance(top ?? "Neutral");
}

function GamePanel({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-2xl border border-blue-300/15 bg-slate-950/72 shadow-[0_0_0_1px_rgba(15,23,42,0.8),0_24px_70px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </section>
  );
}

function PanelTitle({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg border border-blue-400/30 bg-blue-500/12 text-xs font-black text-blue-200">
          W
        </span>
        <h2 className="text-lg font-black uppercase tracking-wide text-white">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function XpBar({ value, max = 2000 }: { value: number; max?: number }) {
  const width = Math.max(7, Math.min(100, (value / max) * 100));

  return (
    <div className="h-2 rounded-full bg-slate-950/70 shadow-[inset_0_1px_3px_rgba(0,0,0,0.45)]">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-lime-300 shadow-[0_0_14px_rgba(56,189,248,0.25)]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function PixelAvatar({
  label,
  tone = "green",
  selected = false,
  size = "md",
}: {
  label: string;
  tone?: ArtTone;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "size-24" : size === "sm" ? "size-10" : "size-16";
  const innerSizeClass = size === "lg" ? "size-14 text-lg" : size === "sm" ? "size-7 text-[10px]" : "size-10 text-sm";

  return (
    <div
      className={cx(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-xl border bg-gradient-to-br",
        sizeClass,
        toneGradient(tone),
        selected ? "border-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.35)]" : "border-white/12",
      )}
    >
      <div className="absolute left-2 top-2 size-3 rounded-sm bg-white/70" />
      <div className="absolute right-3 top-4 size-2 rounded-sm bg-lime-300/80" />
      <div className="absolute bottom-3 h-5 w-10 rounded-t-xl bg-black/35" />
      <div className={`relative grid place-items-center rounded-lg border border-white/15 bg-black/34 font-black text-white ${innerSizeClass}`}>
        {label}
      </div>
    </div>
  );
}

function TokenAvatarTile({
  token,
  selected = false,
  className,
}: {
  token: Token;
  selected?: boolean;
  className?: string;
}) {
  const assetPath = getTokenAssetPath(token);

  return (
    <div
      className={cx(
        "relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border bg-slate-950/80",
        selected
          ? "border-lime-300 shadow-[0_0_24px_rgba(132,204,22,0.3)]"
          : "border-blue-300/18",
        className,
      )}
    >
      {assetPath ? (
        <Image
          src={assetPath}
          alt={`${token.name} avatar`}
          fill
          sizes="96px"
          className="scale-110 object-cover"
          style={{ objectPosition: "center 36%" }}
        />
      ) : (
        <span className="relative z-10 text-sm font-black text-white">
          {token.symbol.slice(0, 2)}
        </span>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
    </div>
  );
}

function LeagueLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-xl border border-blue-400/35 bg-blue-500/12 shadow-[0_0_26px_rgba(37,99,235,0.25)]">
        <div className="grid size-7 place-items-center rounded-lg border border-lime-300/40 bg-lime-300/10 text-sm font-black text-lime-200">
          M
        </div>
      </div>
      <div>
        <div className="text-xl font-black uppercase leading-none tracking-wide text-white">
          Mergen
        </div>
        <div className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
          Watch League
        </div>
      </div>
    </Link>
  );
}

function TopNavigation() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-blue-300/12 bg-[#030711]/94 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1760px] flex-wrap items-center justify-between gap-3 px-4 py-3">
        <LeagueLogo />
        <nav className="flex flex-wrap items-center gap-2">
          {[
            ["/", "nav.lobby"],
            ["/watch", "nav.squad"],
          ].map(([href, key]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-3 py-2 text-sm font-bold text-slate-400 transition hover:bg-blue-500/10 hover:text-white"
            >
              {t(key as CopyKey)}
            </Link>
          ))}
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl px-3 py-2 text-sm font-bold text-slate-400 transition hover:bg-blue-500/10 hover:text-white"
          >
            {t("nav.github")}
          </a>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <TopNavigation />
      <main className="mx-auto w-full max-w-[1600px] px-5 py-6">{children}</main>
    </div>
  );
}

function StanceBadge({ stance }: { stance: LeagueStance }) {
  const { t } = useLanguage();
  const classes: Record<LeagueStance, string> = {
    Bullish: "border-lime-300/35 bg-lime-300/12 text-lime-200",
    Watching: "border-blue-300/35 bg-blue-400/12 text-blue-100",
    Risky: "border-amber-300/35 bg-amber-300/12 text-amber-100",
    Avoid: "border-rose-300/35 bg-rose-300/12 text-rose-100",
  };

  return (
    <span className={`inline-flex shrink-0 whitespace-nowrap rounded-lg border px-1.5 py-0.5 text-[10px] font-black ${classes[stance]}`}>
      {t(stanceKey(stance))}
    </span>
  );
}

function TokenCharacterCard({
  token,
  entry,
  index = 0,
  compact = false,
}: {
  token: Token;
  entry?: WatchlistEntry;
  index?: number;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const level = getTokenLevel(token, index);
  const xp = getTokenXp(token, index);
  const points = getTokenPoints(token, entry);
  const performance = entry ? getEntryReturnPct(entry) : token.change7d;
  const stance = mapStance(entry?.stance ?? (token.change7d > 0 ? "Bullish" : "Neutral"));
  const tone = tokenTones[token.symbol] ?? "blue";

  return (
    <Link
      href={`/watch/token/${token.address}`}
      className={cx(
        "group relative block overflow-hidden rounded-2xl border bg-slate-950 shadow-[0_16px_45px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:border-blue-300/60",
        compact ? "border-white/12" : "border-blue-300/25",
      )}
    >
      <div className="relative">
        <CharacterPlaceholder
          token={token}
          tone={tone}
          className={compact ? "h-72 rounded-none border-0" : "h-44 rounded-none border-0"}
        />
        <div className="absolute right-3 top-3 rounded-lg border border-white/15 bg-black/45 px-2 py-1 text-xs font-black text-white">
          {index + 1}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-black text-white">{token.symbol}</div>
            <div className="text-xs text-slate-400">{token.name}</div>
          </div>
          <StanceBadge stance={stance} />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs font-black">
          <span className="text-blue-300">{t("metric.level")} {level}</span>
          <span className={performance >= 0 ? "text-lime-300" : "text-rose-300"}>
            {formatPercent(performance)}
          </span>
        </div>
        <div className="mt-2">
          <XpBar value={xp} max={1800} />
          <div className="mt-1 text-right text-[11px] text-slate-500">
            {xp.toLocaleString()} / 1,800 XP
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
          <div>
            <div className="text-xs text-blue-300">{t("metric.xp")}</div>
            <div className="font-black text-white">{xp}</div>
          </div>
          <div>
            <div className="text-xs text-lime-300">{t("metric.points")}</div>
            <div className="font-black text-white">{formatPoints(points)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CharacterPlaceholder({
  token,
  tone,
  className,
}: {
  token: Token;
  tone: ArtTone;
  className?: string;
}) {
  const assetPath = getTokenAssetPath(token);
  const isAero = token.symbol === "AERO";
  const isDegen = token.symbol === "DEGEN";
  const isBrett = token.symbol === "BRETT";

  return (
    <div
      className={cx(
        "relative h-52 overflow-hidden rounded-xl bg-gradient-to-br",
        toneGradient(tone),
        className,
      )}
    >
      {assetPath ? (
        <>
          <Image
            src={assetPath}
            alt={`${token.name} character`}
            fill
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 42vw, 18vw"
            className="scale-[1.08] object-cover transition-transform duration-300 ease-out group-hover:scale-[1.1]"
            style={{ objectPosition: "center 40%" }}
            priority={["AERO", "DEGEN", "BRETT"].includes(token.symbol)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/26 via-transparent to-white/8" />
        </>
      ) : null}
      {!assetPath ? (
        <>
      <div className="absolute inset-x-5 bottom-5 h-24 rounded-[2rem] border border-white/12 bg-black/20" />
      {isAero ? (
        <>
          <div className="absolute left-6 top-10 h-10 w-20 -rotate-12 rounded-full border border-blue-100/40 bg-blue-200/25" />
          <div className="absolute right-6 top-10 h-10 w-20 rotate-12 rounded-full border border-blue-100/40 bg-blue-200/25" />
          <div className="absolute left-1/2 top-16 grid size-28 -translate-x-1/2 place-items-center rounded-[2rem] border border-white/20 bg-blue-950/55">
            <div className="size-20 rounded-full border border-blue-100/40 bg-sky-300/35" />
            <div className="absolute top-10 h-6 w-20 rounded-full border border-white/30 bg-black/45" />
            <div className="absolute top-12 flex gap-3">
              <span className="size-4 rounded-full bg-blue-200" />
              <span className="size-4 rounded-full bg-blue-200" />
            </div>
          </div>
        </>
      ) : null}
      {isDegen ? (
        <>
          <div
            className="absolute left-1/2 top-10 h-32 w-32 -translate-x-1/2 border border-violet-200/25 bg-violet-950/65"
            style={{ clipPath: "polygon(50% 0, 100% 38%, 84% 100%, 16% 100%, 0 38%)" }}
          />
          <div className="absolute left-1/2 top-20 grid size-20 -translate-x-1/2 place-items-center rounded-3xl border border-white/15 bg-black/40">
            <div className="flex gap-4">
              <span className="h-2 w-5 rounded-full bg-lime-300" />
              <span className="h-2 w-5 rounded-full bg-lime-300" />
            </div>
          </div>
          <div className="absolute right-8 top-12 size-10 rotate-45 rounded-lg border border-fuchsia-200/40 bg-fuchsia-400/25" />
        </>
      ) : null}
      {isBrett ? (
        <>
          <div className="absolute left-1/2 top-12 size-28 -translate-x-1/2 rounded-[2rem] border border-cyan-100/30 bg-cyan-300/35" />
          <div className="absolute left-1/2 top-7 h-12 w-32 -translate-x-1/2 rounded-t-[3rem] border border-blue-100/30 bg-blue-600/55" />
          <div className="absolute left-1/2 top-24 flex -translate-x-1/2 gap-6">
            <span className="size-4 rounded-full bg-white" />
            <span className="size-4 rounded-full bg-white" />
          </div>
          <div className="absolute left-1/2 top-36 h-3 w-14 -translate-x-1/2 rounded-full bg-black/40" />
        </>
      ) : null}
      {!isAero && !isDegen && !isBrett ? (
        <div className="absolute left-1/2 top-16 grid size-28 -translate-x-1/2 place-items-center rounded-[2rem] border border-white/20 bg-black/35 text-4xl font-black text-white">
          {token.symbol.slice(0, 2)}
        </div>
      ) : null}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl border border-white/15 bg-black/45 px-4 py-1 text-xl font-black text-white">
        {token.symbol.slice(0, 2)}
      </div>
        </>
      ) : null}
    </div>
  );
}

function SquadGameCard({
  token,
  entry,
  index,
  onRemove,
}: {
  token: Token;
  entry?: WatchlistEntry;
  index: number;
  onRemove?: () => void;
}) {
  const { t } = useLanguage();
  const xp = getTokenXp(token, index);
  const points = getTokenPoints(token, entry);
  const performance = entry ? getEntryReturnPct(entry) : token.change7d;
  const stance = mapStance(entry?.stance ?? (token.change7d > 0 ? "Bullish" : "Neutral"));
  const tone = tokenTones[token.symbol] ?? "blue";
  const symbolSizeClass =
    token.symbol.length >= 7
      ? "text-xl xl:text-[1.05rem] 2xl:text-xl"
      : token.symbol.length >= 5
        ? "text-2xl xl:text-[1.35rem] 2xl:text-2xl"
        : "text-2xl";

  return (
    <article
      className="group relative flex min-h-[366px] flex-col overflow-hidden rounded-2xl border border-blue-300/35 bg-gradient-to-b from-slate-900/92 via-slate-950/84 to-slate-950/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-18px_38px_rgba(15,23,42,0.22),0_18px_44px_rgba(0,0,0,0.28)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-lime-300/55 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-18px_38px_rgba(15,23,42,0.16),0_22px_58px_rgba(37,99,235,0.22)]"
    >
      <span className="pointer-events-none absolute inset-x-3 top-2 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-400/14 blur-3xl transition duration-300 group-hover:bg-lime-300/14" />
      <span className="pointer-events-none absolute -left-12 bottom-16 h-24 w-24 rounded-full bg-violet-400/8 blur-3xl" />
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-5 top-5 z-20 rounded-lg border border-white/12 bg-black/45 px-2 py-1 text-[10px] font-black uppercase text-slate-200 opacity-80 backdrop-blur transition hover:border-rose-300/40 hover:bg-rose-400/15 hover:text-white hover:opacity-100"
        >
          {t("squad.remove")}
        </button>
      ) : null}
      <CharacterPlaceholder token={token} tone={tone} className="relative z-10" />
      <div className="relative z-10 mt-3 min-w-0">
        <div className={cx("whitespace-nowrap font-black leading-none text-white", symbolSizeClass)}>
          {token.symbol}
        </div>
        <div className="mt-1.5 flex min-w-0 items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold leading-4 text-slate-100">
              {token.name}
            </div>
            <div className="truncate text-xs font-semibold leading-4 text-slate-400">
              {token.sector}
            </div>
          </div>
          <StanceBadge stance={stance} />
        </div>
      </div>
      <div className="relative z-10 mt-2.5">
        <XpBar value={xp} max={1800} />
      </div>
      <div className="relative z-10 mt-2.5 grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-blue-100/14 bg-slate-800/52 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <MiniMetric
            label={t("metric.performance")}
            value={formatPercent(performance)}
            valueClassName={performance >= 0 ? "text-lime-100" : "text-rose-100"}
          />
        </div>
        <div className="rounded-xl border border-blue-100/14 bg-slate-800/52 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <MiniMetric label={t("metric.xp")} value={xp.toString()} valueClassName="text-blue-100" />
        </div>
        <div className="col-span-2 rounded-xl border border-lime-300/24 bg-lime-300/14 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <MiniMetric label={t("metric.points")} value={formatPoints(points)} valueClassName="text-lime-100" />
        </div>
      </div>
    </article>
  );
}

function AddGameCard({ index, onClick }: { index: number; onClick: () => void }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className="group grid min-h-[366px] w-full place-items-center rounded-2xl border border-dashed border-lime-300/35 bg-slate-950/58 p-4 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-lime-300/60 hover:bg-slate-900/72 hover:shadow-[0_20px_48px_rgba(132,204,22,0.14)]"
    >
      <div>
        <div className="mx-auto grid size-24 place-items-center rounded-2xl border border-lime-300/35 bg-lime-300/8 text-6xl font-light text-lime-300 transition group-hover:scale-105 group-hover:bg-lime-300/12">
          +
        </div>
        <div className="mt-6 text-2xl font-black text-lime-300">{t("squad.add")}</div>
        <div className="mt-2 text-xs font-semibold text-slate-300">{t("squad.addText")}</div>
        <div className="mt-4 rounded-xl border border-blue-300/15 bg-black/30 px-3 py-2 text-xs font-black uppercase tracking-wide text-blue-200">
          {index + 1} / {maxSquadSlots} {t("squad.slots")}
        </div>
      </div>
    </button>
  );
}

function WeeklySeasonPanel({ totals }: { totals: ReturnType<typeof getSquadTotals> }) {
  const { t } = useLanguage();
  const { weeklyXp, weeklyPoints } = totals;

  return (
    <aside className="flex min-h-full flex-col rounded-2xl border border-blue-300/20 bg-slate-900/66 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.05)]">
      <PanelTitle title={t("section.weeklySeason")} />
      <div className="mt-4 rounded-xl border border-white/12 bg-slate-900/50 px-3 py-3">
        <div className="text-sm font-black text-white">{t("season.name")}</div>
        <div className="mt-1 text-xs font-bold text-blue-300">{t("season.ends")}</div>
      </div>
      <div className="mt-4 rounded-2xl border border-blue-300/18 bg-blue-500/14 p-4">
        <div className="text-xs font-black uppercase tracking-wide text-slate-400">
          {t("season.rank")}
        </div>
        <div className="mt-2 text-5xl font-black text-white">#{playerRank}</div>
        <div className="mt-1 font-black text-blue-300">{t("season.top")}</div>
      </div>
      <div className="mt-4 grid gap-3">
        <div className="rounded-xl border border-white/12 bg-slate-900/48 p-3">
          <MiniMetric label={t("season.weeklyXp")} value={formatPoints(weeklyXp)} />
        </div>
        <div className="rounded-xl border border-white/12 bg-slate-900/48 p-3">
          <MiniMetric label={t("season.weeklyPoints")} value={formatPoints(weeklyPoints)} />
        </div>
      </div>
      <div className="mt-auto pt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-black uppercase tracking-wide text-slate-400">{t("season.rewards")}</span>
          <span className="font-black text-lime-300">84%</span>
        </div>
        <XpBar value={weeklyPoints} max={15000} />
      </div>
    </aside>
  );
}

function WeeklyScorePanel({
  totals,
  profile,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
  onEditProfile,
}: {
  totals: ReturnType<typeof getSquadTotals>;
  profile: WatcherProfile | null;
  walletAddress: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onEditProfile: () => void;
}) {
  const { t } = useLanguage();
  const { weeklyXp, weeklyPoints } = totals;
  const avatarToken = profile ? getSquadTokenBySymbol(profile.avatarSymbol) : null;
  const connected = Boolean(walletAddress);
  const displayName = connected && profile
    ? formatWatcherHandle(profile)
    : connected
      ? formatMockWalletAddress(walletAddress)
      : t("profile.handle");

  return (
    <aside className="flex min-h-full flex-col gap-4 rounded-2xl border border-blue-300/20 bg-slate-900/66 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div>
        <PanelTitle title={t("score.title")} />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/12 bg-slate-900/48 p-3">
            <MiniMetric label={t("metric.xp")} value={formatPoints(weeklyXp)} />
          </div>
          <div className="rounded-xl border border-white/12 bg-slate-900/48 p-3">
            <MiniMetric label={t("metric.points")} value={formatPoints(weeklyPoints)} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/12 bg-slate-900/48 p-3">
        <div className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
          {t("section.leaderboard")}
        </div>
        <div className="space-y-2">
          {leaderboard.map((row, index) => (
            <div key={row.handle} className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/64 p-2">
              <div className="w-5 text-center text-xs font-black text-amber-200">{index + 1}</div>
              <PixelAvatar label={row.avatar} tone={index % 2 === 0 ? "blue" : "violet"} size="sm" />
              <div className="min-w-0 flex-1 truncate text-xs font-black text-white">{row.handle}</div>
              <div className="text-xs font-black text-lime-300">{formatPoints(row.points)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto rounded-2xl border border-lime-300/18 bg-lime-300/8 p-3">
        <div className="flex items-center gap-3">
          {avatarToken ? (
            <TokenAvatarTile token={avatarToken} selected />
          ) : (
            <PixelAvatar label="BH" tone="green" selected />
          )}
          <div className="min-w-0">
            <div className="truncate font-black text-white">{displayName}</div>
            <div className="text-xs text-slate-300">{t("profile.role")}</div>
            {connected ? (
              <div className="mt-1 truncate text-[11px] font-bold text-blue-200">
                {t("profile.connectedWallet")}: {formatMockWalletAddress(walletAddress)}
              </div>
            ) : null}
            <div className="mt-1 text-xs font-black text-lime-300">
              {formatPoints(weeklyXp)} XP
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          {connected ? (
            <>
              <button
                type="button"
                onClick={onEditProfile}
                className="rounded-xl border border-blue-300/25 bg-blue-400/10 px-3 py-2 text-xs font-black text-blue-100 transition hover:bg-blue-400/16"
              >
                {t("profile.edit")}
              </button>
              <button
                type="button"
                onClick={onDisconnectWallet}
                className="rounded-xl border border-white/12 bg-black/24 px-3 py-2 text-xs font-black text-slate-300 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-white"
              >
                {t("profile.disconnect")}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onConnectWallet}
              className="rounded-xl border border-lime-300/35 bg-lime-300/14 px-3 py-2 text-xs font-black text-lime-100 transition hover:bg-lime-300/20"
            >
              {t("profile.connect")}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function ProfileSetupModal({
  profile,
  walletAddress,
  onClose,
  onSave,
}: {
  profile: WatcherProfile | null;
  walletAddress: string;
  onClose: () => void;
  onSave: (profile: WatcherProfile) => void;
}) {
  const { t } = useLanguage();
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [avatarSymbol, setAvatarSymbol] = useState(
    profile?.avatarSymbol ?? profileAvatarTokens[0]?.symbol ?? "DEGEN",
  );
  const selectedAvatarToken =
    getSquadTokenBySymbol(avatarSymbol) ?? profileAvatarTokens[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedAvatarToken) {
      return;
    }

    onSave({
      nickname: nickname.trim() || "basehunter",
      avatarSymbol: selectedAvatarToken.symbol,
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 px-3 py-4 backdrop-blur-md sm:px-5 sm:py-6">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-blue-300/32 bg-slate-950/96 shadow-[0_0_70px_rgba(37,99,235,0.26),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        <span className="pointer-events-none absolute left-8 top-8 h-40 w-40 rounded-full bg-blue-500/14 blur-3xl" />
        <span className="pointer-events-none absolute bottom-8 right-10 h-40 w-40 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              {t("profile.setupTitle")}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-300">
              {t("profile.setupSubtitle")}
            </p>
            <div className="mt-3 inline-flex rounded-xl border border-blue-300/20 bg-blue-400/10 px-3 py-2 text-xs font-black text-blue-100">
              {t("profile.connectedWallet")}: {formatMockWalletAddress(walletAddress)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/6 text-sm font-black text-slate-200 transition hover:border-blue-300/40 hover:text-white"
            aria-label="Close"
          >
            X
          </button>
        </div>
        <div className="relative z-10 grid gap-5 p-5">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-wide text-slate-300">
              {t("profile.nickname")}
            </span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder={t("profile.nicknamePlaceholder")}
              className="rounded-xl border border-blue-300/18 bg-slate-900/78 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300/45 focus:shadow-[0_0_24px_rgba(132,204,22,0.12)]"
            />
          </label>
          <div>
            <div className="text-xs font-black uppercase tracking-wide text-slate-300">
              {t("profile.avatar")}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-8">
              {profileAvatarTokens.map((token) => {
                const selected = token.symbol === avatarSymbol;

                return (
                  <button
                    key={token.symbol}
                    type="button"
                    onClick={() => setAvatarSymbol(token.symbol)}
                    className={cx(
                      "rounded-2xl border bg-slate-900/64 p-2 transition hover:-translate-y-0.5",
                      selected
                        ? "border-lime-300/70 shadow-[0_0_24px_rgba(132,204,22,0.2)]"
                        : "border-white/10 hover:border-blue-300/45",
                    )}
                  >
                    <TokenAvatarTile token={token} selected={selected} className="mx-auto size-16" />
                    <div className="mt-2 truncate text-[10px] font-black text-slate-200">
                      {token.symbol}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl border border-lime-300/35 bg-lime-300/14 px-4 py-3 text-sm font-black text-lime-100 transition hover:bg-lime-300/20 hover:shadow-[0_0_28px_rgba(132,204,22,0.18)]"
          >
            {t("profile.save")}
          </button>
        </div>
      </form>
    </div>
  );
}

function TokenSelectionModal({
  tokens,
  selectedSymbols,
  onClose,
  onSelect,
}: {
  tokens: Token[];
  selectedSymbols: Set<string>;
  onClose: () => void;
  onSelect: (token: Token) => void;
}) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredTokens = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return tokens;
    }

    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query),
    );
  }, [searchTerm, tokens]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 px-3 py-4 backdrop-blur-md sm:px-5 sm:py-6">
      <div className="relative max-h-[92vh] w-full max-w-[1280px] overflow-hidden rounded-2xl border border-blue-300/32 bg-slate-950/96 shadow-[0_0_70px_rgba(37,99,235,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <span className="pointer-events-none absolute left-10 top-10 h-44 w-44 rounded-full bg-blue-500/14 blur-3xl" />
        <span className="pointer-events-none absolute bottom-8 right-12 h-44 w-44 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="relative z-10 border-b border-white/10 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">{t("squad.chooseTitle")}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-300">{t("squad.chooseSubtitle")}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/6 text-sm font-black text-slate-200 transition hover:border-blue-300/40 hover:text-white"
              aria-label="Close"
            >
              X
            </button>
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("squad.searchPlaceholder")}
            className="mt-4 w-full rounded-xl border border-blue-300/18 bg-slate-900/78 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300/45 focus:shadow-[0_0_24px_rgba(132,204,22,0.12)]"
          />
        </div>
        <div className="relative z-10 max-h-[68vh] overflow-y-auto p-4 sm:p-5">
          {filteredTokens.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {filteredTokens.map((token, index) => {
                const tone = tokenTones[token.symbol] ?? "blue";
                const stance = mapStance(token.change7d > 10 ? "Bullish" : token.change7d < 0 ? "Risky" : "Neutral");
                const isInSquad = selectedSymbols.has(token.symbol);

                return (
                  <button
                    key={token.address}
                    type="button"
                    disabled={isInSquad}
                    onClick={() => onSelect(token)}
                    className={cx(
                      "group overflow-hidden rounded-2xl border bg-gradient-to-b from-slate-900/86 to-slate-950/92 p-2 text-left shadow-[0_16px_38px_rgba(0,0,0,0.28)] transition",
                      isInSquad
                        ? "cursor-not-allowed border-white/10 opacity-45 grayscale"
                        : "border-blue-300/20 hover:-translate-y-1 hover:border-lime-300/50 hover:shadow-[0_20px_46px_rgba(37,99,235,0.18)]",
                    )}
                  >
                    <div className="relative">
                      <CharacterPlaceholder token={token} tone={tone} className="h-44 rounded-xl" />
                      {isInSquad ? (
                        <div className="absolute left-3 top-3 rounded-lg border border-lime-300/35 bg-lime-300/16 px-2 py-1 text-[10px] font-black uppercase text-lime-100 backdrop-blur">
                          {t("squad.inSquad")}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-lg font-black text-white">{token.symbol}</div>
                        <div className="truncate text-xs font-semibold text-slate-300">{token.sector}</div>
                      </div>
                      <StanceBadge stance={stance} />
                    </div>
                    <div className="mt-1 truncate text-xs font-semibold text-slate-500">{token.name}</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-slate-900/52 p-2">
                      <MiniMetric label={t("metric.performance")} value={formatPercent(token.change7d)} />
                      <MiniMetric label={t("metric.xp")} value={getTokenXp(token, index).toString()} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-lime-300/20 bg-lime-300/8 p-8 text-center text-xl font-black text-lime-200">
              {t("squad.noResults")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SquadBuilderExperience({
  squadSlots,
  onSelectToken,
  onRemoveToken,
}: {
  squadSlots: SquadSlot[];
  onSelectToken: (slotIndex: number, token: Token) => void;
  onRemoveToken: (slotIndex: number) => void;
}) {
  const { t } = useLanguage();
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const filledSlotCount = squadSlots.filter(Boolean).length;
  const selectedSymbols = new Set(
    squadSlots.flatMap((slot) => (slot ? [slot.token.symbol] : [])),
  );

  function handleSelectToken(token: Token) {
    if (activeSlotIndex === null) {
      return;
    }

    onSelectToken(activeSlotIndex, token);
    setActiveSlotIndex(null);
  }

  return (
    <section className="relative flex min-h-full flex-col overflow-hidden rounded-2xl border border-blue-300/24 bg-slate-900/66 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3),0_0_38px_rgba(37,99,235,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <span className="pointer-events-none absolute left-8 top-20 h-56 w-56 rounded-full bg-blue-500/12 blur-3xl" />
      <span className="pointer-events-none absolute bottom-10 right-16 h-48 w-48 rounded-full bg-lime-300/10 blur-3xl" />
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-lg border border-lime-300/20 bg-lime-300/8 px-3 py-1 text-xs font-black text-lime-200">
            {t("demo.notice")}
          </div>
          <h1 className="mt-3 text-3xl font-black leading-none text-white md:text-4xl">
            {t("section.yourSquad")}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            {t("hero.subtitle")}
          </p>
        </div>
        <div
          className="rounded-2xl border border-lime-300/20 bg-lime-300/8 px-4 py-3 text-sm font-black text-lime-200"
          title={filledSlotCount === maxSquadSlots ? t("squad.full") : undefined}
        >
          {filledSlotCount} / {maxSquadSlots} {t("squad.slots").toUpperCase()}
        </div>
      </div>
      <div className="relative z-10 mt-5 grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {squadSlots.map((slot, index) => (
          slot ? (
            <SquadGameCard
              key={`${index}-${slot.token.address}`}
              token={slot.token}
              entry={slot.entry}
              index={index}
              onRemove={() => onRemoveToken(index)}
            />
          ) : (
            <AddGameCard
              key={`empty-${index}`}
              index={index}
              onClick={() => setActiveSlotIndex(index)}
            />
          )
        ))}
      </div>
      {activeSlotIndex !== null ? (
        <TokenSelectionModal
          tokens={squadSelectionTokens}
          selectedSymbols={selectedSymbols}
          onClose={() => setActiveSlotIndex(null)}
          onSelect={handleSelectToken}
        />
      ) : null}
    </section>
  );
}

function GameLobbyScreen() {
  const [squadSlots, setSquadSlots] = useState<SquadSlot[]>(() =>
    getStoredSquadSlots(),
  );
  const [connectedWallet, setConnectedWallet] = useState<string | null>(() =>
    loadStoredWalletSession(),
  );
  const [watcherProfile, setWatcherProfile] = useState<WatcherProfile | null>(() =>
    loadStoredWatcherProfile(loadStoredWalletSession()),
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const totals = useMemo(() => getSquadTotals(squadSlots), [squadSlots]);

  useEffect(() => {
    window.localStorage.setItem(
      squadStorageKey,
      JSON.stringify(squadSlots.map((slot) => slot?.token.symbol ?? null)),
    );
  }, [squadSlots]);

  useEffect(() => {
    if (connectedWallet) {
      window.localStorage.setItem(walletSessionStorageKey, connectedWallet);
      return;
    }

    window.localStorage.removeItem(walletSessionStorageKey);
  }, [connectedWallet]);

  useEffect(() => {
    if (connectedWallet && watcherProfile) {
      window.localStorage.setItem(
        getProfileStorageKey(connectedWallet),
        JSON.stringify(watcherProfile),
      );
    }
  }, [connectedWallet, watcherProfile]);

  function handleSelectToken(slotIndex: number, token: Token) {
    setSquadSlots((currentSlots) => {
      if (currentSlots.some((slot) => slot?.token.symbol === token.symbol)) {
        return currentSlots;
      }

      return currentSlots.map((slot, index) =>
        index === slotIndex ? { token, entry: getEntryForToken(token) } : slot,
      );
    });
  }

  function handleRemoveToken(slotIndex: number) {
    setSquadSlots((currentSlots) =>
      currentSlots.map((slot, index) => (index === slotIndex ? null : slot)),
    );
  }

  return (
    <div className="grid gap-4 lg:min-h-[calc(100vh-96px)] xl:grid-cols-[250px_minmax(0,1fr)_290px]">
      <WeeklySeasonPanel totals={totals} />
      <SquadBuilderExperience
        squadSlots={squadSlots}
        onSelectToken={handleSelectToken}
        onRemoveToken={handleRemoveToken}
      />
      <WeeklyScorePanel
        totals={totals}
        profile={watcherProfile}
        walletAddress={connectedWallet}
        onConnectWallet={() => {
          setConnectedWallet(mockWalletAddress);
          setWatcherProfile(loadStoredWatcherProfile(mockWalletAddress));
        }}
        onDisconnectWallet={() => {
          setConnectedWallet(null);
          setWatcherProfile(null);
          setIsProfileModalOpen(false);
        }}
        onEditProfile={() => setIsProfileModalOpen(true)}
      />
      {isProfileModalOpen && connectedWallet ? (
        <ProfileSetupModal
          profile={watcherProfile}
          walletAddress={connectedWallet}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={(nextProfile) => {
            setWatcherProfile(nextProfile);
            setIsProfileModalOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function ProfilePanel({ address = users[0].address }: { address?: string }) {
  const { t } = useLanguage();
  const user = getUserByAddress(address) ?? users[0];
  const stats = userWatchStats(user);

  return (
    <GamePanel className="p-5">
      <PanelTitle title={t("section.profile")} />
      <div className="mt-5 flex items-center gap-4">
        <PixelAvatar label={user.avatar} tone="green" selected />
        <div className="min-w-0 flex-1">
          <div className="font-black text-white">{address === users[0].address ? t("profile.handle") : `@${user.handle}`}</div>
          <div className="text-sm text-slate-400">{address === users[0].address ? t("profile.role") : user.role}</div>
          <div className="mt-2">
            <XpBar value={1250} max={2000} />
            <div className="mt-1 text-right text-[11px] text-slate-500">1,250 / 2,000 XP</div>
          </div>
        </div>
      </div>
      <button className="mt-5 w-full rounded-xl border border-blue-400/40 bg-blue-500/16 px-4 py-3 text-sm font-black text-white">
        {t("profile.connect")}
      </button>
      <div className="mt-5 text-xs font-black uppercase tracking-wide text-slate-400">
        {t("profile.chooseAvatar")}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {avatarOptions.map((avatar, index) => (
          <PixelAvatar
            key={avatar}
            label={avatar}
            tone={(["green", "blue", "gold", "violet", "cyan", "rose", "blue", "gold"] as ArtTone[])[index]}
            selected={index === 0}
          />
        ))}
      </div>
      <Link
        href={`/watch/profile/${user.address}`}
        className="mt-5 block rounded-xl border border-blue-400/30 bg-black/24 px-4 py-3 text-center text-sm font-black text-blue-200 transition hover:bg-blue-500/10"
      >
        {t("profile.view")}
      </Link>
      {address !== users[0].address ? (
        <div className="mt-5 grid grid-cols-3 gap-4">
          <MiniMetric label={t("metric.hitRate")} value={formatPercent(stats.hitRate)} />
          <MiniMetric label={t("metric.watchScore")} value={user.reputation.toString()} />
          <MiniMetric label={t("metric.followers")} value={formatCompact(user.followers)} />
        </div>
      ) : null}
    </GamePanel>
  );
}

function MiniMetric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">{label}</div>
      <div className={cx("mt-1 text-lg font-black leading-none text-white", valueClassName)}>{value}</div>
    </div>
  );
}

function BadgesPanel() {
  const { t } = useLanguage();

  return (
    <GamePanel id="badges" className="p-5">
      <PanelTitle title={t("section.badges")} />
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {badgeKeys.map(([titleKey, metaKey, tone], index) => (
          <div key={titleKey} className="rounded-xl border border-white/10 bg-black/24 p-3">
            <div
              className={cx(
                "grid size-14 place-items-center rounded-2xl border text-2xl font-black",
                tone === "green" && "border-lime-300/30 bg-lime-300/10 text-lime-200",
                tone === "blue" && "border-blue-300/30 bg-blue-300/10 text-blue-200",
                tone === "gold" && "border-amber-300/30 bg-amber-300/10 text-amber-200",
                tone === "violet" && "border-violet-300/30 bg-violet-300/10 text-violet-200",
              )}
            >
              {index + 1}
            </div>
            <div className="mt-3 text-sm font-black text-white">{t(titleKey)}</div>
            <div className="text-xs text-slate-500">{t(metaKey)}</div>
          </div>
        ))}
      </div>
    </GamePanel>
  );
}

export function LandingPageView() {
  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <TopNavigation />
      <main className="mx-auto max-w-[1760px] px-4 py-4">
        <GameLobbyScreen />
      </main>
    </div>
  );
}

export function WatchDashboardView() {
  return (
    <GameLobbyScreen />
  );
}

function WatchlistLeagueCard({ watchlist }: { watchlist: Watchlist }) {
  const { t } = useLanguage();
  const owner = getUserByAddress(watchlist.ownerAddress);
  const performance = calculateWatchlistPerformance(watchlist);
  const score = calculateWatchlistScore(watchlist, baseTokens, comments);

  return (
    <Link
      href={`/watch/list/${watchlist.id}`}
      className="rounded-2xl border border-white/10 bg-black/24 p-4 transition hover:-translate-y-1 hover:border-blue-300/40"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-black text-white">{watchlist.title}</div>
          <div className="text-xs text-slate-500">@{owner?.handle ?? "watcher"}</div>
        </div>
        <div className="rounded-xl border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-sm font-black text-lime-200">
          {score}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {watchlist.entries.slice(0, 3).map((entry) => {
          const token = getTokenByAddress(entry.tokenAddress);
          return token ? (
            <span key={entry.tokenAddress} className="rounded-lg bg-white/7 px-2 py-1 text-xs font-black text-white">
              {token.symbol}
            </span>
          ) : null;
        })}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniMetric label={t("metric.performance")} value={formatPercent(performance.weightedReturn)} />
        <MiniMetric label={t("metric.hitRate")} value={formatPercent(performance.hitRate)} />
      </div>
    </Link>
  );
}

export function ProfilePageView({ address }: { address: string }) {
  const { t } = useLanguage();
  const user = getUserByAddress(address);

  if (!user) {
    return null;
  }

  const stats = userWatchStats(user);
  const bestLabel =
    stats.bestToken && stats.bestEntry
      ? `${stats.bestToken.symbol} ${formatPercent(getCallScore(stats.bestEntry))}`
      : "-";
  const userComments = comments.filter(
    (comment) => comment.authorAddress.toLowerCase() === user.address.toLowerCase(),
  );

  return (
    <div className="space-y-5">
      <Link href="/watch" className="text-sm font-black text-blue-300 hover:text-white">
        {t("nav.back")}
      </Link>
      <GamePanel className="p-6">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <PixelAvatar label={user.avatar} tone="green" selected />
          <div>
            <div className="text-sm font-black uppercase tracking-wide text-blue-300">{t("section.profile")}</div>
            <h1 className="mt-2 text-4xl font-black text-white">{user.displayName}</h1>
            <p className="mt-3 max-w-3xl text-slate-400">{user.bio}</p>
            <div className="mt-3 font-mono text-xs text-slate-500">{shortAddress(user.address)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MiniMetric label={t("metric.watchScore")} value={user.reputation.toString()} />
            <MiniMetric label={t("metric.bestCall")} value={bestLabel} />
            <MiniMetric label={t("metric.hitRate")} value={formatPercent(stats.hitRate)} />
            <MiniMetric label={t("metric.followers")} value={formatCompact(user.followers)} />
          </div>
        </div>
      </GamePanel>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-5">
          <ProfilePanel address={user.address} />
          <BadgesPanel />
        </div>
        <div className="space-y-5">
          <GamePanel className="p-5">
            <PanelTitle title={t("section.watchlists")} />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {stats.ownedLists.map((watchlist) => (
                <WatchlistLeagueCard key={watchlist.id} watchlist={watchlist} />
              ))}
            </div>
          </GamePanel>
          <GamePanel className="p-5">
            <PanelTitle title={t("section.signals")} />
            <div className="mt-4 space-y-2">
              {userComments.map((comment) => (
                <SignalRow key={comment.id} comment={comment} />
              ))}
            </div>
          </GamePanel>
        </div>
      </div>
    </div>
  );
}

function SignalRow({ comment }: { comment: Comment }) {
  const { t } = useLanguage();
  const author = getUserByAddress(comment.authorAddress);
  const action = gameActionForComment(comment);
  const token = action.token;

  return (
    <div className="grid gap-3 rounded-xl border border-white/8 bg-black/24 p-3 sm:grid-cols-[auto_1fr_auto]">
          <PixelAvatar label={author?.avatar ?? "MW"} tone="blue" size="sm" />
      <div className="min-w-0">
        <div className="text-sm text-slate-300">
          <span className="font-black text-white">@{author?.handle ?? "watcher"}</span>{" "}
          {t(action.key)} {token ? token.symbol : t("badge.top10")}
        </div>
        <div className="truncate text-xs text-slate-500">{comment.body}</div>
      </div>
      <div className="font-black text-lime-300">+{action.points}</div>
    </div>
  );
}

export function WatchlistDetailView({ id }: { id: string }) {
  const { t } = useLanguage();
  const watchlist = getWatchlistById(id);

  if (!watchlist) {
    return null;
  }

  const owner = getUserByAddress(watchlist.ownerAddress);
  const performance = calculateWatchlistPerformance(watchlist);
  const score = calculateWatchlistScore(watchlist, baseTokens, comments);
  const listComments = getCommentsForWatchlist(watchlist.id);

  return (
    <div className="space-y-5">
      <Link href="/watch" className="text-sm font-black text-blue-300 hover:text-white">
        {t("nav.back")}
      </Link>
      <GamePanel className="p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="text-sm font-black text-blue-300">
              {t("list.creator")} @{owner?.handle ?? "watcher"}
            </div>
            <h1 className="mt-3 text-4xl font-black text-white md:text-6xl">{watchlist.title}</h1>
            <p className="mt-4 max-w-3xl text-slate-400">{watchlist.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <MiniMetric label={t("metric.watchScore")} value={score.toString()} />
            <MiniMetric label={t("list.total")} value={formatPercent(performance.weightedReturn)} />
            <MiniMetric label={t("metric.hitRate")} value={formatPercent(performance.hitRate)} />
          </div>
        </div>
      </GamePanel>
      <GamePanel className="p-5">
        <PanelTitle title={t("list.tokens")} />
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {watchlist.entries.map((entry, index) => {
            const token = getTokenByAddress(entry.tokenAddress);
            return token ? (
              <TokenCharacterCard key={entry.tokenAddress} token={token} entry={entry} index={index} />
            ) : null;
          })}
        </div>
      </GamePanel>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <GamePanel className="p-5">
          <PanelTitle title={t("list.replies")} />
          <div className="mt-4 space-y-2">
            {listComments.map((comment) => (
              <SignalRow key={comment.id} comment={comment} />
            ))}
          </div>
        </GamePanel>
        <GamePanel className="p-5">
          <PanelTitle title={t("cta.futureSwap")} />
          <p className="mt-4 text-sm leading-6 text-slate-400">{t("cta.futureSwapText")}</p>
          <button
            disabled
            className="mt-5 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm font-black text-blue-200"
          >
            {t("cta.futureSwap")}
          </button>
        </GamePanel>
      </div>
    </div>
  );
}

export function TokenDetailView({ address }: { address: string }) {
  const { t } = useLanguage();
  const token = getTokenByAddress(address);

  if (!token) {
    return null;
  }

  const tokenComments = getCommentsForToken(token.address);
  const relatedWatchlists = getWatchlistsForToken(token.address);
  const score = calculateMergenWatchScore(token, tokenComments);
  const stance = dominantTokenStance(token);
  const topWatchers = relatedWatchlists
    .map((watchlist) => getUserByAddress(watchlist.ownerAddress))
    .filter((user): user is UserProfile => Boolean(user));

  return (
    <div className="space-y-5">
      <Link href="/watch" className="text-sm font-black text-blue-300 hover:text-white">
        {t("nav.back")}
      </Link>
      <GamePanel className="p-6">
        <div className="grid gap-6 lg:grid-cols-[0.55fr_1fr_0.8fr]">
          <TokenCharacterCard token={token} index={1} compact />
          <div>
            <StanceBadge stance={stance} />
            <h1 className="mt-4 text-6xl font-black text-white">{token.symbol}</h1>
            <div className="mt-2 text-xl text-slate-400">{token.name}</div>
            <p className="mt-5 max-w-2xl text-slate-400">{token.summary}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MiniMetric label={t("metric.watchScore")} value={score.toString()} />
            <MiniMetric label={t("metric.performance")} value={formatPercent(token.change7d)} />
            <MiniMetric label={t("metric.liquidity")} value={`$${formatCompact(token.liquidityUsd)}`} />
            <MiniMetric label={t("metric.mentions")} value={formatCompact(token.mentions)} />
            <MiniMetric label={t("metric.holders")} value={formatCompact(token.holders)} />
            <MiniMetric label={t("metric.price")} value={formatUsd(token.price)} />
          </div>
        </div>
      </GamePanel>
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr_0.85fr]">
        <GamePanel className="p-5">
          <PanelTitle title={t("token.watchers")} />
          <div className="mt-4 space-y-2">
            {topWatchers.map((user, index) => (
              <div key={user.address} className="rounded-xl border border-white/8 bg-black/24 p-3">
                <div className="flex items-center gap-3">
                  <PixelAvatar label={user.avatar} tone="green" size="sm" />
                  <div>
                    <Link href={`/watch/profile/${user.address}`} className="font-black text-white hover:text-blue-200">
                      @{user.handle}
                    </Link>
                    <div className="text-xs text-slate-500">#{index + 1} {t("metric.rank")}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GamePanel>
        <GamePanel className="p-5">
          <PanelTitle title={t("token.related")} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {relatedWatchlists.map((watchlist) => (
              <WatchlistLeagueCard key={watchlist.id} watchlist={watchlist} />
            ))}
          </div>
        </GamePanel>
        <div className="space-y-5">
          <GamePanel className="p-5">
            <PanelTitle title={t("section.signals")} />
            <div className="mt-4 space-y-2">
              {tokenComments.map((comment) => (
                <SignalRow key={comment.id} comment={comment} />
              ))}
            </div>
          </GamePanel>
          <GamePanel className="p-5">
            <PanelTitle title={t("token.safety")} />
            <p className="mt-4 text-sm leading-6 text-slate-400">{t("token.safetyText")}</p>
          </GamePanel>
        </div>
      </div>
    </div>
  );
}
