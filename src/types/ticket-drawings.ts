export interface TldrawShape {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  props: {
    text?: string;
    color?: string;
    size?: string;
    font?: string;
    align?: string;
    [key: string]: any;
  };
}

export interface TicketDrawing {
  id: string;
  ticket_id: string;
  created_by: string;
  created_at: string;
  data: {
    shapes: TldrawShape[];
  };
  type: 'recipe_visualization';
}

export interface CreateTicketDrawing {
  ticket_id: string;
  created_by: string;
  data: {
    shapes: TldrawShape[];
  };
  type: 'recipe_visualization';
}
