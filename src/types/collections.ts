export interface Ticket {
  id: string;
  content: string;
  created_at: string;
  creator_id: string;
  position_x: number;
  position_y: number;
  z_index: number;
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
