import { TLEditorSnapshot } from "tldraw";

export interface Ticket {
  id: string;
  content: string;
  created_at: string;
  creator_id: string;
}

export interface RecipeConversion {
  id: string;
  ticket_id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  notes: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  custom_prompt: string;
}

export interface TicketWithPosition extends Ticket {
  position_x: number;
  position_y: number;
  z_index: number;
  position: number;
  drawing: TLEditorSnapshot | null;
  drawing_generated: TLEditorSnapshot | null;
  recipe_conversions: RecipeConversion[];
}

export interface TicketWithPositionConversion extends TicketWithPosition {
  recipeConversions: RecipeConversion[];
}

export interface CollectionProps {
  id: string;
  title: string;
  creator_id: string;
  tickets?: TicketWithPosition[];
  recipeConversions?: RecipeConversion[];
}

export interface CollectionViewProps {
  collections: CollectionProps[];
  selectedCollection?: CollectionProps | null;
  tickets?: Ticket[];
  tabsContent?: React.ReactNode;
}
