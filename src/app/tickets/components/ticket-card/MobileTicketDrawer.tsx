import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { TicketWithPositionConversion } from "@/types/collections";
import { X, Pencil, Image, Link, FileEdit, ChevronLeft } from "lucide-react";
import { TicketDrawingBoard } from "../TicketDrawingBoard";
import { AIConversionView } from "./AIConversionView";
import { TicketPictureBoard } from "./TicketPictureBoard";
import TicketLinkBoard from "./TicketLinkBoard";
import TicketTextBoard from "./TicketTextBoard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTicketCard } from "../../context/TicketCardContext";
import { TabType } from "./DesktopTicketCard";

interface MobileTicketDrawerProps {
  ticket: TicketWithPositionConversion;
  onClose: () => void;
  isDrawingBoardMounted: boolean;
  drawingEditorRef: React.RefObject<{ saveDrawing: () => void }>;
  isEditing: boolean;
  editedContent: string;
  onTitleEdit: () => void;
  onTitleSave: () => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const MobileTicketDrawer = ({
  ticket,
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef,
  isEditing,
  editedContent,
  onTitleEdit,
  onTitleSave,
  onTitleChange,
  onTitleKeyDown,
}: MobileTicketDrawerProps) => {
  // Use the ticket card context for state management
  const { state, setActiveTab, onClose: contextOnClose } = useTicketCard();
  const { activeTab } = state;

  // Lock body scroll on open
  const lockBodyScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  // Unlock body scroll on close
  const unlockBodyScroll = () => {
    document.body.style.overflow = 'auto';
  };

  const handleTabChange = (tab: string) => {
    // If we're changing away from the notes tab, save the drawing
    if (activeTab === 'notes' && tab !== 'notes' && drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    setActiveTab(tab as TabType);
  };

  const handleCloseDrawer = async () => {
    // Save drawing if we're on the notes tab
    if (activeTab === 'notes' && drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    // Unlock body scroll when drawer closes
    unlockBodyScroll();
    // Call context onClose to ensure changes are saved
    await contextOnClose();
    // Then call the component's onClose prop
    onClose();
  };

  const handleGoToRecipe = () => {
    // Save drawing if we're on the notes tab
    if (activeTab === 'notes' && drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    setActiveTab('recipe');
  };

  // Lock the body scroll as soon as the component renders - this runs once when the drawer opens
  React.useLayoutEffect(() => {
    lockBodyScroll();
  }, []);

  return (
    <Drawer open onClose={handleCloseDrawer}>
      <DrawerContent className="p-0 h-auto max-h-[90vh] bg-accent">
        <DrawerHeader className="border-b py-4 px-4 bg-accent">
          <div className="flex justify-between items-center">
            <div className="group relative flex items-center mb-2">
              {isEditing ? (
                <div className="flex items-center w-full">
                  <Input
                    value={editedContent}
                    onChange={onTitleChange}
                    onKeyDown={onTitleKeyDown}
                    onBlur={onTitleSave}
                    autoFocus
                    className="font-semibold text-xl bg-accent"
                  />
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <DrawerTitle className="font-semibold">{ticket.content}</DrawerTitle>
                  <button
                    onClick={onTitleEdit}
                    className="ml-2 p-1 hover:bg-muted rounded-full"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <Button
              onClick={handleGoToRecipe}
              className="rounded-full px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Recipe</span>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 w-full">
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
                <FileEdit className="h-4 w-4 mr-2" />
                Text
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DrawerHeader>

        {isDrawingBoardMounted && (
          <div
            className="transition-all duration-200 ease-in-out"
            style={{
              height: "80vh",
              overflow: "hidden",
              borderRadius: "0.375rem",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Tabs value={activeTab} className="h-full">
              <TabsContent value="recipe">
                <AIConversionView ticket={ticket} />
              </TabsContent>
              <TabsContent value="notes">
                <TicketDrawingBoard
                  ticketId={ticket.id}
                  initialDrawing={ticket.drawing}
                  ref={drawingEditorRef}
                  fullHeight
                />
              </TabsContent>
              <TabsContent value="image">
                <TicketPictureBoard />
              </TabsContent>
              <TabsContent value="link">
                <TicketLinkBoard />
              </TabsContent>
              <TabsContent value="text">
                <TicketTextBoard />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DrawerContent>
      <button
        onClick={handleCloseDrawer}
        className="absolute top-4 right-4 rounded-full p-1 hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
    </Drawer>
  );
};
