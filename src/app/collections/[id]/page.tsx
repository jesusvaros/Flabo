import { createClient } from "../../../../utils/supabase/server";
import { TicketCard } from "../../components/Cards/TicketCard";
import { Collection, CollectionsSidebar, Ticket } from "../../components/collections/CollectionsSidebar";
import { Container, Description, Grid, Header, Title, MainContent } from "./styles";

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
    .single() as { data: Collection; error: any };

  if (error) {
    return null;
  }

  // Create an array with just the current collection for the sidebar
  const collections: Collection[] = collectionDetails ? [collectionDetails] : [];

  const tickets = collectionDetails.tickets;

  return (
    <Container>
      <CollectionsSidebar 
        collections={collections}
        currentCollectionId={params.id}
      />
      <MainContent>
        <Header>
          <Title>{collectionDetails?.title}</Title>
          <Description>description</Description>
        </Header>

        <Grid>
          {tickets?.map((ticket: Ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </Grid>
      </MainContent>
    </Container>
  );
}
