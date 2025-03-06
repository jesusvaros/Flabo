"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketWithPosition } from "@/types/collections";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCardAnimation, useDrawerAnimation } from "../hooks/use-ticket-card";
import { TicketDrawingBoard } from "./TicketDrawingBoard";
import { useCallback, useState, useEffect } from "react";
import { TLEditorSnapshot } from "tldraw";
import { useDrawingStorage } from "../hooks/use-drawing-storage";

interface BigTicketCardProps {
  ticket: TicketWithPosition;
  onClose: () => void;
  clickPosition: { x: number; y: number } | null;
}

export const BigTicketCard = ({
  ticket,
  onClose,
  clickPosition,
}: BigTicketCardProps) => {
  const isMobile = useIsMobile();
  const [isDrawingBoardMounted, setIsDrawingBoardMounted] = useState(false);
  const { saveDrawing } = useDrawingStorage(ticket.id);
  
  // Use custom hooks to separate logic
  const { style } = useCardAnimation(clickPosition);
  const { drawerOpen, handleDrawerClose, onDrawerOpenChange } = useDrawerAnimation(onClose);

  // Montar el DrawingBoard después de que la animación de apertura haya terminado
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDrawingBoardMounted(true);
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Manejador para guardar el dibujo
  const handleSaveDrawing = useCallback((drawing: TLEditorSnapshot) => {
    console.log("Guardando dibujo en la base de datos");
    saveDrawing(drawing);
  }, [saveDrawing]);

  // For mobile, render the Drawer component
  if (isMobile) {
    return <MobileTicketDrawer 
      ticket={ticket}
      drawerOpen={drawerOpen} 
      onOpenChange={onDrawerOpenChange}
      onClose={handleDrawerClose}
      isDrawingBoardMounted={isDrawingBoardMounted}
      onSaveDrawing={handleSaveDrawing}
    />;
  }

  // For desktop, render the animated card
  return <DesktopTicketCard 
    ticket={ticket}
    style={style} 
    onBackdropClick={onClose}
    isDrawingBoardMounted={isDrawingBoardMounted}
    onSaveDrawing={handleSaveDrawing}
  />;
};

// Separated mobile drawer component
const MobileTicketDrawer = ({ 
  ticket, 
  drawerOpen, 
  onOpenChange, 
  onClose,
  isDrawingBoardMounted,
  onSaveDrawing
}: { 
  ticket: TicketWithPosition; 
  drawerOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
  onClose: () => void;
  isDrawingBoardMounted: boolean;
  onSaveDrawing: (drawing: TLEditorSnapshot) => void;
}) => {
  return (
    <Drawer 
      open={drawerOpen} 
      onOpenChange={onOpenChange} 
      snapPoints={[1.4]}
    >
      <DrawerContent className="bg-accent">
        <DrawerHeader className="border-b border-muted">
          <DrawerTitle>{ticket.content}</DrawerTitle>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close ticket details"
          >
            <X className="h-4 w-4" />
          </button>
        </DrawerHeader>
        <div className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Position: {ticket.position}
            </p>
            
            {/* Drawing Board */}
            <div className="mt-6 border rounded-md overflow-hidden">
              {isDrawingBoardMounted && (
                <TicketDrawingBoard 
                  ticketId={ticket.id} 
                  initialDrawing={ticket.drawing}
                  onSave={onSaveDrawing}
                />
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// Separated desktop card component
const DesktopTicketCard = ({ 
  ticket, 
  style, 
  onBackdropClick,
  isDrawingBoardMounted,
  onSaveDrawing
}: { 
  ticket: TicketWithPosition; 
  style: React.CSSProperties; 
  onBackdropClick: () => void;
  isDrawingBoardMounted: boolean;
  onSaveDrawing: (drawing: TLEditorSnapshot) => void;
}) => {
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
                  onSave={onSaveDrawing}
                />
              )}
            </div>
          </div>
        </CardContent>
        <button
          onClick={onBackdropClick}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Close ticket details"
        >
          <X className="h-4 w-4" />
        </button>
      </Card>
      <div 
        className="fixed inset-0 z-40"
        onClick={onBackdropClick}
      />
    </>
  );
};
