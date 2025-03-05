"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import { TicketWithPosition } from "@/types/collections";
import { DraggableTicketCard } from "./DraggableTicketCard";

interface Position {
  x: number;
  y: number;
}

interface TicketsBoardProps {
  tickets: TicketWithPosition[];
  onPositionChange: (ticketId: string, position: Position) => void;
  droppableId: string;
}

const CARD_WIDTH = 300;
const CARD_HEIGHT = 100;
const PADDING = 16;

export const TicketsBoard = ({
  tickets: initialTickets,
  onPositionChange,
  droppableId,
}: TicketsBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [tickets, setTickets] = useState<TicketWithPosition[]>(initialTickets);

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: droppableId,
  });

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        setBoardSize({
          width: boardRef.current.clientWidth,
          height: boardRef.current.clientHeight,
        });
      }
    };

    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, []);

  useEffect(() => {
    if (boardRef.current) {
      setDroppableRef(boardRef.current);
    }
  }, [setDroppableRef]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const constrainPosition = (x: number, y: number): Position => {
    return {
      x: Math.max(PADDING, Math.min(x, boardSize.width - CARD_WIDTH - PADDING)),
      y: Math.max(
        PADDING,
        Math.min(y, boardSize.height - CARD_HEIGHT - PADDING)
      ),
    };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta, over } = event;

    // Handle internal drag
    if (active.data.current?.position_x !== undefined) {
      const updatedTickets = tickets.map((item) => {
        if (item.id === active.id) {
          const newPosition = constrainPosition(
            item.position_x + delta.x,
            item.position_y + delta.y
          );

          // Notify parent about position change
          requestAnimationFrame(() => {
            onPositionChange?.(item.id, newPosition);
          });

          return {
            ...item,
            position_x: newPosition.x,
            position_y: newPosition.y,
            z_index: Math.max(...tickets.map((t) => t.z_index)) + 1,
          };
        }
        return item;
      });

      setTickets(updatedTickets);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={boardRef}
        data-droppable-id={droppableId}
        className={`relative w-full h-[calc(100vh-12rem)] bg-muted/10 rounded-lg overflow-hidden ${
          isOver ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
      >
        {tickets.map((ticket) => (
          <DraggableTicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </DndContext>
  );
};
