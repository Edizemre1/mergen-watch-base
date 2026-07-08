import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CommentFeed,
  MetricCard,
  PageTitle,
  ScoreDial,
  SignalMeter,
  StanceBadge,
  SwapTerminalCta,
  TokenAddressLine,
  formatDate,
} from "@/components/watch-ui";
import {
  baseTokens,
  getCommentsForToken,
  getTokenByAddress,
  getUserByAddress,
  getWatchlistsForToken,
} from "@/lib/mock-data";
import type { Stance } from "@/lib/types";
import {
  calculateMergenWatchScore,
  calculateWatchlistPerformance,
  formatCompact,
  formatPercent,
  formatUsd,
  getEntryReturnPct,
} from "@/lib/performance";

const stances: Stance[] = ["Bullish", "Neutral", "Risky", "Avoid"];

export function generateStaticParams() {
  return baseTokens.map((token) => ({
    address: token.address,
  }));
}

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const token = getTokenByAddress(address);

  if (!token) {
    notFound();
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
      <PageTitle
        eyebrow="Token social page"
        title={`${token.symbol} / ${token.name}`}
        actions={
          <Link
            href="/watch"
            className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        }
      >
        {token.summary}
      </PageTitle>

      <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 panel-glow">
          <ScoreDial score={score} />
          <div className="mt-6 space-y-4">
            <SignalMeter
              label="Community conviction"
              value={token.watchScoreInputs.communityConviction}
            />
            <SignalMeter
              label="Research depth"
              value={token.watchScoreInputs.researchDepth}
              tone="cyan"
            />
            <SignalMeter
              label="Liquidity confidence"
              value={token.watchScoreInputs.liquidityConfidence}
              tone="amber"
            />
            <SignalMeter
              label="Risk control"
              value={token.watchScoreInputs.riskControl}
              tone="violet"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Price"
            value={formatUsd(token.price)}
            detail="Mock current price."
            tone="cyan"
          />
          <MetricCard
            label="24H"
            value={formatPercent(token.change24h)}
            detail="Mock short-window movement."
            tone={token.change24h >= 0 ? "green" : "rose"}
          />
          <MetricCard
            label="7D"
            value={formatPercent(token.change7d)}
            detail="Mock weekly movement."
            tone={token.change7d >= 0 ? "green" : "rose"}
          />
          <MetricCard
            label="Liquidity"
            value={`$${formatCompact(token.liquidityUsd)}`}
            detail="Mock liquidity depth."
            tone="amber"
          />
          <MetricCard
            label="Mentions"
            value={formatCompact(token.mentions)}
            detail="Mock social mention count."
          />
          <MetricCard
            label="Avg call return"
            value={formatPercent(averageCallReturn)}
            detail="Average from public list entries."
            tone={averageCallReturn >= 0 ? "green" : "rose"}
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/42">
              Token identity
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/62">
              <div className="flex justify-between gap-4">
                <span>Address</span>
                <TokenAddressLine address={token.address} />
              </div>
              <div className="flex justify-between gap-4">
                <span>Sector</span>
                <span>{token.sector}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Holders</span>
                <span>{formatCompact(token.holders)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Followers</span>
                <span>{formatCompact(token.followers)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/42">
              Stance distribution
            </div>
            <div className="mt-4 space-y-3">
              {stances.map((stance) => {
                const count = relatedEntries.filter(
                  (entry) => entry.stance === stance,
                ).length;
                return (
                  <div
                    key={stance}
                    className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-black/18 p-3"
                  >
                    <StanceBadge stance={stance} />
                    <span className="text-sm text-white/62">{count} calls</span>
                  </div>
                );
              })}
            </div>
          </div>
          <SwapTerminalCta />
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/42">
              Watchlist mentions
            </div>
            <div className="mt-4 space-y-3">
              {relatedWatchlists.map((watchlist) => {
                const owner = getUserByAddress(watchlist.ownerAddress);
                const performance = calculateWatchlistPerformance(watchlist);
                const entry = watchlist.entries.find(
                  (item) =>
                    item.tokenAddress.toLowerCase() === token.address.toLowerCase(),
                );

                return (
                  <Link
                    key={watchlist.id}
                    href={`/watch/list/${watchlist.id}`}
                    className="block rounded-lg border border-white/10 bg-black/18 p-4 transition hover:border-emerald-200/30 hover:bg-white/[0.055]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">
                          {watchlist.title}
                        </div>
                        <div className="mt-1 text-xs text-white/42">
                          {owner ? `@${owner.handle}` : "Unknown"} - updated{" "}
                          {formatDate(watchlist.updatedAt)}
                        </div>
                      </div>
                      {entry ? <StanceBadge stance={entry.stance} /> : null}
                    </div>
                    <div className="mt-3 text-sm text-white/62">
                      List weighted return{" "}
                      <span
                        className={
                          performance.weightedReturn >= 0
                            ? "text-emerald-100"
                            : "text-rose-100"
                        }
                      >
                        {formatPercent(performance.weightedReturn)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/42">
              Token comments
            </div>
            <div className="mt-4">
              <CommentFeed items={tokenComments} limit={5} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
