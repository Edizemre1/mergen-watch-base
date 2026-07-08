"use client";

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
import type { Comment, Stance, Token, UserProfile, Watchlist } from "@/lib/types";

const githubUrl = "https://github.com/Edizemre1/mergen-watch-base";
const stances: Stance[] = ["Bullish", "Neutral", "Risky", "Avoid"];

function stanceKey(stance: Stance): CopyKey {
  return `stance.${stance}` as CopyKey;
}

function toneClass(value: number) {
  return value >= 0 ? "text-emerald-200" : "text-rose-200";
}

function dateLabel(value: string, language: "en" | "tr") {
  return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
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

function dominantStance(token: Token): Stance {
  const entries = getWatchlistsForToken(token.address).flatMap((watchlist) =>
    watchlist.entries.filter(
      (entry) => entry.tokenAddress.toLowerCase() === token.address.toLowerCase(),
    ),
  );

  return (
    stances
      .map((stance) => ({
        stance,
        count: entries.filter((entry) => entry.stance === stance).length,
      }))
      .sort((a, b) => b.count - a.count)[0]?.stance ?? "Neutral"
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.035] ${className}`}>
      {children}
    </div>
  );
}

function Avatar({ label, size = "md" }: { label: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "size-16 text-xl" : size === "sm" ? "size-9 text-xs" : "size-11 text-sm";

  return (
    <span
      className={`grid ${sizeClass} shrink-0 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 font-semibold text-sky-100`}
    >
      {label}
    </span>
  );
}

function Metric({
  label,
  value,
  tone = "white",
}: {
  label: string;
  value: string;
  tone?: "white" | "green" | "blue" | "amber" | "rose";
}) {
  const tones = {
    white: "text-white",
    green: "text-emerald-200",
    blue: "text-sky-200",
    amber: "text-amber-200",
    rose: "text-rose-200",
  };

  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/38">
        {label}
      </div>
      <div className={`mt-1 text-xl font-semibold ${tones[tone]}`}>{value}</div>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  children,
}: {
  label?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      {label ? (
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/70">
          {label}
        </div>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58">
          {children}
        </p>
      ) : null}
    </div>
  );
}

function DemoNotice({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();

  return (
    <div
      className={`rounded-full border border-emerald-300/18 bg-emerald-300/8 text-emerald-50/82 ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      {t("demo.notice")}
    </div>
  );
}

function TopNavigation() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070c]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 text-sm font-black text-emerald-100">
            M
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">
            {t("brand.short")}
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/watch"
            className="rounded-full px-3 py-2 text-sm text-white/62 transition hover:bg-white/8 hover:text-white"
          >
            {t("nav.watch")}
          </Link>
          <Link
            href="/#roadmap"
            className="rounded-full px-3 py-2 text-sm text-white/62 transition hover:bg-white/8 hover:text-white"
          >
            {t("nav.roadmap")}
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-3 py-2 text-sm text-white/62 transition hover:bg-white/8 hover:text-white"
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
    <div className="min-h-screen bg-[#05070c] text-white">
      <TopNavigation />
      <main className="mx-auto w-full max-w-7xl px-5 py-8 md:py-10">
        {children}
      </main>
    </div>
  );
}

function StanceChip({ stance }: { stance: Stance }) {
  const { t } = useLanguage();
  const classes: Record<Stance, string> = {
    Bullish: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    Neutral: "border-sky-300/25 bg-sky-300/10 text-sky-100",
    Risky: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    Avoid: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[stance]}`}>
      {t(stanceKey(stance))}
    </span>
  );
}

function TokenPill({ token, stance }: { token: Token; stance?: Stance }) {
  return (
    <Link
      href={`/watch/token/${token.address}`}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/24 px-3 py-2 transition hover:border-sky-300/30 hover:bg-white/[0.055]"
    >
      <span className="text-sm font-semibold text-white">{token.symbol}</span>
      {stance ? <StanceChip stance={stance} /> : null}
    </Link>
  );
}

function WatchlistNetworkCard({
  watchlist,
  featured = false,
}: {
  watchlist: Watchlist;
  featured?: boolean;
}) {
  const { t } = useLanguage();
  const owner = getUserByAddress(watchlist.ownerAddress);
  const performance = calculateWatchlistPerformance(watchlist);
  const score = calculateWatchlistScore(watchlist, baseTokens, comments);

  return (
    <Card className={`p-5 ${featured ? "bg-sky-300/[0.055]" : ""}`}>
      <div className="flex items-start gap-3">
        <Avatar label={owner?.avatar ?? "MW"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link
                href={`/watch/list/${watchlist.id}`}
                className="text-lg font-semibold text-white transition hover:text-sky-100"
              >
                {watchlist.title}
              </Link>
              <div className="mt-0.5 text-sm text-white/42">
                {t("label.by")} @{owner?.handle ?? "unknown"}
              </div>
            </div>
            <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-sm font-semibold text-sky-100">
              {score}
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/58">
            {watchlist.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {watchlist.entries.slice(0, 3).map((entry) => {
              const token = getTokenByAddress(entry.tokenAddress);
              return token ? (
                <TokenPill key={entry.tokenAddress} token={token} stance={entry.stance} />
              ) : null;
            })}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            <Metric
              label={t("metric.performance")}
              value={formatPercent(performance.weightedReturn)}
              tone={performance.weightedReturn >= 0 ? "green" : "rose"}
            />
            <Metric label={t("metric.hitRate")} value={formatPercent(performance.hitRate)} tone="amber" />
            <Metric label={t("metric.followers")} value={formatCompact(watchlist.followers)} tone="blue" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function SignalPost({ comment }: { comment: Comment }) {
  const { language, t } = useLanguage();
  const author = getUserByAddress(comment.authorAddress);
  const token =
    comment.targetType === "token" ? getTokenByAddress(comment.targetId) : null;
  const watchlist =
    comment.targetType === "watchlist" ? getWatchlistById(comment.targetId) : null;
  const href = token
    ? `/watch/token/${token.address}`
    : watchlist
      ? `/watch/list/${watchlist.id}`
      : "/watch";

  return (
    <Card className="p-5">
      <div className="flex gap-3">
        <Avatar label={author?.avatar ?? "MW"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link
                href={author ? `/watch/profile/${author.address}` : "/watch"}
                className="font-semibold text-white transition hover:text-sky-100"
              >
                {author?.displayName ?? "Mergen Watch"}
              </Link>
              <div className="text-sm text-white/40">
                @{author?.handle ?? "network"} · {dateLabel(comment.createdAt, language)}
              </div>
            </div>
            {comment.stance ? <StanceChip stance={comment.stance} /> : null}
          </div>
          <p className="mt-4 text-[15px] leading-7 text-white/72">{comment.body}</p>
          <Link
            href={href}
            className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-emerald-300/25 hover:text-white"
          >
            {token ? `${t("cta.viewToken")} ${token.symbol}` : t("cta.viewList")}
          </Link>
          <div className="mt-4 flex items-center gap-5 text-xs text-white/38">
            <span>{comment.likes} {t("label.likes")}</span>
            <span>12 {t("label.replies")}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function WatcherRow({ user, rank }: { user: UserProfile; rank: number }) {
  const { t } = useLanguage();
  const stats = userWatchStats(user);
  const bestLabel =
    stats.bestToken && stats.bestEntry
      ? `${stats.bestToken.symbol} ${formatPercent(getCallScore(stats.bestEntry))}`
      : "-";

  return (
    <Link
      href={`/watch/profile/${user.address}`}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-sky-300/25 hover:bg-white/[0.055]"
    >
      <span className="w-5 text-sm font-semibold text-white/38">#{rank}</span>
      <Avatar label={user.avatar} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-white">{user.displayName}</div>
        <div className="text-xs text-white/40">@{user.handle}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-sky-100">{user.reputation}</div>
        <div className="text-[11px] text-white/36">{t("metric.watchScore")}</div>
      </div>
      <div className="hidden text-right sm:block">
        <div className="text-sm font-semibold text-emerald-100">{bestLabel}</div>
        <div className="text-[11px] text-white/36">{t("metric.bestCall")}</div>
      </div>
    </Link>
  );
}

function ProductPreview() {
  const { t } = useLanguage();
  const list = watchlists[0];
  const owner = getUserByAddress(list.ownerAddress);
  const token = baseTokens[0];
  const watcher = users[0];
  const score = calculateMergenWatchScore(token, getCommentsForToken(token.address));

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-[2rem] border border-sky-300/10 bg-sky-300/6" />
      <Card className="relative overflow-hidden rounded-[2rem] bg-[#07101a]/92 p-4 shadow-2xl shadow-black/40">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-sky-200/64">
              {t("landing.preview")}
            </div>
            <div className="mt-1 text-lg font-semibold text-white">Base watch network</div>
          </div>
          <DemoNotice compact />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/38">
                {t("landing.feedTitle")}
              </div>
              <div className="flex gap-3">
                <Avatar label="BS" size="sm" />
                <div>
                  <div className="text-sm font-semibold text-white">Base Signal Desk</div>
                  <p className="mt-2 text-sm leading-6 text-white/64">
                    {t("landing.feedBody")}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <StanceChip stance="Bullish" />
                    <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">
                      +31.5%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/38">
                {t("landing.watchlistTitle")}
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-white">{list.title}</div>
                  <div className="mt-1 text-sm text-white/42">@{owner?.handle}</div>
                </div>
                <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-sm font-semibold text-sky-100">
                  83
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {list.entries.slice(0, 3).map((entry) => {
                  const entryToken = getTokenByAddress(entry.tokenAddress);
                  return entryToken ? (
                    <TokenPill key={entry.tokenAddress} token={entryToken} stance={entry.stance} />
                  ) : null;
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/38">
                {t("landing.watcherTitle")}
              </div>
              <div className="flex items-center gap-3">
                <Avatar label={watcher.avatar} />
                <div className="flex-1">
                  <div className="font-semibold text-white">{watcher.displayName}</div>
                  <div className="text-sm text-white/42">@{watcher.handle}</div>
                </div>
                <Metric label={t("metric.watchScore")} value={watcher.reputation.toString()} tone="blue" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/38">
                {t("landing.tokenTitle")}
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-3xl font-semibold text-white">{token.symbol}</div>
                  <div className="mt-1 text-sm text-white/44">{token.name}</div>
                </div>
                <StanceChip stance="Bullish" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <Metric label={t("metric.watchScore")} value={score.toString()} tone="blue" />
                <Metric label="7D" value={formatPercent(token.change7d)} tone="green" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function LandingPageView() {
  const { t } = useLanguage();
  const pillars = [
    ["landing.pillar1", "landing.pillar1Text"],
    ["landing.pillar2", "landing.pillar2Text"],
    ["landing.pillar3", "landing.pillar3Text"],
  ] as const;

  return (
    <div className="min-h-screen bg-[#05070c] text-white">
      <TopNavigation />
      <main className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <section className="grid min-h-[72vh] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <DemoNotice />
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
              {t("landing.headline")}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-white/68">
              {t("landing.subheadline")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/watch"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#061017] transition hover:bg-emerald-100"
              >
                {t("landing.primary")}
              </Link>
              <Link
                href="#roadmap"
                className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t("landing.secondary")}
              </Link>
            </div>
          </div>
          <ProductPreview />
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {pillars.map(([titleKey, textKey]) => (
            <Card key={titleKey} className="p-6">
              <div className="mb-5 h-1 w-12 rounded-full bg-emerald-300" />
              <h2 className="text-xl font-semibold text-white">{t(titleKey)}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{t(textKey)}</p>
            </Card>
          ))}
        </section>

        <section id="roadmap" className="mt-16 border-t border-white/10 pt-10">
          <SectionHeader title={t("landing.roadmapTitle")}>
            {t("landing.roadmapText")}
          </SectionHeader>
        </section>
      </main>
    </div>
  );
}

export function WatchDashboardView() {
  const { t } = useLanguage();
  const topWatchers = [...users].sort((a, b) => b.reputation - a.reputation);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader title={t("watch.title")}>{t("watch.subtitle")}</SectionHeader>
        <DemoNotice compact />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.25fr_0.85fr]">
        <aside className="space-y-4">
          <SectionHeader title={t("watch.left")} />
          {watchlists.slice(0, 3).map((watchlist, index) => (
            <WatchlistNetworkCard
              key={watchlist.id}
              watchlist={watchlist}
              featured={index === 0}
            />
          ))}
        </aside>

        <section className="space-y-4">
          <SectionHeader title={t("watch.center")} />
          {comments.slice(0, 5).map((comment) => (
            <SignalPost key={comment.id} comment={comment} />
          ))}
        </section>

        <aside className="space-y-4">
          <SectionHeader title={t("watch.right")} />
          <Card className="p-4">
            <div className="mb-4 text-sm font-semibold text-white">
              {t("watch.leaderboard")}
            </div>
            <div className="space-y-3">
              {topWatchers.map((user, index) => (
                <WatcherRow key={user.address} user={user} rank={index + 1} />
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-white">{t("watch.how")}</div>
            <div className="mt-4 space-y-3 text-sm text-white/58">
              {[t("watch.how1"), t("watch.how2"), t("watch.how3")].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-white/8 text-xs font-semibold text-emerald-100">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export function ProfilePageView({ address }: { address: string }) {
  const { language, t } = useLanguage();
  const user = getUserByAddress(address);

  if (!user) {
    return null;
  }

  const stats = userWatchStats(user);
  const userComments = comments.filter(
    (comment) => comment.authorAddress.toLowerCase() === user.address.toLowerCase(),
  );
  const bestLabel =
    stats.bestToken && stats.bestEntry
      ? `${stats.bestToken.symbol} ${formatPercent(getCallScore(stats.bestEntry))}`
      : "-";

  return (
    <div className="space-y-8">
      <Link href="/watch" className="text-sm text-white/52 transition hover:text-white">
        {t("nav.back")}
      </Link>

      <Card className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-5">
            <Avatar label={user.avatar} size="lg" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/70">
                {t("profile.title")}
              </div>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
                {user.displayName}
              </h1>
              <div className="mt-2 text-white/48">
                @{user.handle} · {shortAddress(user.address)}
              </div>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/64">
                {user.bio}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Metric label={t("metric.watchScore")} value={user.reputation.toString()} tone="blue" />
            <Metric label={t("profile.bestCall")} value={bestLabel} tone="green" />
            <Metric label={t("metric.hitRate")} value={formatPercent(stats.hitRate)} tone="amber" />
            <Metric label={t("metric.followers")} value={formatCompact(user.followers)} />
          </div>
        </div>
        <div className="mt-6 text-sm text-white/42">
          {t("label.joined")} {dateLabel(user.joined, language)}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-4">
          <SectionHeader title={t("profile.publicWatchlists")} />
          {stats.ownedLists.map((watchlist) => (
            <WatchlistNetworkCard key={watchlist.id} watchlist={watchlist} />
          ))}
          <SectionHeader title={t("profile.badges")} />
          <Card className="p-5">
            <div className="space-y-3">
              {user.badges.map((badge) => (
                <div key={badge.label} className="rounded-2xl bg-black/24 p-4">
                  <div className="font-semibold text-white">{badge.label}</div>
                  <p className="mt-1 text-sm leading-6 text-white/56">{badge.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <SectionHeader title={t("profile.recentSignals")}>{t("profile.subtitle")}</SectionHeader>
          {userComments.length > 0 ? (
            userComments.map((comment) => <SignalPost key={comment.id} comment={comment} />)
          ) : (
            <Card className="p-5 text-white/50">{t("label.empty")}</Card>
          )}
        </section>
      </div>
    </div>
  );
}

function StanceDistribution({ entries }: { entries: Watchlist["entries"] }) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {stances.map((stance) => {
        const count = entries.filter((entry) => entry.stance === stance).length;
        return (
          <div key={stance} className="rounded-2xl border border-white/10 bg-black/24 p-3">
            <StanceChip stance={stance} />
            <div className="mt-3 text-2xl font-semibold text-white">{count}</div>
            <div className="text-xs text-white/38">{t("list.stanceMix")}</div>
          </div>
        );
      })}
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
  const listComments = getCommentsForWatchlist(watchlist.id);
  const performance = calculateWatchlistPerformance(watchlist);
  const score = calculateWatchlistScore(watchlist, baseTokens, comments);

  return (
    <div className="space-y-8">
      <Link href="/watch" className="text-sm text-white/52 transition hover:text-white">
        {t("nav.back")}
      </Link>

      <Card className="p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.62fr]">
          <div>
            <div className="text-sm text-sky-200/72">{t("list.creator")}</div>
            <Link
              href={owner ? `/watch/profile/${owner.address}` : "/watch"}
              className="mt-2 inline-flex items-center gap-3 text-white/72 transition hover:text-white"
            >
              <Avatar label={owner?.avatar ?? "MW"} size="sm" />
              @{owner?.handle ?? "unknown"}
            </Link>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {watchlist.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/64">
              {watchlist.description}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Metric label={t("metric.watchScore")} value={score.toString()} tone="blue" />
            <Metric
              label={t("list.totalPerformance")}
              value={formatPercent(performance.weightedReturn)}
              tone={performance.weightedReturn >= 0 ? "green" : "rose"}
            />
            <Metric label={t("metric.hitRate")} value={formatPercent(performance.hitRate)} tone="amber" />
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <SectionHeader title={t("list.stanceMix")} />
        <StanceDistribution entries={watchlist.entries} />
      </section>

      <section className="space-y-4">
        <SectionHeader title={t("list.tokens")}>{t("list.subtitle")}</SectionHeader>
        <div className="space-y-3">
          {watchlist.entries.map((entry) => {
            const token = getTokenByAddress(entry.tokenAddress);
            if (!token) {
              return null;
            }
            const returnPct = getEntryReturnPct(entry);

            return (
              <Card key={entry.tokenAddress} className="p-4">
                <div className="grid gap-4 md:grid-cols-[0.45fr_0.85fr_0.28fr] md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full bg-white/8 text-sm font-semibold text-white">
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <Link
                        href={`/watch/token/${token.address}`}
                        className="font-semibold text-white transition hover:text-sky-100"
                      >
                        {token.symbol}
                      </Link>
                      <div className="text-sm text-white/42">{token.name}</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StanceChip stance={entry.stance} />
                      <span className="text-xs text-white/38">
                        {t("metric.conviction")} {entry.conviction}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/60">{entry.thesis}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className={`text-lg font-semibold ${toneClass(returnPct)}`}>
                      {formatPercent(returnPct)}
                    </div>
                    <Link
                      href={`/watch/token/${token.address}`}
                      className="mt-2 inline-flex text-xs font-semibold text-sky-100 hover:text-white"
                    >
                      {t("cta.viewToken")}
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
        <div className="space-y-4">
          <SectionHeader title={t("list.replies")} />
          {listComments.map((comment) => (
            <SignalPost key={comment.id} comment={comment} />
          ))}
        </div>
        <Card className="h-fit p-5">
          <div className="text-lg font-semibold text-white">{t("cta.futureSwap")}</div>
          <p className="mt-3 text-sm leading-7 text-white/58">{t("cta.futureSwapText")}</p>
          <button
            type="button"
            disabled
            className="mt-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/42"
          >
            {t("cta.futureSwap")}
          </button>
        </Card>
      </section>
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
  const relatedEntries = relatedWatchlists.flatMap((watchlist) =>
    watchlist.entries.filter(
      (entry) => entry.tokenAddress.toLowerCase() === token.address.toLowerCase(),
    ),
  );
  const score = calculateMergenWatchScore(token, tokenComments);
  const communityStance = dominantStance(token);
  const topWatchers = relatedWatchlists
    .map((watchlist) => getUserByAddress(watchlist.ownerAddress))
    .filter((user): user is UserProfile => Boolean(user));

  return (
    <div className="space-y-8">
      <Link href="/watch" className="text-sm text-white/52 transition hover:text-white">
        {t("nav.back")}
      </Link>

      <Card className="p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StanceChip stance={communityStance} />
              <span className="text-sm text-white/42">{t("token.communityStance")}</span>
            </div>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white md:text-7xl">
              {token.symbol}
            </h1>
            <div className="mt-2 text-xl text-white/58">{token.name}</div>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/64">
              {token.summary}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Metric label={t("metric.watchScore")} value={score.toString()} tone="blue" />
            <Metric label={t("metric.price")} value={formatUsd(token.price)} />
            <Metric label="7D" value={formatPercent(token.change7d)} tone={token.change7d >= 0 ? "green" : "rose"} />
            <Metric label={t("metric.liquidity")} value={`$${formatCompact(token.liquidityUsd)}`} tone="amber" />
            <Metric label={t("metric.mentions")} value={formatCompact(token.mentions)} />
            <Metric label={t("metric.holders")} value={formatCompact(token.holders)} />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr_0.75fr]">
        <aside className="space-y-4">
          <SectionHeader title={t("token.topWatchers")} />
          {topWatchers.map((user, index) => (
            <WatcherRow key={user.address} user={user} rank={index + 1} />
          ))}

          <Card className="p-5">
            <div className="text-lg font-semibold text-white">{t("token.safety")}</div>
            <p className="mt-3 text-sm leading-7 text-white/58">{t("token.safetyText")}</p>
          </Card>
        </aside>

        <section className="space-y-4">
          <SectionHeader title={t("token.recentSignals")}>{t("token.subtitle")}</SectionHeader>
          {tokenComments.length > 0 ? (
            tokenComments.map((comment) => <SignalPost key={comment.id} comment={comment} />)
          ) : (
            <Card className="p-5 text-white/50">{t("label.empty")}</Card>
          )}
        </section>

        <aside className="space-y-4">
          <SectionHeader title={t("token.relatedLists")} />
          {relatedWatchlists.map((watchlist) => {
            const entry = relatedEntries.find(
              (item) =>
                item.tokenAddress.toLowerCase() === token.address.toLowerCase() &&
                watchlist.entries.includes(item),
            );

            return (
              <Card key={watchlist.id} className="p-4">
                <Link
                  href={`/watch/list/${watchlist.id}`}
                  className="font-semibold text-white transition hover:text-sky-100"
                >
                  {watchlist.title}
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {entry ? <StanceChip stance={entry.stance} /> : null}
                  <span className="text-xs text-white/42">
                    {formatCompact(watchlist.followers)} {t("metric.followers")}
                  </span>
                </div>
              </Card>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
