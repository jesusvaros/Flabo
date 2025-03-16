"use client";

import { useState, useRef, useEffect } from "react";
import { useCardAnimation, useDrawerAnimation } from "../hooks/use-ticket-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileTicketDrawer, DesktopTicketCard } from "./ticket-card";
import { TicketWithPositionConversion } from "@/types/collections";
import { useCollection } from "@/app/collections/context/CollectionContext";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(ticket.content);
  const drawingEditorRef = useRef<{ saveDrawing: () => void }>(null);
  const { style } = useCardAnimation(clickPosition);
  const { updateTicketInCollection, patchTicket } = useCollection();

  const handleCloseRequested = () => {
    if (drawingEditorRef.current) {
      drawingEditorRef.current.saveDrawing();
    }
    onClose();
  };

  const handleTitleEdit = () => {
    setIsEditing(true);
  };

  const handleTitleSave = async () => {
    if (editedContent.trim() !== '') {
      // First update the local state for immediate UI feedback
      const updatedTicket = {
        ...ticket,
        content: editedContent
      };
      updateTicketInCollection(updatedTicket);
      
      // Then save to the database
      await patchTicket(ticket.id, { content: editedContent });
    } else {
      setEditedContent(ticket.content);
    }
    setIsEditing(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditedContent(ticket.content);
      setIsEditing(false);
    }
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
        isEditing={isEditing}
        editedContent={editedContent}
        onTitleEdit={handleTitleEdit}
        onTitleSave={handleTitleSave}
        onTitleChange={handleTitleChange}
        onTitleKeyDown={handleKeyDown}
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
      isEditing={isEditing}
      editedContent={editedContent}
      onTitleEdit={handleTitleEdit}
      onTitleSave={handleTitleSave}
      onTitleChange={handleTitleChange}
      onTitleKeyDown={handleKeyDown}
    />
  );
};
