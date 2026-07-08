import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CommentFeed,
  MetricCard,
  PageTitle,
  ResearchBadgePill,
  TokenAddressLine,
  WatchlistSummaryTable,
  formatDate,
} from "@/components/watch-ui";
import {
  comments,
  getUserByAddress,
  getWatchlistsForUser,
  users,
} from "@/lib/mock-data";
import {
  calculateHitRate,
  calculateWatchlistPerformance,
  formatCompact,
  formatPercent,
} from "@/lib/performance";

export function generateStaticParams() {
  return users.map((user) => ({
    address: user.address,
  }));
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const user = getUserByAddress(address);

  if (!user) {
    notFound();
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
      <PageTitle
        eyebrow="Research profile"
        title={user.displayName}
        actions={
          <Link
            href="/watch"
            className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        }
      >
        {user.bio}
      </PageTitle>

      <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 panel-glow">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-lg border border-emerald-200/25 bg-emerald-200/10 text-xl font-semibold text-emerald-100">
              {user.avatar}
            </div>
            <div>
              <div className="text-xl font-semibold text-white">
                @{user.handle}
              </div>
              <div className="mt-1 text-sm text-white/45">{user.role}</div>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-white/62">
            <div className="flex justify-between gap-4">
              <span>Address</span>
              <TokenAddressLine address={user.address} />
            </div>
            <div className="flex justify-between gap-4">
              <span>Joined</span>
              <span>{formatDate(user.joined)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Followers</span>
              <span>{formatCompact(user.followers)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Following</span>
              <span>{formatCompact(user.following)}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Reputation"
            value={user.reputation.toString()}
            detail="Mock social reputation score."
            tone="cyan"
          />
          <MetricCard
            label="Watchlists"
            value={ownedWatchlists.length.toString()}
            detail="Public lists owned by this profile."
          />
          <MetricCard
            label="Hit rate"
            value={formatPercent(calculateHitRate(allEntries))}
            detail="Computed with stance-aware logic."
            tone="amber"
          />
          <MetricCard
            label="Weighted"
            value={formatPercent(weightedReturn)}
            detail="Average mock watchlist return."
            tone={weightedReturn >= 0 ? "green" : "rose"}
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/42">
            Research badges
          </div>
          <div className="mt-4 grid gap-3">
            {user.badges.map((badge) => (
              <ResearchBadgePill key={badge.label} badge={badge} />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/42">
            Recent comments
          </div>
          <div className="mt-4">
            <CommentFeed items={userComments} limit={4} />
          </div>
        </div>
      </section>

      <WatchlistSummaryTable items={ownedWatchlists} />
    </div>
  );
}
