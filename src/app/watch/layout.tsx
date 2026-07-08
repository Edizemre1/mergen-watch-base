import { WatchAppShell } from "@/components/watch-ui";

export default function WatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WatchAppShell>{children}</WatchAppShell>;
}
