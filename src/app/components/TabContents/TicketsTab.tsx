import { TicketCard } from "../Cards/TicketCard";
import { createClient } from "../../../../utils/supabase/server";
import { SuspenseTab } from "./SuspenseTab";
import { CreateTicketCard } from "../Tickets/CreateTicketCard";

export const TicktetsTabSuspense = () => {
  return (
    <SuspenseTab label="Tickets" id="tickets">
      <TicketsTab />
    </SuspenseTab>
  );
};

export const TicketsTab = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("creator_id", user?.id);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 p-5">
      <CreateTicketCard />
      {tickets?.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};
