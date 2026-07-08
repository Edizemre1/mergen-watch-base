import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CommentFeed,
  EntryReturn,
  MetricCard,
  MiniPerformanceBars,
  PageTitle,
  SafetyNotice,
  ScoreDial,
  StanceBadge,
  SwapTerminalCta,
  TokenAddressLine,
  TokenChip,
  formatDate,
} from "@/components/watch-ui";
import {
  baseTokens,
  comments,
  getCommentsForWatchlist,
  getTokenByAddress,
  getUserByAddress,
  getWatchlistById,
  watchlists,
} from "@/lib/mock-data";
import {
  calculateWatchlistPerformance,
  calculateWatchlistScore,
  formatCompact,
  formatPercent,
  formatUsd,
  getCallScore,
} from "@/lib/performance";

export function generateStaticParams() {
  return watchlists.map((watchlist) => ({
    id: watchlist.id,
  }));
}

export default async function WatchlistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const watchlist = getWatchlistById(id);

  if (!watchlist) {
    notFound();
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
      <PageTitle
        eyebrow="Watchlist detail"
        title={watchlist.title}
        actions={
          owner ? (
            <Link
              href={`/watch/profile/${owner.address}`}
              className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View @{owner.handle}
            </Link>
          ) : null
        }
      >
        {watchlist.description}
      </PageTitle>

      <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 panel-glow">
          <ScoreDial score={score} />
          <div className="mt-6 grid gap-3 text-sm text-white/62">
            <div className="flex justify-between gap-4">
              <span>Owner</span>
              <span>{owner ? `@${owner.handle}` : "Unknown"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Horizon</span>
              <span>{watchlist.horizon}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Updated</span>
              <span>{formatDate(watchlist.updatedAt)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Followers</span>
              <span>{formatCompact(watchlist.followers)}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {watchlist.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/[0.055] px-2.5 py-1 text-xs text-white/58"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            label="Weighted return"
            value={formatPercent(performance.weightedReturn)}
            detail="Conviction-weighted mock entry performance."
            tone={performance.weightedReturn >= 0 ? "green" : "rose"}
          />
          <MetricCard
            label="Hit rate"
            value={formatPercent(performance.hitRate)}
            detail="Stance-aware performance utility output."
            tone="amber"
          />
          <MetricCard
            label="Best call"
            value={
              bestToken && performance.bestCall
                ? `${bestToken.symbol} ${formatPercent(getCallScore(performance.bestCall))}`
                : "None"
            }
            detail="Best call uses stance-adjusted scoring."
            tone="cyan"
          />
          <MetricCard
            label="Worst call"
            value={
              worstToken && performance.worstCall
                ? `${worstToken.symbol} ${formatPercent(getCallScore(performance.worstCall))}`
                : "None"
            }
            detail="Lowest stance-adjusted call score."
            tone="rose"
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.045] thin-scrollbar">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-white/42">
              <tr>
                <th className="px-4 py-3 font-medium">Token</th>
                <th className="px-4 py-3 font-medium">Stance</th>
                <th className="px-4 py-3 font-medium">Entry</th>
                <th className="px-4 py-3 font-medium">Current</th>
                <th className="px-4 py-3 font-medium">Return</th>
                <th className="px-4 py-3 font-medium">Thesis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {watchlist.entries.map((entry) => {
                const token = getTokenByAddress(entry.tokenAddress);

                if (!token) {
                  return null;
                }

                return (
                  <tr key={entry.tokenAddress} className="hover:bg-white/[0.035]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <TokenChip token={token} />
                        <TokenAddressLine address={token.address} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StanceBadge stance={entry.stance} />
                    </td>
                    <td className="px-4 py-4 text-white/72">
                      {formatUsd(entry.entryPrice)}
                    </td>
                    <td className="px-4 py-4 text-white/72">
                      {formatUsd(entry.currentPrice)}
                    </td>
                    <td className="px-4 py-4 font-semibold">
                      <EntryReturn entry={entry} />
                    </td>
                    <td className="px-4 py-4">
                      <p className="max-w-md leading-6 text-white/64">
                        {entry.thesis}
                      </p>
                      <p className="mt-1 max-w-md text-xs leading-5 text-amber-100/62">
                        {entry.riskNote}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/42">
              Return distribution
            </div>
            <div className="mt-4">
              <MiniPerformanceBars entries={watchlist.entries} />
            </div>
          </div>
          <SwapTerminalCta />
          <SafetyNotice />
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-white/42">
          Watchlist comments
        </div>
        <div className="mt-4">
          <CommentFeed items={listComments} limit={5} />
        </div>
      </section>
    </div>
  );
}
