import { notFound } from "next/navigation";
import { TokenDetailView } from "@/components/mergen-watch-app";
import { baseTokens, getTokenByAddress } from "@/lib/mock-data";

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

  return <TokenDetailView address={token.address} />;
}
