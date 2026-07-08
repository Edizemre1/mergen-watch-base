import Link from "next/link";
import {
  CommentFeed,
  MetricCard,
  PageTitle,
  RoadmapPanel,
  SafetyNotice,
  TokenSignalCard,
  WatchlistSummaryTable,
} from "@/components/watch-ui";
import { baseTokens, comments, watchlists } from "@/lib/mock-data";
import {
  calculateHitRate,
  calculateMergenWatchScore,
  calculateWatchlistPerformance,
  formatCompact,
  formatPercent,
} from "@/lib/performance";

export default function WatchDashboardPage() {
  const allEntries = watchlists.flatMap((watchlist) => watchlist.entries);
  const rankedTokens = [...baseTokens]
    .sort(
      (a, b) =>
        calculateMergenWatchScore(b, comments) -
        calculateMergenWatchScore(a, comments),
    )
    .slice(0, 4);
  const averageWeightedReturn =
    watchlists.reduce(
      (sum, watchlist) =>
        sum + calculateWatchlistPerformance(watchlist).weightedReturn,
      0,
    ) / watchlists.length;

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Public watch dashboard"
        title="Base token watchlists with social context."
        actions={
          <Link
            href="/watch/list/base-liquidity-core"
            className="rounded-md bg-emerald-200 px-4 py-3 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-100"
          >
            View lead list
          </Link>
        }
      >
        Browse mock public watchlists, compare stance-weighted performance, and
        inspect which Base tokens are gathering comment velocity.
      </PageTitle>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Tracked tokens"
          value={baseTokens.length.toString()}
          detail="Base token dataset is fully mocked."
          tone="cyan"
        />
        <MetricCard
          label="Public followers"
          value={formatCompact(
            watchlists.reduce((sum, watchlist) => sum + watchlist.followers, 0),
          )}
          detail="Follower counts are sample social signals."
        />
        <MetricCard
          label="Average weighted"
          value={formatPercent(averageWeightedReturn)}
          detail="Mock entry-to-current watchlist performance."
          tone={averageWeightedReturn >= 0 ? "green" : "rose"}
        />
        <MetricCard
          label="Stance hit rate"
          value={formatPercent(calculateHitRate(allEntries))}
          detail="Bullish, Neutral, Risky, and Avoid use different hit logic."
          tone="amber"
        />
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.78fr]">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/42">
                Token social board
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Highest mock Mergen Watch Scores
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rankedTokens.map((token) => (
              <TokenSignalCard key={token.address} token={token} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 panel-glow">
          <div className="text-xs uppercase tracking-[0.2em] text-white/42">
            Comment feed
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Recent public notes
          </h2>
          <div className="mt-5">
            <CommentFeed items={comments} limit={4} />
          </div>
        </div>
      </section>

      <WatchlistSummaryTable items={watchlists} />

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <RoadmapPanel />
        <SafetyNotice />
      </div>
    </div>
  );
}
