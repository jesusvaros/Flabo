"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { Ticket } from "@/types/collections";
import { DraggableTicketCard } from "./DraggableTicketCard";
import { createClient } from "../../../../../utils/supabase/client";

interface Position {
  x: number;
  y: number;
}

interface TicketsBoardProps {
  tickets: Ticket[];
  collectionId: string;
  onPositionChange?: (id: string, position: Position) => void;
}

const CARD_WIDTH = 300;
const CARD_HEIGHT = 100;
const PADDING = 16;

export const TicketsBoard = ({
  tickets: initialTickets,
  collectionId,
  onPositionChange,
}: TicketsBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

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
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const constrainPosition = (x: number, y: number): Position => {
    return {
      x: Math.max(PADDING, Math.min(x, boardSize.width - CARD_WIDTH - PADDING)),
      y: Math.max(PADDING, Math.min(y, boardSize.height - CARD_HEIGHT - PADDING)),
    };
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, delta } = event;
    
    setTickets((items) => {
      return items.map((item) => {
        if (item.id === active.id) {
          const newPosition = constrainPosition(
            item.position_x + delta.x,
            item.position_y + delta.y
          );
          
          // Update position in database
          const supabase = createClient();
          supabase
            .from("collections_tickets")
            .update({
              position_x: newPosition.x,
              position_y: newPosition.y,
              z_index: Math.max(...items.map(t => t.z_index)) + 1,
            })
            .eq("collection_id", collectionId)
            .eq("ticket_id", item.id)
            .then(() => {
              onPositionChange?.(item.id, newPosition);
            });

          return {
            ...item,
            position_x: newPosition.x,
            position_y: newPosition.y,
            z_index: Math.max(...items.map(t => t.z_index)) + 1,
          };
        }
        return item;
      });
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div 
        ref={boardRef}
        className="relative w-full h-[calc(100vh-12rem)] bg-muted/10 rounded-lg overflow-hidden"
      >
        {tickets.map((ticket) => (
          <DraggableTicketCard
            key={ticket.id}
            ticket={ticket}
          />
        ))}
      </div>
    </DndContext>
  );
};
