import { AppShell } from "@/components/mergen-watch-app";

export default function WatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
