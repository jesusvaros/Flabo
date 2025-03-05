"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TicketWithPosition } from "@/types/collections";
import { BigTicketCard } from "./BigTicketCard";

interface TicketCardProps {
  ticket: TicketWithPosition;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const card = e.currentTarget.querySelector('.card-content') as HTMLElement;
    if (card) {
      setCardRect(card.getBoundingClientRect());
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card
        onClick={handleClick}
        className="select-none relative cursor-pointer border-muted bg-accent hover:shadow-md transition-all"
        style={{ transitionDuration: 'var(--duration)', transitionTimingFunction: 'var(--ease-out)' }}
      >
        <div className="card-content h-full">
          <CardHeader>
            <CardTitle className="text-base">{ticket.content}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Position: {ticket.position}</p>
          </CardContent>
        </div>
      </Card>
      {isModalOpen && (
        <BigTicketCard
          ticket={ticket}
          onClose={() => {
            setIsModalOpen(false);
            setCardRect(null);
          }}
          cardRect={cardRect}
        />
      )}
    </>
  );
};
