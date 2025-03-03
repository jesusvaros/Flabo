import { createClient } from "../../../../utils/supabase/server";
import { TicketCard } from "../../components/Cards/TicketCard";
import { CollectionsSidebar } from "../../components/Collections/CollectionsSidebar";
import { Container, Description, Grid, Header, Title, MainContent } from "./styles";

export default async function CollectionPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  
  // Get all collections for the sidebar
  const { data: collections } = await supabase
    .from('collections')
    .select('id, title');

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
      <CollectionsSidebar 
        collections={collections?.map(col => ({ 
          id: col.id, 
          name: col.title 
        })) || []}
        currentCollectionId={params.id}
      />
      <MainContent>
        <Header>
          <Title>{collectionDetails?.title}</Title>
          <Description>description</Description>
        </Header>

        <Grid>
          {tickets?.map((ticket: any) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </Grid>
      </MainContent>
    </Container>
  );
}
