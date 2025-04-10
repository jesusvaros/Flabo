import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketWithPositionConversion } from "@/types/collections";
import { X, Pencil, Image, Link, ChevronLeft } from "lucide-react";
import { TicketDrawingBoard } from "../TicketDrawingBoard";
import { AIConversionView } from "./AIConversionView";
import { TicketPictureBoard } from "./TicketPictureBoard";
import TicketLinkBoard from "./TicketLinkBoard";
import TicketTextBoard from "./TicketTextBoard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { Input } from "@/components/ui/input";
import { useTicketCard } from "../../context/TicketCardContext";

export type TabType = "recipe" | "notes" | "image" | "link" | "text";

interface DesktopTicketCardProps {
  ticket: TicketWithPositionConversion;
  onClose: () => void;
  isDrawingBoardMounted: boolean;
  drawingEditorRef: React.RefObject<{ saveDrawing: () => void }>;
  isEditing: boolean;
  editedContent: string;
  onTitleEdit: () => void;
  onTitleSave: () => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  style: React.CSSProperties;
}

export const DesktopTicketCard: React.FC<DesktopTicketCardProps> = ({
  ticket,
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef,
  isEditing,
  editedContent,
  onTitleEdit,
  onTitleSave,
  onTitleChange,
  onKeyDown,
  style,
}) => {
  // Use the ticket card context for state management
  const { state, setActiveTab, onClose: contextOnClose } = useTicketCard();
  const { activeTab } = state;

  const handleTabChange = (tab: string) => {
    // If we're changing away from the notes tab, save the drawing
    if (activeTab === 'notes' && tab !== 'notes' && drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    setActiveTab(tab as TabType);
  };

  const handleCloseRequested = async () => {
    handleNotesTabChange();
    await contextOnClose();
    onClose();
  };

  const handleNotesTabChange = () => {
     if (activeTab === 'notes' && drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
  };

  const tabToRecipe = () => {
    handleNotesTabChange();
    setActiveTab('recipe');
  };

  return (
    <>
      <Card
        style={style}
        className={cn(
          "select-none fixed z-50 bg-accent border shadow-lg",
          "w-[90%] max-w-6xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="py-6 px-6 group border-b bg-accent">
          <div className="flex justify-between items-center mb-2">
            <div className="relative flex items-center">
              {isEditing ? (
                <Input
                  value={editedContent}
                  onChange={onTitleChange}
                  onKeyDown={onKeyDown}
                  onBlur={onTitleSave}
                  autoFocus
                  className="font-semibold text-xl text-black bg-accent"
                />
              ) : (
                <div className="flex items-center">
                  <CardTitle className="font-semibold text-black">{ticket.content}</CardTitle>
                  <button
                    onClick={onTitleEdit}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4 text-black" />
                  </button>
                </div>
              )}
            </div>
            <Button
              onClick={handleCloseRequested}
              className="rounded-full p-1 hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between w-full mt-4">
            <Button
              onClick={tabToRecipe}
              className="rounded-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Recipe</span>
            </Button>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 w-full max-w-md bg-gray-100">
            <TabsTrigger value="notes" className="font-medium data-[state=active]:bg-accent data-[state=active]:text-black">
                  <Pencil className="mr-2 h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="image" className="font-medium data-[state=active]:bg-accent data-[state=active]:text-black">
                  <Image className="h-4 w-4 mr-2" />
                  Picture
                </TabsTrigger>
                <TabsTrigger value="link" className="font-medium data-[state=active]:bg-accent data-[state=active]:text-black">
                  <Link className="h-4 w-4 mr-2" />
                  Link
                </TabsTrigger>
                <TabsTrigger value="text" className="font-medium data-[state=active]:bg-accent data-[state=active]:text-black">
                  <Pencil className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="transition-all duration-200 ease-in-out bg-accent" style={{
            height: isDrawingBoardMounted ? "80vh" : "0",
            overflow: "hidden",
            borderRadius: "0.375rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}>
            {isDrawingBoardMounted && (
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="recipe" className="h-full m-0 bg-accent">
                  <AIConversionView ticket={ticket} />
                </TabsContent>
                <TabsContent value="notes" className="h-full m-0 bg-accent">
                  <TicketDrawingBoard
                    ticketId={ticket.id}
                    initialDrawing={ticket.drawing}
                    ref={drawingEditorRef}
                    className="h-full"
                    fullHeight
                  />
                </TabsContent>
                <TabsContent value="image" className="h-full m-0 bg-accent">
                  <TicketPictureBoard
                    className="h-full"
                  />
                </TabsContent>
                <TabsContent value="link" className="h-full m-0 bg-accent">
                  <TicketLinkBoard
                    className="h-full"
                  />
                </TabsContent>
                <TabsContent value="text" className="h-full m-0 bg-accent">
                  <TicketTextBoard
                    className="h-full"
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="fixed inset-0 z-40" onClick={handleCloseRequested} />
    </>
  );
};
