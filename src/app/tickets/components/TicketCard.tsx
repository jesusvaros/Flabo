"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TicketWithPosition } from "@/types/collections";

interface TicketCardProps {
  ticket: TicketWithPosition;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/collections");
  };

  return (
    <Card
      onClick={handleCardClick}
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
  );
};
