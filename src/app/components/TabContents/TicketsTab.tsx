import { TicketCard } from "../Cards/TicketCard";
import { createClient } from "../../../../utils/supabase/server";
import { Grid } from "./CollectionsTab.styles";
import { SuspenseTab } from "./SuspenseTab";

export const TicktetsTabSuspense = () => {
  return (
    <SuspenseTab label="Tickets">
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
    <Grid>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </Grid>
  );
};
