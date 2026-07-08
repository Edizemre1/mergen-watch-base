import { notFound } from "next/navigation";
import { WatchlistDetailView } from "@/components/mergen-watch-app";
import { getWatchlistById, watchlists } from "@/lib/mock-data";

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

  return <WatchlistDetailView id={watchlist.id} />;
}
