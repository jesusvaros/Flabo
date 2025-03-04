export interface Ticket {
  id: string;
  content: string;
}

export interface CollectionProps {
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
  selectedCollection?: CollectionProps | null;
}
