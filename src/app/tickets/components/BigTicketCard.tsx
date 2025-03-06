"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketWithPosition } from "@/types/collections";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
  const drawingEditorRef = useRef<{ saveDrawing: () => void }>(null);
  const { style } = useCardAnimation(clickPosition);
  
  const handleCloseRequested = () => {
    if (drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    onClose();
  };

  const { drawerOpen, onDrawerOpenChange } =
    useDrawerAnimation(handleCloseRequested);

  useEffect(() => {
    if (isMobile) {
      setIsDrawingBoardMounted(true);
    } else {
      const timer = setTimeout(() => {
        setIsDrawingBoardMounted(true);
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isMobile]);

  // For mobile, render the Drawer component
  if (isMobile) {
    return (
      <MobileTicketDrawer
        ticket={ticket}
        drawerOpen={drawerOpen}
        onOpenChange={onDrawerOpenChange}
        onClose={handleCloseRequested}
        isDrawingBoardMounted={isDrawingBoardMounted}
        drawingEditorRef={drawingEditorRef}
      />
    );
  }

  // For desktop, render the animated card
  return (
    <DesktopTicketCard
      ticket={ticket}
      style={style}
      onClose={handleCloseRequested}
      isDrawingBoardMounted={isDrawingBoardMounted}
      drawingEditorRef={drawingEditorRef}
    />
  );
};

const MobileTicketDrawer = ({
  ticket,
  drawerOpen,
  onOpenChange,
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef,
}: MobileTicketDrawerProps) => {
  return (
    <Drawer open={drawerOpen} onOpenChange={onOpenChange} snapPoints={[1]}>
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

const DesktopTicketCard = ({
  ticket,
  style,
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef,
}: DesktopTicketCardProps) => {
  return (
    <>
      <Card
        style={style}
        className={cn(
          "select-none fixed z-50 bg-accent border-muted shadow-lg",
          "w-[90%] max-w-2xl"
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
            <div
              className="mt-6 transition-all duration-200 ease-in-out"
              style={{
                height: isDrawingBoardMounted ? "400px" : "0",
                overflow: "hidden",
                transitionDelay: "500ms",
                borderRadius: "0.375rem",
              }}
            >
              {isDrawingBoardMounted ? (
                <TicketDrawingBoard
                  ticketId={ticket.id}
                  initialDrawing={ticket.drawing}
                  onClose={onClose}
                  ref={drawingEditorRef}
                />
              ) : (
                <div className="h-0 w-0" />
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
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </>
  );
};
