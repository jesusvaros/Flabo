"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketWithPosition } from "@/types/collections";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCardAnimation, useDrawerAnimation } from "../hooks/use-ticket-card";
import { TicketDrawingBoard } from "./TicketDrawingBoard";
import { useState, useEffect, useRef } from "react";

interface BigTicketCardProps {
  ticket: TicketWithPosition;
  onClose: () => void;
  clickPosition: { x: number; y: number } | null;
}

interface MobileTicketDrawerProps {
  ticket: TicketWithPosition;
  drawerOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  isDrawingBoardMounted: boolean;
  drawingEditorRef: React.RefObject<{ saveDrawing: () => void }>;
}

interface DesktopTicketCardProps {
  ticket: TicketWithPosition;
  style: React.CSSProperties;
  onClose: () => void;
  isDrawingBoardMounted: boolean;
  drawingEditorRef: React.RefObject<{ saveDrawing: () => void }>;
}

export const BigTicketCard = ({
  ticket,
  onClose,
  clickPosition,
}: BigTicketCardProps) => {
  const isMobile = useIsMobile();
  const [isDrawingBoardMounted, setIsDrawingBoardMounted] = useState(false);
  
  // Create a ref to store the drawing editor instance
  const drawingEditorRef = useRef<{ saveDrawing: () => void }>(null);
  
  // Use custom hooks to separate logic
  const { style } = useCardAnimation(clickPosition);
  
  // This function will be called when the user clicks the close button
  const handleCloseRequested = () => {
    // Call the saveDrawing function on the drawing editor instance
    if (drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    
    // Call the onClose
    onClose();
  };
  
  const { drawerOpen, onDrawerOpenChange } = useDrawerAnimation(handleCloseRequested);

  // Mount the DrawingBoard after the opening animation has finished for desktop
  // For mobile, mount immediately to avoid animation issues
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setIsDrawingBoardMounted(true);
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsDrawingBoardMounted(true);
    }
  }, [isMobile]);

  // For mobile, render the Drawer component
  if (isMobile) {
    return <MobileTicketDrawer 
      ticket={ticket}
      drawerOpen={drawerOpen} 
      onOpenChange={onDrawerOpenChange}
      onClose={handleCloseRequested}
      isDrawingBoardMounted={isDrawingBoardMounted}
      drawingEditorRef={drawingEditorRef}
    />;
  }

  // For desktop, render the animated card
  return <DesktopTicketCard 
    ticket={ticket}
    style={style} 
    onClose={handleCloseRequested}
    isDrawingBoardMounted={isDrawingBoardMounted}
    drawingEditorRef={drawingEditorRef}
  />;
};

// Separated mobile drawer component
const MobileTicketDrawer = ({ 
  ticket, 
  drawerOpen, 
  onOpenChange, 
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef
}: MobileTicketDrawerProps) => {
  return (
    <Drawer 
      open={drawerOpen} 
      onOpenChange={onOpenChange} 
      snapPoints={[1]}
    >
      <DrawerContent className="p-0 h-auto max-h-[90vh]">
        <DrawerHeader className="border-b border-muted py-4 px-4 pb-5">
          <DrawerTitle>{ticket.content}</DrawerTitle>
        </DrawerHeader>
        
        {isDrawingBoardMounted && (
          <div className="w-full h-[80vh]">
            <TicketDrawingBoard 
              ticketId={ticket.id} 
              initialDrawing={ticket.drawing}
              onClose={onClose}
              ref={drawingEditorRef}
              className="h-full"
              fullHeight
            />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

// Separated desktop card component
const DesktopTicketCard = ({ 
  ticket, 
  style, 
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef
}: DesktopTicketCardProps) => {
  return (
    <>
      <Card
        style={style}
        className={cn(
          "select-none fixed z-50 bg-accent border-muted shadow-lg",
          "w-[90%] max-w-2xl",
          "transition-all duration-300 ease-out"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="p-6">
          <CardTitle className="text-2xl text-foreground">
            {ticket.content}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Position: {ticket.position}
            </p>
            
            {/* Drawing Board */}
            <div className="mt-6 border rounded-md overflow-hidden">
              {isDrawingBoardMounted && (
                <TicketDrawingBoard 
                  ticketId={ticket.id} 
                  initialDrawing={ticket.drawing}
                  onClose={onClose}
                  ref={drawingEditorRef}
                />
              )}
            </div>
          </div>
        </CardContent>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Close ticket details"
        >
          <X className="h-4 w-4" />
        </button>
      </Card>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
    </>
  );
};
