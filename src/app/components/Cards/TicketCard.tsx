"use client";

import { Card, Title, Details } from "./TicketCard.styles";

interface Ticket {
  id: string;
  content: string;
}

interface TicketCardProps {
  ticket: Ticket;
  onClick?: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <Card onClick={() => onClick?.(ticket)}>
      <Title>{ticket.content}</Title>
      <Details>details</Details>
    </Card>
  );
};
