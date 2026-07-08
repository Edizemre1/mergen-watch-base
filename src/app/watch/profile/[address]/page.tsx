import { notFound } from "next/navigation";
import { ProfilePageView } from "@/components/mergen-watch-app";
import { getUserByAddress, users } from "@/lib/mock-data";

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

  return <ProfilePageView address={user.address} />;
}
