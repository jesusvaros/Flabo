import { SidebarProvider } from "@/components/ui/sidebar";
import { DrawingProvider } from "./tickets/context/drawing-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DrawingProvider>
        {children}
      </DrawingProvider>
    </SidebarProvider>
  );
}
