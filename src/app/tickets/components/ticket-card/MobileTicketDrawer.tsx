import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { TicketWithPositionConversion } from "@/types/collections";
import { X, Pencil, Image, Link, FileEdit, ChevronLeft } from "lucide-react";
import { TicketDrawingBoard } from "../TicketDrawingBoard";
import { AIConversionView } from "./AIConversionView";
import TicketPictureBoard from "./TicketPictureBoard";
import TicketLinkBoard from "./TicketLinkBoard";
import TicketTextBoard from "./TicketTextBoard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface MobileTicketDrawerProps {
  ticket: TicketWithPositionConversion;
  drawerOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  drawerOpen,
  onOpenChange,
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
  const [activeTab, setActiveTab] = useState<string>("recipe");
  const handleBackToOptions = () => {
    setActiveTab("recipe");
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={onOpenChange}>
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
                    className="font-semibold text-xl text-black bg-accent"
                  />
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <DrawerTitle className="font-semibold text-black">{ticket.content}</DrawerTitle>
                  <button
                    onClick={onTitleEdit}
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="h-4 w-4 text-black" />
                  </button>
                </div>
              )}
            </div>

            {activeTab !== "recipe" && (
              <button
                onClick={handleBackToOptions}
                className="rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 text-black flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Back to Recipe</span>
              </button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4 w-full bg-gray-100">
              <TabsTrigger value="drawing" className="font-medium data-[state=active]:bg-accent data-[state=active]:text-black">
                <FileEdit className="h-4 w-4 mr-2" />
                Drawing
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
            className="transition-all duration-200 ease-in-out bg-accent"
            style={{
              height: "80vh",
              overflow: "hidden",
              borderRadius: "0.375rem",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Tabs value={activeTab} className="h-full">
              <TabsContent value="recipe" className="h-full m-0 bg-accent">
                <AIConversionView ticket={ticket} />
              </TabsContent>
              <TabsContent value="drawing" className="h-full m-0">
                <TicketDrawingBoard
                  ticketId={ticket.id}
                  initialDrawing={ticket.drawing}
                  onClose={onClose}
                  ref={drawingEditorRef}
                  className="h-full"
                  fullHeight
                />
              </TabsContent>
              <TabsContent value="image" className="h-full m-0 bg-accent">
                <TicketPictureBoard
                  ticketId={ticket.id}
                  onClose={onClose}
                  className="h-full"
                  fullHeight
                />
              </TabsContent>
              <TabsContent value="link" className="h-full m-0 bg-accent">
                <TicketLinkBoard
                  ticketId={ticket.id}
                  onClose={onClose}
                  className="h-full"
                  fullHeight
                />
              </TabsContent>
              <TabsContent value="text" className="h-full m-0 bg-accent">
                <TicketTextBoard
                  ticketId={ticket.id}
                  onClose={onClose}
                  className="h-full"
                  fullHeight
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DrawerContent>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-100 text-black"
      >
        <X className="h-4 w-4" />
      </button>
    </Drawer>
  );
};
