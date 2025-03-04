export interface Ticket {
  id: string;
  content: string;
  created_at?: string;
}

export interface CollectionProps {
  id: string;
  title: string;
  creator_id: string;
  tickets?: Ticket[];
}

export interface CollectionViewProps {
  collections: CollectionProps[];
  selectedCollection?: CollectionProps | null;
}
