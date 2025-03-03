"use client";

import { TicketCard } from "../Cards/TicketCard";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { Container, MainContent, Header, Title, Description, Grid } from "../../collections/styles";

interface Collection {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  content: string;
}

interface CollectionDetails {
  id: string;
  title: string;
  tickets: Ticket[];
}

interface CollectionsViewProps {
  collections: Collection[];
  selectedCollection?: CollectionDetails | null;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  selectedCollection,
}) => {
  return (
    <Container>
      <CollectionsSidebar
        collections={collections}
        currentCollectionId={selectedCollection?.id}
      />
      <MainContent>
        <Header>
          <Title>
            {selectedCollection ? selectedCollection.title : "My Collections"}
          </Title>
          <Description>
            {selectedCollection
              ? "Collection description goes here"
              : "Select a collection to view its tickets"}
          </Description>
        </Header>
        <Grid>
          {selectedCollection?.tickets?.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </Grid>
      </MainContent>
    </Container>
  );
};
