import { SidebarProvider } from "@/components/ui/sidebar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SidebarProvider> {children}</SidebarProvider>;
}
