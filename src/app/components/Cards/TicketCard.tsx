"use client";
import styled from "styled-components";

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  width: 280px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
`;

const Details = styled.div`
  color: #666;
  font-size: 14px;
  margin: 8px 0;
`;

const Tag = styled.span`
  background: #e0e0e0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 8px;
`;

interface Ticket {
  id: string;
  title: string;
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
