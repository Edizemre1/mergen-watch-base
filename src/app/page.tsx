import Link from "next/link";
import {
  CommentFeed,
  MetricCard,
  RoadmapPanel,
  SafetyNotice,
  ScoreDial,
  TokenSignalCard,
  WatchlistSummaryTable,
} from "@/components/watch-ui";
import { baseTokens, comments, watchlists } from "@/lib/mock-data";
import {
  calculateMergenWatchScore,
  calculateWatchlistPerformance,
  formatCompact,
  formatPercent,
} from "@/lib/performance";

export default function Home() {
  const leadingList = watchlists[0];
  const leadingPerformance = calculateWatchlistPerformance(leadingList);
  const topTokens = [...baseTokens]
    .sort(
      (a, b) =>
        calculateMergenWatchScore(b, comments) -
        calculateMergenWatchScore(a, comments),
    )
    .slice(0, 3);
  const communityMentions = baseTokens.reduce(
    (total, token) => total + token.mentions,
    0,
  );

  return (
    <main className="min-h-screen bg-[#050706] text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md border border-emerald-200/25 bg-emerald-200/10 text-sm font-bold text-emerald-100">
            MW
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">
              Mergen Watch Base
            </span>
            <span className="block text-xs text-white/45">public demo</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/watch"
            className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-200/30 hover:bg-emerald-200/10"
          >
            Open Watch
          </Link>
        </nav>
      </header>

      <section className="data-plane mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <div className="inline-flex rounded-md border border-cyan-200/25 bg-cyan-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            Base-native social research
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
            Mergen Watch Base
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-white/66">
            Public Base token watchlists, social stance signals, comments,
            follower context, mock performance, and a read-only path toward a
            future onchain research layer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/watch"
              className="rounded-md bg-emerald-200 px-5 py-3 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-100"
            >
              Browse watchlists
            </Link>
            <Link
              href="#architecture"
              className="rounded-md border border-white/12 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Onchain roadmap
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MetricCard
              label="Public lists"
              value={watchlists.length.toString()}
              detail="Mock watchlists with owners, comments, and entries."
              tone="cyan"
            />
            <MetricCard
              label="Token mentions"
              value={formatCompact(communityMentions)}
              detail="Aggregated from the local demo dataset."
              tone="green"
            />
            <MetricCard
              label="Lead hit rate"
              value={formatPercent(leadingPerformance.hitRate)}
              detail="Stance-aware call scoring, not transaction farming."
              tone="amber"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-[#080c0a]/92 p-5 panel-glow">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-white/42">
                  Featured watchlist
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {leadingList.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">
                  {leadingList.description}
                </p>
              </div>
              <ScoreDial score={83} label="List quality" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {topTokens.map((token) => (
                <TokenSignalCard key={token.address} token={token} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                Social feed sample
              </div>
              <div className="mt-4">
                <CommentFeed items={comments} limit={2} />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                Performance snapshot
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricCard
                  label="Weighted return"
                  value={formatPercent(leadingPerformance.weightedReturn)}
                  detail="Mock entry prices compared with mock current prices."
                />
                <MetricCard
                  label="Positive calls"
                  value={`${leadingPerformance.positiveCalls}/${leadingList.entries.length}`}
                  detail="Shown as research context only."
                  tone="violet"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-5 pb-16">
        <WatchlistSummaryTable items={watchlists} />
        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <RoadmapPanel />
          <SafetyNotice />
        </div>
      </section>
    </main>
  );
}
