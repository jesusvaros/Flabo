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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  showAIView: boolean;
  setShowAIView: (show: boolean) => void;
}

interface DesktopTicketCardProps {
  ticket: TicketWithPosition;
  style: React.CSSProperties;
  onClose: () => void;
  isDrawingBoardMounted: boolean;
  drawingEditorRef: React.RefObject<{ saveDrawing: () => void }>;
  showAIView: boolean;
  setShowAIView: (show: boolean) => void;
}

export const BigTicketCard = ({
  ticket,
  onClose,
  clickPosition,
}: BigTicketCardProps) => {
  const isMobile = useIsMobile();
  const [isDrawingBoardMounted, setIsDrawingBoardMounted] = useState(false);
  const [showAIView, setShowAIView] = useState(false);
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
        showAIView={showAIView}
        setShowAIView={setShowAIView}
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
      showAIView={showAIView}
      setShowAIView={setShowAIView}
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
  showAIView,
  setShowAIView,
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
              onCheckedChange={setShowAIView}
            />
            <Label htmlFor="mobile-ai-mode">AI Mode</Label>
          </div>
        </DrawerHeader>

        {isDrawingBoardMounted && (
          <div className="w-full h-[80vh]">
            {showAIView ? (
              <div className="flex flex-col items-center justify-center h-full bg-accent/10 rounded-md">
                <p className="text-center text-muted-foreground mb-4">
                  Convert this ticket to an AI-generated version
                </p>
                <Button variant="default">Convert to AI</Button>
              </div>
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

const DesktopTicketCard = ({
  ticket,
  style,
  onClose,
  isDrawingBoardMounted,
  drawingEditorRef,
  showAIView,
  setShowAIView,
}: DesktopTicketCardProps) => {
  return (
    <>
      <Card
        className={cn(
          "select-none fixed z-50 bg-accent border-muted shadow-lg",
          "w-[90%] max-w-6xl"
        )}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="p-4">
          <div className="flex justify-between items-center mb-2">
            <CardTitle>{ticket.content}</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ai-mode"
                  checked={showAIView}
                  onCheckedChange={setShowAIView}
                />
                <Label htmlFor="ai-mode">AI Mode</Label>
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
                  <div className="flex flex-col items-center justify-center h-full bg-accent/10 rounded-md">
                    <p className="text-center text-muted-foreground mb-4">
                      Convert this ticket to an AI-generated version
                    </p>
                    <Button variant="default">Convert to AI</Button>
                  </div>
                ) : (
                  <TicketDrawingBoard
                    ticketId={ticket.id}
                    initialDrawing={ticket.drawing}
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
