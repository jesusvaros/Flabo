import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketWithPositionConversion } from "@/types/collections";
import { X, Pencil, Image, Link, FileEdit, ChevronLeft } from "lucide-react";
import { TicketDrawingBoard } from "../TicketDrawingBoard";
import { AIConversionView } from "./AIConversionView";
import TicketPictureBoard from "./TicketPictureBoard";
import TicketLinkBoard from "./TicketLinkBoard";
import TicketTextBoard from "./TicketTextBoard";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface DesktopTicketCardProps {
  ticket: TicketWithPositionConversion;
  style: React.CSSProperties;
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

export const DesktopTicketCard = ({
  ticket,
  style,
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef,
  isEditing,
  editedContent,
  onTitleEdit,
  onTitleSave,
  onTitleChange,
  onTitleKeyDown,
}: DesktopTicketCardProps) => {
  const [activeTab, setActiveTab] = useState<string>("recipe");

  const handleBackToOptions = () => {
    setActiveTab("recipe");
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
                  onKeyDown={onTitleKeyDown}
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
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 text-black"
            >
              <X className="h-4 w-4" />
            </Button>

          </div>

          <div className="flex items-center justify-between w-full mt-4">
            <Button
              onClick={handleBackToOptions}
              className="rounded-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Recipe</span>
            </Button>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full max-w-md bg-gray-100">
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
            )}
          </div>
        </CardContent>
      </Card>
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </>
  );
};
