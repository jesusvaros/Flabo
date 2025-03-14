"use client";

import { useState, useRef, useEffect } from "react";
import { useCardAnimation, useDrawerAnimation } from "../hooks/use-ticket-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileTicketDrawer, DesktopTicketCard } from "./ticket-card";
import { TicketWithPositionConversion } from "@/types/collections";

interface BigTicketCardProps {
  ticket:  TicketWithPositionConversion ;
  onClose: () => void;
  clickPosition?: { x: number; y: number };
}

export const BigTicketCard = ({
  ticket,
  onClose,
  clickPosition,
}: BigTicketCardProps) => {
  const isMobile = useIsMobile();
  const [isDrawingBoardMounted, setIsDrawingBoardMounted] = useState(false);
  const [showAIView, setShowAIView] = useState(false);
  const [showGeneratedDrawing, setShowGeneratedDrawing] = useState(false);
  const drawingEditorRef = useRef<{ saveDrawing: () => void }>(null);
  const { style } = useCardAnimation(clickPosition);

  const handleCloseRequested = () => {
    if (drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    onClose();
  };

  const handleAIViewToggle = (checked: boolean) => {
    if (checked && drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    setShowAIView(checked);
  };

  const handleDrawingToggle = (checked: boolean) => {
    setShowGeneratedDrawing(checked);
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
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

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
        handleAIViewToggle={handleAIViewToggle}
        showGeneratedDrawing={showGeneratedDrawing}
        handleDrawingToggle={handleDrawingToggle}
      />
    );
  }

  return (
    <DesktopTicketCard
      ticket={ticket}
      style={style}
      onClose={handleCloseRequested}
      isDrawingBoardMounted={isDrawingBoardMounted}
      drawingEditorRef={drawingEditorRef}
      showAIView={showAIView}
      handleAIViewToggle={handleAIViewToggle}
      showGeneratedDrawing={showGeneratedDrawing}
      handleDrawingToggle={handleDrawingToggle}
    />
  );
};
