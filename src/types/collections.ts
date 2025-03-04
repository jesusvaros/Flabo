export interface Ticket {
  id: string;
  content: string;
}

export interface Collection {
  id: string;
  title: string;
  creator_id: string;
  tickets?: Ticket[];
}

export interface CollectionViewProps {
  collections: {
    id: string;
    name: string;
  }[];
  selectedCollection?: Collection | null;
}
