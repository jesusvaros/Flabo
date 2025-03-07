import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { TicketWithPosition } from "@/types/collections";
import { X } from "lucide-react";
import { TicketDrawingBoard } from "../TicketDrawingBoard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AIConversionView } from "./AIConversionView";

interface MobileTicketDrawerProps {
  ticket: TicketWithPosition;
  drawerOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  isDrawingBoardMounted: boolean;
  drawingEditorRef: React.RefObject<{ saveDrawing: () => void }>;
  showAIView: boolean;
  handleAIViewToggle: (show: boolean) => void;
}

export const MobileTicketDrawer = ({
  ticket,
  drawerOpen,
  onOpenChange,
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef,
  showAIView,
  handleAIViewToggle,
}: MobileTicketDrawerProps) => {
  return (
    <Drawer open={drawerOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0 h-auto max-h-[90vh]">
        <DrawerHeader className="border-b border-muted py-4 px-4 pb-5">
          <DrawerTitle>{ticket.content}</DrawerTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="mobile-ai-mode"
              checked={showAIView}
              onCheckedChange={handleAIViewToggle}
            />
            <Label htmlFor="mobile-ai-mode">AI Mode</Label>
          </div>
        </DrawerHeader>

        {isDrawingBoardMounted && (
          <div
            className="transition-all duration-200 ease-in-out"
            style={{
              height: "80vh",
              overflow: "hidden",
              transitionDelay: "500ms",
              borderRadius: "0.375rem",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {showAIView ? (
              <AIConversionView />
            ) : (
              <TicketDrawingBoard
                ticketId={ticket.id}
                initialDrawing={ticket.drawing}
                onClose={onClose}
                ref={drawingEditorRef}
                className="h-full"
                fullHeight
              />
            )}
          </div>
        )}
      </DrawerContent>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full p-1 hover:bg-accent"
      >
        <X className="h-4 w-4" />
      </button>
    </Drawer>
  );
};
