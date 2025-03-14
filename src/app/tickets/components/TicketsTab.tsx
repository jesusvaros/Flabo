import { SuspenseTab } from "@/app/components/TabContents/SuspenseTab";
import { CreateTicketCard } from "./CreateTicketCard";
import { TicketCard } from "./TicketCard";
import { Ticket, TicketWithPosition } from "@/types/collections";

interface TicketsTabProps {
  tickets: Ticket[];
}

const transformTicket = (ticket: Ticket): TicketWithPosition => ({
  ...ticket,
  position_x: 0,
  position_y: 0,
  z_index: 0,
  position: 0,
  drawing: null,
});

export const TicketsTabSuspense = ({ tickets }: TicketsTabProps) => {
  return (
    <SuspenseTab label="Tickets" id="tickets">
      <TicketsTab tickets={tickets} />
    </SuspenseTab>
  );
};

function TicketsTab({ tickets }: TicketsTabProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 p-5">
      <CreateTicketCard />
      {tickets?.map((ticket) => (
        <TicketCard key={ticket.id} ticket={transformTicket(ticket)} />
      ))}
    </div>
  );
}
