"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCardAnimation } from "../hooks/use-ticket-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileTicketDrawer, DesktopTicketCard } from "./ticket-card";
import { TicketWithPositionConversion } from "@/types/collections";
import { useCollection } from "@/app/collections/context/CollectionContext";
import { TicketCardProvider } from "../context/TicketCardContext";

interface BigTicketCardProps {
  ticket: TicketWithPositionConversion;
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
      const updatedTicket = {
        ...ticket,
        content: editedContent
      };
      updateTicketInCollection(updatedTicket);
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
    }
  };

  useEffect(() => {
    setIsDrawingBoardMounted(true);
  }, []);

  return (
    <TicketCardProvider ticket={ticket}>
      {isMobile ? (
        <MobileTicketDrawer
          ticket={ticket}
          onClose={handleCloseRequested}
          isDrawingBoardMounted={isDrawingBoardMounted}
          drawingEditorRef={drawingEditorRef}
          isEditing={isEditing}
          editedContent={editedContent}
          onTitleEdit={handleTitleEdit}
          onTitleSave={handleTitleSave}
          onTitleChange={handleTitleChange}
          onTitleKeyDown={handleKeyDown}
        />
      ) : (
        <DesktopTicketCard
          ticket={ticket}
          onClose={handleCloseRequested}
          isDrawingBoardMounted={isDrawingBoardMounted}
          drawingEditorRef={drawingEditorRef}
          isEditing={isEditing}
          editedContent={editedContent}
          onTitleEdit={handleTitleEdit}
          onTitleSave={handleTitleSave}
          onTitleChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          style={style}
        />
      )}
    </TicketCardProvider>
  );
};

export default BigTicketCard;
