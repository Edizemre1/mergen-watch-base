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
  getCallScore,
  getEntryReturnPct,
  shortAddress,
} from "@/lib/performance";
import type { Comment, Stance, Token, Watchlist } from "@/lib/types";

const githubUrl = "https://github.com/Edizemre1/mergen-watch-base";
const stances: Stance[] = ["Bullish", "Neutral", "Risky", "Avoid"];

function stanceKey(stance: Stance): CopyKey {
  return `stance.${stance}` as CopyKey;
}

function dateLabel(value: string, language: "en" | "tr") {
  return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function toneClass(value: number) {
  return value >= 0 ? "text-emerald-100" : "text-rose-100";
}

function SectionTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/70">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
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

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-white/10 bg-white/[0.035] ${className}`}>
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "white",
}: {
  label: string;
  value: string;
  tone?: "white" | "green" | "cyan" | "amber" | "rose";
}) {
  const toneClasses = {
    white: "text-white",
    green: "text-emerald-100",
    cyan: "text-cyan-100",
    amber: "text-amber-100",
    rose: "text-rose-100",
  };

  return (
    <div>
      <div className="text-xs uppercase tracking-[0.15em] text-white/40">
        {label}
      </div>
      <div className={`mt-1 text-xl font-semibold ${toneClasses[tone]}`}>
        {value}
      </div>
    </div>
  );
}

function DemoBadge() {
  const { t } = useLanguage();

  return (
    <span className="inline-flex rounded-md border border-emerald-200/20 bg-emerald-200/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">
      {t("common.publicDemo")}
    </span>
  );
}

function DemoNotice() {
  const { t } = useLanguage();

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/62">
      <span className="font-semibold text-white">{t("common.mockData")}:</span>{" "}
      {t("common.demoNotice")}
    </div>
  );
}

function TopNavigation() {
  const { t } = useLanguage();
  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/watch", label: t("nav.watch") },
    { href: "/#roadmap", label: t("nav.roadmap") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050706]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md border border-emerald-200/25 bg-emerald-200/10 text-sm font-bold text-emerald-100">
            MW
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">
              Mergen Watch Base
            </span>
            <span className="block text-xs text-white/42">
              {t("common.publicDemo")}
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-white/62 transition hover:bg-white/8 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2 text-sm text-white/62 transition hover:bg-white/8 hover:text-white"
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
    <div className="min-h-screen bg-[#050706] text-white">
      <TopNavigation />
      <main className="mx-auto w-full max-w-6xl px-5 py-8 md:py-10">
        {children}
      </main>
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
      <SectionTitle eyebrow={eyebrow} title={title}>
        {subtitle}
      </SectionTitle>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function StanceBadge({ stance }: { stance: Stance }) {
  const { t } = useLanguage();
  const classes: Record<Stance, string> = {
    Bullish: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    Neutral: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
    Risky: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    Avoid: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  };

  return (
    <span
      className={`inline-flex min-w-18 items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold ${classes[stance]}`}
    >
      {t(stanceKey(stance))}
    </span>
  );
}

function ScorePill({ score }: { score: number }) {
  return (
    <span className="rounded-md border border-cyan-200/20 bg-cyan-200/10 px-2.5 py-1 text-sm font-semibold text-cyan-100">
      {score}
    </span>
  );
}

function WatchlistCard({ watchlist }: { watchlist: Watchlist }) {
  const { t } = useLanguage();
  const owner = getUserByAddress(watchlist.ownerAddress);
  const performance = calculateWatchlistPerformance(watchlist);
  const score = calculateWatchlistScore(watchlist, baseTokens, comments);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/watch/list/${watchlist.id}`}
            className="text-lg font-semibold text-white transition hover:text-emerald-100"
          >
            {watchlist.title}
          </Link>
          <div className="mt-1 text-sm text-white/42">
            {owner ? `@${owner.handle}` : t("common.notAvailable")}
          </div>
        </div>
        <ScorePill score={score} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/58">
        {watchlist.description}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-4">
        <Metric
          label={t("common.entries")}
          value={watchlist.entries.length.toString()}
        />
        <Metric
          label={t("common.hitRate")}
          value={formatPercent(performance.hitRate)}
          tone="amber"
        />
        <Metric
          label={t("common.return")}
          value={formatPercent(performance.weightedReturn)}
          tone={performance.weightedReturn >= 0 ? "green" : "rose"}
        />
      </div>
    </Card>
  );
}

function WatcherCard({ address }: { address: string }) {
  const { language, t } = useLanguage();
  const user = getUserByAddress(address);

  if (!user) {
    return null;
  }

  const ownedWatchlists = getWatchlistsForUser(user.address);
  const allEntries = ownedWatchlists.flatMap((watchlist) => watchlist.entries);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-lg border border-emerald-200/20 bg-emerald-200/10 text-sm font-semibold text-emerald-100">
          {user.avatar}
        </div>
        <div>
          <Link
            href={`/watch/profile/${user.address}`}
            className="font-semibold text-white transition hover:text-emerald-100"
          >
            {user.displayName}
          </Link>
          <div className="text-sm text-white/42">@{user.handle}</div>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/58">
        {user.bio}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-4">
        <Metric
          label={t("common.followers")}
          value={formatCompact(user.followers)}
        />
        <Metric label={t("common.score")} value={user.reputation.toString()} tone="cyan" />
        <Metric
          label={t("common.hitRate")}
          value={formatPercent(calculateHitRate(allEntries))}
          tone="amber"
        />
      </div>
      <div className="mt-4 text-xs text-white/38">
        {t("common.joined")} {dateLabel(user.joined, language)}
      </div>
    </Card>
  );
}

function CommentList({ items, limit = 4 }: { items: Comment[]; limit?: number }) {
  const { language, t } = useLanguage();
  const visibleItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);

  if (visibleItems.length === 0) {
    return (
      <Card className="p-5 text-sm text-white/54">
        {t("common.emptyComments")}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {visibleItems.map((comment) => {
        const author = getUserByAddress(comment.authorAddress);
        return (
          <Card key={comment.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-md bg-white/8 text-xs font-semibold text-white">
                  {author?.avatar ?? "MW"}
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {author?.displayName ?? t("common.notAvailable")}
                  </div>
                  <div className="text-xs text-white/40">
                    {dateLabel(comment.createdAt, language)} - {comment.likes}{" "}
                    {t("common.likes")}
                  </div>
                </div>
              </div>
              {comment.stance ? <StanceBadge stance={comment.stance} /> : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-white/62">
              {comment.body}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

function SafetyNote() {
  const { t } = useLanguage();

  return (
    <Card className="border-amber-200/18 bg-amber-200/[0.055] p-5">
      <div className="text-sm font-semibold text-amber-100">
        {t("safety.title")}
      </div>
      <p className="mt-2 text-sm leading-6 text-amber-50/72">
        {t("safety.copy")}
      </p>
    </Card>
  );
}

function RoadmapSection() {
  const { t } = useLanguage();
  const roadmapItems: CopyKey[] = [
    "roadmap.item1",
    "roadmap.item2",
    "roadmap.item3",
    "roadmap.item4",
    "roadmap.item5",
    "roadmap.item6",
    "roadmap.item7",
  ];

  return (
    <section id="roadmap" className="space-y-5">
      <SectionTitle eyebrow={t("roadmap.eyebrow")} title={t("roadmap.title")}>
        {t("roadmap.subtitle")}
      </SectionTitle>
      <Card className="p-5">
        <div className="grid gap-3 md:grid-cols-2">
          {roadmapItems.map((item, index) => (
            <div key={item} className="flex gap-3 rounded-md bg-black/18 p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-md border border-cyan-200/20 bg-cyan-200/10 text-xs font-semibold text-cyan-100">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-white/62">{t(item)}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function SwapPreview() {
  const { t } = useLanguage();

  return (
    <Card className="border-emerald-200/16 bg-emerald-200/[0.045] p-5">
      <div className="text-sm font-semibold text-emerald-100">
        {t("swap.title")}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/62">{t("swap.copy")}</p>
      <button
        type="button"
        disabled
        className="mt-4 rounded-md border border-white/10 bg-white/7 px-4 py-2 text-sm font-semibold text-white/42"
      >
        {t("swap.locked")}
      </button>
    </Card>
  );
}

export function LandingPageView() {
  const { t } = useLanguage();
  const explanationCards = [
    {
      title: t("landing.card1"),
      body: t("landing.card1Text"),
    },
    {
      title: t("landing.card2"),
      body: t("landing.card2Text"),
    },
    {
      title: t("landing.card3"),
      body: t("landing.card3Text"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050706] text-white">
      <TopNavigation />
      <main className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <section className="grid min-h-[68vh] items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <DemoBadge />
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white md:text-7xl">
              {t("landing.headline")}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-white/66">
              {t("landing.subheadline")}
            </p>
            <div className="mt-6 max-w-2xl">
              <DemoNotice />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/watch"
                className="rounded-md bg-emerald-200 px-5 py-3 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-100"
              >
                {t("landing.primaryCta")}
              </Link>
              <Link
                href="#roadmap"
                className="rounded-md border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/9"
              >
                {t("landing.secondaryCta")}
              </Link>
            </div>
          </div>

          <Card className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">
              {t("common.performance")}
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {t("landing.snapshotTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/58">
              {t("landing.snapshotText")}
            </p>
            <div className="mt-6 grid gap-4">
              {explanationCards.map((card, index) => (
                <div
                  key={card.title}
                  className="flex gap-4 rounded-md border border-white/8 bg-black/20 p-4"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/8 text-sm font-semibold text-emerald-100">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{card.title}</div>
                    <p className="mt-1 text-sm leading-6 text-white/56">
                      {card.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <div className="grid gap-5 border-y border-white/10 py-8 md:grid-cols-3">
          <Metric
            label={t("common.watchlists")}
            value={watchlists.length.toString()}
            tone="cyan"
          />
          <Metric
            label={t("common.watchers")}
            value={users.length.toString()}
            tone="green"
          />
          <Metric
            label={t("common.signals")}
            value={comments.length.toString()}
            tone="amber"
          />
        </div>

        <div className="mt-12">
          <RoadmapSection />
        </div>
      </main>
    </div>
  );
}

export function WatchDashboardView() {
  const { t } = useLanguage();
  const recentSignals = comments.slice(0, 4);

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow={t("dashboard.eyebrow")}
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
      />

      <DemoNotice />

      <section className="space-y-5">
        <SectionTitle title={t("dashboard.featured")} />
        <div className="grid gap-4 md:grid-cols-2">
          {watchlists.map((watchlist) => (
            <WatchlistCard key={watchlist.id} watchlist={watchlist} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle title={t("dashboard.topWatchers")} />
        <div className="grid gap-4 md:grid-cols-3">
          {users.map((user) => (
            <WatcherCard key={user.address} address={user.address} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.78fr]">
        <div className="space-y-5">
          <SectionTitle title={t("dashboard.recentSignals")} />
          <CommentList items={recentSignals} limit={4} />
        </div>

        <div className="space-y-5">
          <SectionTitle title={t("dashboard.howItWorks")} />
          <Card className="p-5">
            {[
              ["dashboard.step1Title", "dashboard.step1Text"],
              ["dashboard.step2Title", "dashboard.step2Text"],
              ["dashboard.step3Title", "dashboard.step3Text"],
              ["dashboard.step4Title", "dashboard.step4Text"],
            ].map(([titleKey, textKey], index) => (
              <div
                key={titleKey}
                className="border-b border-white/8 py-4 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white/8 text-xs font-semibold text-emerald-100">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {t(titleKey as CopyKey)}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-white/56">
                      {t(textKey as CopyKey)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>
    </div>
  );
}

export function ProfilePageView({ address }: { address: string }) {
  const { language, t } = useLanguage();
  const user = getUserByAddress(address);

  if (!user) {
    return null;
  }

  const ownedWatchlists = getWatchlistsForUser(user.address);
  const allEntries = ownedWatchlists.flatMap((watchlist) => watchlist.entries);
  const userComments = comments.filter(
    (comment) =>
      comment.authorAddress.toLowerCase() === user.address.toLowerCase(),
  );
  const weightedReturn =
    ownedWatchlists.length === 0
      ? 0
      : ownedWatchlists.reduce(
          (sum, watchlist) =>
            sum + calculateWatchlistPerformance(watchlist).weightedReturn,
          0,
        ) / ownedWatchlists.length;

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={t("profile.eyebrow")}
        title={user.displayName}
        subtitle={t("profile.subtitle")}
        action={
          <Link
            href="/watch"
            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/9"
          >
            {t("nav.backDashboard")}
          </Link>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-lg border border-emerald-200/20 bg-emerald-200/10 text-lg font-semibold text-emerald-100">
              {user.avatar}
            </div>
            <div>
              <div className="text-lg font-semibold text-white">
                @{user.handle}
              </div>
              <div className="text-sm text-white/45">{user.role}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/60">{user.bio}</p>
          <div className="mt-5 space-y-2 text-sm text-white/56">
            <div className="flex justify-between gap-4">
              <span>{t("common.address")}</span>
              <span className="font-mono text-xs text-white/42">
                {shortAddress(user.address)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>{t("common.joined")}</span>
              <span>{dateLabel(user.joined, language)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label={t("common.followers")}
              value={formatCompact(user.followers)}
            />
            <Metric label={t("common.reputation")} value={user.reputation.toString()} tone="cyan" />
            <Metric
              label={t("common.hitRate")}
              value={formatPercent(calculateHitRate(allEntries))}
              tone="amber"
            />
            <Metric
              label={t("common.weightedReturn")}
              value={formatPercent(weightedReturn)}
              tone={weightedReturn >= 0 ? "green" : "rose"}
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-5">
          <SectionTitle title={t("profile.researchBadges")} />
          <Card className="p-5">
            <div className="space-y-3">
              {user.badges.map((badge) => (
                <div key={badge.label} className="rounded-md bg-black/18 p-3">
                  <div className="text-sm font-semibold text-white">
                    {badge.label}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-white/56">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <SectionTitle title={t("profile.publicLists")} />
          <div className="grid gap-4">
            {ownedWatchlists.map((watchlist) => (
              <WatchlistCard key={watchlist.id} watchlist={watchlist} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle title={t("dashboard.recentSignals")} />
        <CommentList items={userComments} />
      </section>
    </div>
  );
}

export function WatchlistDetailView({ id }: { id: string }) {
  const { language, t } = useLanguage();
  const watchlist = getWatchlistById(id);

  if (!watchlist) {
    return null;
  }

  const owner = getUserByAddress(watchlist.ownerAddress);
  const listComments = getCommentsForWatchlist(watchlist.id);
  const performance = calculateWatchlistPerformance(watchlist);
  const score = calculateWatchlistScore(watchlist, baseTokens, comments);
  const bestToken = performance.bestCall
    ? getTokenByAddress(performance.bestCall.tokenAddress)
    : undefined;
  const worstToken = performance.worstCall
    ? getTokenByAddress(performance.worstCall.tokenAddress)
    : undefined;

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={t("list.eyebrow")}
        title={watchlist.title}
        subtitle={t("list.subtitle")}
        action={
          owner ? (
            <Link
              href={`/watch/profile/${owner.address}`}
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/9"
            >
              {t("nav.viewProfile")}
            </Link>
          ) : null
        }
      />

      <Card className="p-5">
        <p className="max-w-4xl text-sm leading-7 text-white/62">
          {watchlist.description}
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label={t("list.listQuality")} value={score.toString()} tone="cyan" />
          <Metric
            label={t("common.weightedReturn")}
            value={formatPercent(performance.weightedReturn)}
            tone={performance.weightedReturn >= 0 ? "green" : "rose"}
          />
          <Metric
            label={t("common.hitRate")}
            value={formatPercent(performance.hitRate)}
            tone="amber"
          />
          <Metric
            label={t("common.bestCall")}
            value={
              bestToken && performance.bestCall
                ? `${bestToken.symbol} ${formatPercent(getCallScore(performance.bestCall))}`
                : t("common.notAvailable")
            }
          />
          <Metric
            label={t("common.worstCall")}
            value={
              worstToken && performance.worstCall
                ? `${worstToken.symbol} ${formatPercent(getCallScore(performance.worstCall))}`
                : t("common.notAvailable")
            }
            tone="rose"
          />
        </div>
        <div className="mt-5 grid gap-2 text-sm text-white/52 sm:grid-cols-3">
          <span>
            {t("common.owner")}: {owner ? `@${owner.handle}` : t("common.notAvailable")}
          </span>
          <span>
            {t("common.updated")}: {dateLabel(watchlist.updatedAt, language)}
          </span>
          <span>
            {t("common.followers")}: {formatCompact(watchlist.followers)}
          </span>
        </div>
      </Card>

      <section className="space-y-5">
        <SectionTitle title={t("list.tokenCalls")} />
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.035] thin-scrollbar">
          <table className="min-w-[880px] w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-white/40">
              <tr>
                <th className="px-4 py-3 font-medium">Token</th>
                <th className="px-4 py-3 font-medium">Stance</th>
                <th className="px-4 py-3 font-medium">{t("common.price")}</th>
                <th className="px-4 py-3 font-medium">{t("common.return")}</th>
                <th className="px-4 py-3 font-medium">{t("common.thesis")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {watchlist.entries.map((entry) => {
                const token = getTokenByAddress(entry.tokenAddress);

                if (!token) {
                  return null;
                }

                const returnPct = getEntryReturnPct(entry);

                return (
                  <tr key={entry.tokenAddress} className="hover:bg-white/[0.025]">
                    <td className="px-4 py-4">
                      <Link
                        href={`/watch/token/${token.address}`}
                        className="font-semibold text-white transition hover:text-emerald-100"
                      >
                        {token.symbol}
                      </Link>
                      <div className="mt-1 text-xs text-white/40">
                        {token.name}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StanceBadge stance={entry.stance} />
                    </td>
                    <td className="px-4 py-4 text-white/62">
                      {formatUsd(entry.currentPrice)}
                    </td>
                    <td className={`px-4 py-4 font-semibold ${toneClass(returnPct)}`}>
                      {formatPercent(returnPct)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="max-w-lg leading-6 text-white/62">
                        {entry.thesis}
                      </p>
                      <p className="mt-1 max-w-lg text-xs leading-5 text-amber-100/60">
                        {entry.riskNote}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="space-y-5">
          <SectionTitle title={t("list.listComments")} />
          <CommentList items={listComments} />
        </div>
        <div className="space-y-5">
          <SwapPreview />
          <SafetyNote />
        </div>
      </section>
    </div>
  );
}

function SignalMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-white/52">
        <span>{label}</span>
        <span className="text-emerald-100">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-emerald-300"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

function TokenMiniCard({ token }: { token: Token }) {
  const { t } = useLanguage();
  const tokenComments = getCommentsForToken(token.address);
  const score = calculateMergenWatchScore(token, tokenComments);

  return (
    <Link
      href={`/watch/token/${token.address}`}
      className="block rounded-md border border-white/8 bg-black/18 p-3 transition hover:border-emerald-200/25 hover:bg-white/[0.045]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-white">{token.symbol}</div>
          <div className="text-xs text-white/40">{token.name}</div>
        </div>
        <ScorePill score={score} />
      </div>
      <div className="mt-3 flex justify-between text-xs text-white/50">
        <span>{t("common.return")}</span>
        <span className={toneClass(token.change7d)}>
          {formatPercent(token.change7d)}
        </span>
      </div>
    </Link>
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
      (entry) =>
        entry.tokenAddress.toLowerCase() === token.address.toLowerCase(),
    ),
  );
  const score = calculateMergenWatchScore(token, tokenComments);
  const averageCallReturn =
    relatedEntries.length === 0
      ? 0
      : relatedEntries.reduce((sum, entry) => sum + getEntryReturnPct(entry), 0) /
        relatedEntries.length;

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={t("token.eyebrow")}
        title={`${token.symbol} / ${token.name}`}
        subtitle={t("token.subtitle")}
        action={
          <Link
            href="/watch"
            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/9"
          >
            {t("nav.backDashboard")}
          </Link>
        }
      />

      <Card className="p-5">
        <p className="max-w-4xl text-sm leading-7 text-white/62">
          {token.summary}
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          <Metric label={t("token.socialScore")} value={score.toString()} tone="cyan" />
          <Metric label={t("common.price")} value={formatUsd(token.price)} />
          <Metric
            label="24H"
            value={formatPercent(token.change24h)}
            tone={token.change24h >= 0 ? "green" : "rose"}
          />
          <Metric
            label="7D"
            value={formatPercent(token.change7d)}
            tone={token.change7d >= 0 ? "green" : "rose"}
          />
          <Metric
            label={t("common.liquidity")}
            value={`$${formatCompact(token.liquidityUsd)}`}
            tone="amber"
          />
          <Metric
            label={t("token.avgCallReturn")}
            value={formatPercent(averageCallReturn)}
            tone={averageCallReturn >= 0 ? "green" : "rose"}
          />
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <SectionTitle title={t("token.socialSignals")} />
          <Card className="p-5">
            <div className="space-y-4">
              <SignalMeter
                label={t("token.communityConviction")}
                value={token.watchScoreInputs.communityConviction}
              />
              <SignalMeter
                label={t("token.researchDepth")}
                value={token.watchScoreInputs.researchDepth}
              />
              <SignalMeter
                label={t("token.liquidityConfidence")}
                value={token.watchScoreInputs.liquidityConfidence}
              />
              <SignalMeter
                label={t("token.riskControl")}
                value={token.watchScoreInputs.riskControl}
              />
            </div>
            <div className="mt-5 space-y-2 text-sm text-white/56">
              <div className="flex justify-between">
                <span>{t("common.address")}</span>
                <span className="font-mono text-xs text-white/40">
                  {shortAddress(token.address)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("common.holders")}</span>
                <span>{formatCompact(token.holders)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("common.mentions")}</span>
                <span>{formatCompact(token.mentions)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-white">
              {t("token.stanceDistribution")}
            </div>
            <div className="mt-4 space-y-3">
              {stances.map((stance) => {
                const count = relatedEntries.filter(
                  (entry) => entry.stance === stance,
                ).length;
                return (
                  <div
                    key={stance}
                    className="flex items-center justify-between rounded-md bg-black/18 p-3"
                  >
                    <StanceBadge stance={stance} />
                    <span className="text-sm text-white/56">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <SectionTitle title={t("token.watchlistMentions")} />
          <div className="grid gap-4">
            {relatedWatchlists.map((watchlist) => {
              const owner = getUserByAddress(watchlist.ownerAddress);
              const entry = watchlist.entries.find(
                (item) =>
                  item.tokenAddress.toLowerCase() === token.address.toLowerCase(),
              );
              const performance = calculateWatchlistPerformance(watchlist);

              return (
                <Card key={watchlist.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link
                        href={`/watch/list/${watchlist.id}`}
                        className="font-semibold text-white transition hover:text-emerald-100"
                      >
                        {watchlist.title}
                      </Link>
                      <div className="mt-1 text-xs text-white/40">
                        {owner ? `@${owner.handle}` : t("common.notAvailable")}
                      </div>
                    </div>
                    {entry ? <StanceBadge stance={entry.stance} /> : null}
                  </div>
                  <div className="mt-3 text-sm text-white/58">
                    {t("common.weightedReturn")}{" "}
                    <span className={toneClass(performance.weightedReturn)}>
                      {formatPercent(performance.weightedReturn)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="space-y-5">
          <SectionTitle title={t("common.recentComments")} />
          <CommentList items={tokenComments} />
        </div>
        <div className="space-y-5">
          <SectionTitle title={t("dashboard.featured")} />
          <Card className="p-5">
            <div className="grid gap-3">
              {baseTokens
                .filter((item) => item.address !== token.address)
                .slice(0, 3)
                .map((item) => (
                  <TokenMiniCard key={item.address} token={item} />
                ))}
            </div>
          </Card>
          <SwapPreview />
          <SafetyNote />
        </div>
      </section>
    </div>
  );
}
