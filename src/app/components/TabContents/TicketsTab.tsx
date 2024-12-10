"use client";
import styled from 'styled-components';
import { TicketCard } from '../Cards/TicketCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

interface TicketsTabProps {
  tickets: any[];
}

export const TicketsTab: React.FC<TicketsTabProps> = ({ tickets }) => {
  return (
    <Grid>
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onClick={(ticket) => console.log('Clicked ticket:', ticket)}
        />
      ))}
    </Grid>
  );
};
