import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketWithPositionConversion } from "@/types/collections";
import { X, Pencil, Image, Link, FileEdit } from "lucide-react";
import { TicketDrawingBoard } from "../TicketDrawingBoard";
import { cn } from "@/lib/utils";
import { AIConversionView } from "./AIConversionView";
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
  const hasRecipe = ticket.recipe_conversions && ticket.recipe_conversions.length > 0;
  const [activeTab, setActiveTab] = useState<string>(hasRecipe ? "recipe" : "drawing");

  useEffect(() => {
    if (hasRecipe && activeTab === "drawing") {
      setActiveTab("recipe");
    }
  }, [hasRecipe, ticket.recipe_conversions]);

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
        <CardHeader className="py-6 px-6 group">
          <div className="flex justify-between items-center mb-2">
            <div className="relative flex items-center">
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
                  <CardTitle>{ticket.content}</CardTitle>
                  <button
                    onClick={onTitleEdit}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
              <TabsTrigger value="recipe">Recipe</TabsTrigger>
              <TabsTrigger value="drawing">
                <FileEdit className="h-4 w-4 mr-2" />
                Drawing
              </TabsTrigger>
              <TabsTrigger value="image">
                <Image className="h-4 w-4 mr-2" />
                Picture
              </TabsTrigger>
              <TabsTrigger value="link">
                <Link className="h-4 w-4 mr-2" />
                Link
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="transition-all duration-200 ease-in-out" style={{
            height: isDrawingBoardMounted ? "80vh" : "0",
            overflow: "hidden",
            borderRadius: "0.375rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}>
            {isDrawingBoardMounted && (
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="recipe" className="h-full m-0">
                  <AIConversionView ticket={ticket} />
                </TabsContent>
                <TabsContent value="drawing" className="h-full m-0">
                  <TicketDrawingBoard
                    ticketId={ticket.id}
                    initialDrawing={ticket.drawing}
                    onClose={onClose}
                    ref={drawingEditorRef}
                  />
                </TabsContent>
                <TabsContent value="image" className="h-full m-0">
                  <div className="h-full flex flex-col items-center justify-center p-6">
                    <Image className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Add an Image</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Upload an image to accompany your recipe
                    </p>
                    <div className="w-full max-w-md p-6 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="link" className="h-full m-0">
                  <div className="h-full flex flex-col items-center justify-center p-6">
                    <Link className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Add a Link</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Add a link to an external resource for your recipe
                    </p>
                    <div className="w-full max-w-md">
                      <Input
                        type="url"
                        placeholder="https://example.com/recipe"
                        className="w-full"
                      />
                      <Button variant="secondary" className="w-full mt-2">
                        Add Link
                      </Button>
                    </div>
                  </div>
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
