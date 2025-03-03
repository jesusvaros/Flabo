"use client";

import { Card, Title, Details } from "./TicketCard.styles";
import { useRouter } from "next/navigation";

interface Ticket {
  id: string;
  content: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tickets/${ticket.id}`);
  };

  return (
    <Card onClick={handleClick}>
      <Title>{ticket.content}</Title>
      <Details>details</Details>
    </Card>
  );
};
