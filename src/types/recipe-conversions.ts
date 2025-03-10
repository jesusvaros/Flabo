export interface RecipeConversion {
  id: string;
  ticket_id: string;
  created_by: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  notes: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateRecipeConversion {
  ticket_id: string;
  created_by: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  notes: string[];
}
