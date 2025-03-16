import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketWithPositionConversion } from "@/types/collections";
import { X, Pencil } from "lucide-react";
import { TicketDrawingBoard } from "../TicketDrawingBoard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AIConversionView } from "./AIConversionView";
import { Input } from "@/components/ui/input";

interface DesktopTicketCardProps {
  ticket: TicketWithPositionConversion;
  style: React.CSSProperties;
  onClose: () => void;
  isDrawingBoardMounted: boolean;
  drawingEditorRef: React.RefObject<{ saveDrawing: () => void }>;
  showAIView: boolean;
  handleAIViewToggle: (show: boolean) => void;
  showGeneratedDrawing: boolean;
  handleDrawingToggle: (checked: boolean) => void;
  isEditing: boolean;
  editedContent: string;
  onTitleEdit: () => void;
  onTitleSave: () => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}


export const DISABLE_GENERATED_DRAWING = true;

export const DesktopTicketCard = ({
  ticket,
  style,
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef,
  showAIView,
  handleAIViewToggle,
  showGeneratedDrawing,
  handleDrawingToggle,
  isEditing,
  editedContent,
  onTitleEdit,
  onTitleSave,
  onTitleChange,
  onTitleKeyDown,
}: DesktopTicketCardProps) => {
  return (
    <>
      <Card
        style={style}
        className={cn(
          "select-none fixed z-50 bg-accent border-muted shadow-lg",
          "w-[90%] max-w-6xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="py-8 px-6 group h-14 flex justify-center">
          <div className="flex justify-between items-center mb-2">
            <div className=" relative flex items-center">
              {isEditing ? (
                  <Input
                    value={editedContent}
                    onChange={onTitleChange}
                    onKeyDown={onTitleKeyDown}
                    onBlur={onTitleSave}
                    autoFocus
                    className="font-semibold text-xl"
                  />
              ) : (
                <div className="flex items-center">
                  <CardTitle >{ticket.content}</CardTitle>
                  <button
                    onClick={onTitleEdit}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ai-mode"
                  checked={showAIView}
                  onCheckedChange={handleAIViewToggle}
                />
                <Label htmlFor="ai-mode">AI Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  disabled={DISABLE_GENERATED_DRAWING}
                  id="generated-drawing"
                  checked={showGeneratedDrawing}
                  onCheckedChange={handleDrawingToggle}
                />
                <Label htmlFor="generated-drawing">Generated Drawing</Label>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="transition-all duration-200 ease-in-out"
            style={{
              height: isDrawingBoardMounted ? "80vh" : "0",
              overflow: "hidden",
              transitionDelay: "500ms",
              borderRadius: "0.375rem",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {isDrawingBoardMounted && (
              <>
                {showAIView ? (
                  <AIConversionView ticket={ticket} />
                ) : (
                  <TicketDrawingBoard
                    ticketId={ticket.id}
                    initialDrawing={showGeneratedDrawing ? ticket.drawing_generated : ticket.drawing}
                    onClose={onClose}
                    ref={drawingEditorRef}
                  />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </>
  );
};
