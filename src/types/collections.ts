import { TLEditorSnapshot } from "tldraw";

export interface Ticket {
  id: string;
  content: string;
  created_at: string;
  creator_id: string;
}

export interface TicketWithPosition extends Ticket {
  position_x: number;
  position_y: number;
  z_index: number;
  position: number;
  drawing: TLEditorSnapshot | null;
}

export interface CollectionProps {
  id: string;
  title: string;
  creator_id: string;
  tickets?: TicketWithPosition[];
}

export interface CollectionViewProps {
  collections: CollectionProps[];
  selectedCollection?: CollectionProps | null;
  tickets?: Ticket[];
  tabsContent?: React.ReactNode;
}
