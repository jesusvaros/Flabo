import { createClient } from "../../../../utils/supabase/server";
import { TicketCard } from "../../components/Cards/TicketCard";
import { CollectionsSidebar } from "../../components/Collections/CollectionsSidebar";
import { redirect } from "next/navigation";
import {
  Container,
  Description,
  Grid,
  Header,
  Title,
  MainContent,
} from "./styles";

type Props = {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage(props: Props) {
  const params = await props.params;
  const collectionId = params.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get all collections for the sidebar, filtered by user_id
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title")
    .eq("creator_id", user.id);

  // Get tickets in this collection using the junction table
  const { data: collectionDetails, error } = await supabase
    .from("collections")
    .select("id, title, tickets ( id, content)")
    .eq("id", collectionId)
    .eq("creator_id", user.id) // Also ensure the collection belongs to the user
    .single();

  if (error || !collectionDetails) {
    return <div>Collection not found</div>;
  }

  return (
    <Container>
      <CollectionsSidebar
        collections={
          collections?.map((col) => ({
            id: col.id,
            name: col.title,
          })) || []
        }
        currentCollectionId={collectionId}
      />
      <MainContent>
        <Header>
          <Title>{collectionDetails.title}</Title>
          <Description>Collection description goes here</Description>
        </Header>
        <Grid>
          {collectionDetails.tickets?.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </Grid>
      </MainContent>
    </Container>
  );
}
