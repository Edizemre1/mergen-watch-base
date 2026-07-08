import Link from "next/link";
import type {
  BadgeTone,
  Comment,
  ResearchBadge,
  Stance,
  Token,
  Watchlist,
  WatchlistEntry,
} from "@/lib/types";
import {
  baseTokens,
  comments,
  getCommentsForToken,
  getTokenByAddress,
  getUserByAddress,
  roadmapItems,
} from "@/lib/mock-data";
import {
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

const badgeToneClasses: Record<BadgeTone, string> = {
  green: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
  amber: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  rose: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  violet: "border-violet-300/30 bg-violet-300/10 text-violet-100",
};

const stanceClasses: Record<Stance, string> = {
  Bullish: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  Neutral: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  Risky: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  Avoid: "border-rose-300/30 bg-rose-300/10 text-rose-100",
};

const toneText = {
  green: "text-emerald-200",
  cyan: "text-cyan-200",
  amber: "text-amber-200",
  rose: "text-rose-200",
  violet: "text-violet-200",
};

type Tone = keyof typeof toneText;

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function StanceBadge({ stance }: { stance: Stance }) {
  return (
    <span
      className={`inline-flex min-w-20 items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold ${stanceClasses[stance]}`}
    >
      {stance}
    </span>
  );
}

export function ResearchBadgePill({ badge }: { badge: ResearchBadge }) {
  return (
    <div className={`rounded-md border p-3 ${badgeToneClasses[badge.tone]}`}>
      <div className="text-sm font-semibold">{badge.label}</div>
      <p className="mt-1 text-xs leading-5 text-white/62">{badge.description}</p>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "green",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4 panel-glow">
      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
        {label}
      </div>
      <div className={`mt-3 text-2xl font-semibold ${toneText[tone]}`}>
        {value}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/58">{detail}</p>
    </div>
  );
}

export function ScoreDial({
  score,
  label = "Mergen Watch Score",
}: {
  score: number;
  label?: string;
}) {
  const accent =
    score >= 78 ? "#53f1ae" : score >= 62 ? "#67e8f9" : score >= 48 ? "#f3c969" : "#fb7185";

  return (
    <div className="flex items-center gap-4">
      <div
        className="grid size-24 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(${accent} ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
        }}
      >
        <div className="grid size-[4.7rem] place-items-center rounded-full border border-white/10 bg-[#070a08]">
          <span className="text-2xl font-semibold text-white">{score}</span>
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{label}</div>
        <p className="mt-1 max-w-xs text-sm leading-6 text-white/58">
          Composite mock score from social conviction, research depth,
          liquidity confidence, risk control, and momentum.
        </p>
      </div>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-emerald-200/75">
          {eyebrow}
        </div>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/62">
          {children}
        </p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function WatchAppShell({ children }: { children: React.ReactNode }) {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Watch", href: "/watch" },
    { label: "Architecture", href: "/#architecture" },
  ];

  return (
    <div className="min-h-screen bg-[#050706] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050706]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md border border-emerald-200/25 bg-emerald-200/10 text-sm font-bold text-emerald-100">
              MW
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">
                Mergen Watch
              </span>
              <span className="block text-xs text-white/45">Base demo</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-white/62 transition hover:bg-white/8 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}

export function SafetyNotice() {
  return (
    <section className="rounded-lg border border-amber-200/20 bg-amber-200/[0.065] p-5 text-sm leading-7 text-amber-50/82">
      <strong className="text-amber-100">Safety note:</strong> Community signals
      are not financial advice. Watchlist performance is informational. Users
      should verify liquidity, contract risk, and volatility before trading.
      This demo does not execute swaps or guarantee returns.
    </section>
  );
}

export function RoadmapPanel() {
  return (
    <section
      id="architecture"
      className="rounded-lg border border-white/10 bg-white/[0.045] p-6 panel-glow"
    >
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/75">
        Future Onchain Architecture
      </div>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Designed for public research first, onchain attestations later.
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {roadmapItems.map((item, index) => (
          <div
            key={item}
            className="flex gap-3 rounded-md border border-white/10 bg-black/18 p-3"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md border border-cyan-200/20 bg-cyan-200/10 text-xs font-semibold text-cyan-100">
              {index + 1}
            </span>
            <p className="text-sm leading-6 text-white/62">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SwapTerminalCta() {
  return (
    <div className="rounded-lg border border-emerald-200/20 bg-emerald-200/[0.055] p-5">
      <div className="text-sm font-semibold text-emerald-100">
        Future swap terminal
      </div>
      <p className="mt-2 text-sm leading-6 text-white/62">
        A later version can route from public watch signals into a Base swap
        terminal with Builder Code attribution and sponsored transaction
        support. This demo keeps all actions read-only.
      </p>
      <button
        type="button"
        disabled
        className="mt-4 rounded-md border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white/45"
      >
        Swap terminal preview locked
      </button>
    </div>
  );
}

export function TokenChip({ token }: { token: Token }) {
  return (
    <Link
      href={`/watch/token/${token.address}`}
      className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.055] px-3 py-2 transition hover:border-emerald-200/35 hover:bg-emerald-200/10"
    >
      <span className="grid size-7 place-items-center rounded-md bg-white/10 text-xs font-semibold text-white">
        {token.symbol.slice(0, 2)}
      </span>
      <span>
        <span className="block text-sm font-semibold text-white">
          {token.symbol}
        </span>
        <span className="block text-xs text-white/45">{token.sector}</span>
      </span>
    </Link>
  );
}

export function SignalMeter({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: number;
  tone?: Tone;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-white/52">
        <span>{label}</span>
        <span className={toneText[tone]}>{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div
          className={`h-2 rounded-full ${
            tone === "green"
              ? "bg-emerald-300"
              : tone === "cyan"
                ? "bg-cyan-300"
                : tone === "amber"
                  ? "bg-amber-300"
                  : tone === "rose"
                    ? "bg-rose-300"
                    : "bg-violet-300"
          }`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export function MiniPerformanceBars({
  entries,
}: {
  entries: WatchlistEntry[];
}) {
  const returns = entries.map(getEntryReturnPct);
  const maxAbs = Math.max(...returns.map((value) => Math.abs(value)), 1);

  return (
    <div className="flex h-20 items-end gap-2">
      {returns.map((value, index) => {
        const height = Math.max(12, (Math.abs(value) / maxAbs) * 72);
        return (
          <div
            key={`${value}-${index}`}
            className="flex w-8 flex-col items-center justify-end gap-1"
            title={formatPercent(value)}
          >
            <div
              className={`w-full rounded-t-md ${
                value >= 0 ? "bg-emerald-300/75" : "bg-rose-300/75"
              }`}
              style={{ height }}
            />
            <span className="text-[10px] text-white/42">{index + 1}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CommentFeed({
  items,
  limit = 5,
}: {
  items: Comment[];
  limit?: number;
}) {
  const sorted = [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 text-sm text-white/54">
        No comments in the mock dataset yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((comment) => {
        const author = getUserByAddress(comment.authorAddress);
        return (
          <article
            key={comment.id}
            className="rounded-lg border border-white/10 bg-white/[0.045] p-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-8 place-items-center rounded-md bg-white/10 text-xs font-semibold text-white">
                {author?.avatar ?? "MW"}
              </span>
              <div>
                <div className="text-sm font-semibold text-white">
                  {author?.displayName ?? "Unknown researcher"}
                </div>
                <div className="text-xs text-white/42">
                  {formatDate(comment.createdAt)} - {comment.likes} likes
                </div>
              </div>
              {comment.stance ? <StanceBadge stance={comment.stance} /> : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-white/64">
              {comment.body}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function WatchlistSummaryTable({
  items,
}: {
  items: Watchlist[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.045] thin-scrollbar">
      <table className="min-w-[860px] w-full text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-white/42">
          <tr>
            <th className="px-4 py-3 font-medium">Watchlist</th>
            <th className="px-4 py-3 font-medium">Owner</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium">Weighted</th>
            <th className="px-4 py-3 font-medium">Hit Rate</th>
            <th className="px-4 py-3 font-medium">Best Call</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/8">
          {items.map((watchlist) => {
            const owner = getUserByAddress(watchlist.ownerAddress);
            const performance = calculateWatchlistPerformance(watchlist);
            const score = calculateWatchlistScore(watchlist, baseTokens, comments);
            const bestToken = performance.bestCall
              ? getTokenByAddress(performance.bestCall.tokenAddress)
              : undefined;

            return (
              <tr key={watchlist.id} className="hover:bg-white/[0.035]">
                <td className="px-4 py-4">
                  <Link
                    href={`/watch/list/${watchlist.id}`}
                    className="font-semibold text-white hover:text-emerald-100"
                  >
                    {watchlist.title}
                  </Link>
                  <div className="mt-1 text-xs text-white/42">
                    {watchlist.followers.toLocaleString()} followers
                  </div>
                </td>
                <td className="px-4 py-4">
                  {owner ? (
                    <Link
                      href={`/watch/profile/${owner.address}`}
                      className="text-white/72 hover:text-white"
                    >
                      @{owner.handle}
                    </Link>
                  ) : (
                    <span className="text-white/42">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-4 text-cyan-100">{score}</td>
                <td
                  className={`px-4 py-4 ${
                    performance.weightedReturn >= 0
                      ? "text-emerald-100"
                      : "text-rose-100"
                  }`}
                >
                  {formatPercent(performance.weightedReturn)}
                </td>
                <td className="px-4 py-4 text-white/72">
                  {formatPercent(performance.hitRate)}
                </td>
                <td className="px-4 py-4">
                  {bestToken && performance.bestCall ? (
                    <span className="text-white/72">
                      {bestToken.symbol}{" "}
                      <span className="text-emerald-100">
                        {formatPercent(getCallScore(performance.bestCall))}
                      </span>
                    </span>
                  ) : (
                    <span className="text-white/42">None</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function TokenSignalCard({ token }: { token: Token }) {
  const tokenComments = getCommentsForToken(token.address);
  const score = calculateMergenWatchScore(token, tokenComments);

  return (
    <Link
      href={`/watch/token/${token.address}`}
      className="block rounded-lg border border-white/10 bg-white/[0.045] p-5 transition hover:border-emerald-200/30 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-white">{token.symbol}</div>
          <div className="mt-1 text-sm text-white/45">{token.name}</div>
        </div>
        <div className="rounded-md border border-cyan-200/25 bg-cyan-200/10 px-2.5 py-1 text-sm font-semibold text-cyan-100">
          {score}
        </div>
      </div>
      <p className="mt-4 min-h-18 text-sm leading-6 text-white/62">
        {token.summary}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-white/40">Price</div>
          <div className="mt-1 font-semibold text-white">{formatUsd(token.price)}</div>
        </div>
        <div>
          <div className="text-white/40">7D</div>
          <div
            className={`mt-1 font-semibold ${
              token.change7d >= 0 ? "text-emerald-100" : "text-rose-100"
            }`}
          >
            {formatPercent(token.change7d)}
          </div>
        </div>
        <div>
          <div className="text-white/40">Mentions</div>
          <div className="mt-1 font-semibold text-white">
            {formatCompact(token.mentions)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function EntryReturn({ entry }: { entry: WatchlistEntry }) {
  const value = getEntryReturnPct(entry);

  return (
    <span className={value >= 0 ? "text-emerald-100" : "text-rose-100"}>
      {formatPercent(value)}
    </span>
  );
}

export function TokenAddressLine({ address }: { address: string }) {
  return (
    <span className="font-mono text-xs text-white/42">{shortAddress(address)}</span>
  );
}
