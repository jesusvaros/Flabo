export interface RecipeConversion {
  id: string;
  ticket_id: string;
  created_by: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  notes: string[];
  custom_prompt?: string;
  created_at: string;
  updated_at: string;
  content?: string;
  type?: 'text' | 'link' | 'image' | 'drawing';
  processed_content?: {
    title: string;
    ingredients: { text: string }[];
    instructions: { text: string }[];
    notes: string;
  };
}

export interface CreateRecipeConversion {
  ticket_id: string;
  created_by: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  notes: string[];
  custom_prompt?: string;
}
