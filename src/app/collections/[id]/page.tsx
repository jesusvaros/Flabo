import { createClient } from "../../../../utils/supabase/server";
import { TicketCard } from "../../components/Cards/TicketCard";
import { Container, Description, Grid, Header, Title } from "./styles";

export default async function CollectionPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  // Get tickets in this collection using the junction table
  const { data: collectionDetails, error } = await supabase
    .from(`collections`)
    .select(`id, title, tickets ( id, content)`)
    .eq("id", params.id)
    .single();

  if (error) {
    return null;
  }

  const tickets = collectionDetails.tickets;

  return (
    <Container>
      <Header>
        <Title>{collectionDetails?.title}</Title>
        <Description>description</Description>
      </Header>

      <Grid>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </Grid>
    </Container>
  );
}
