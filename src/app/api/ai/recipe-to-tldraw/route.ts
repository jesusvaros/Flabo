import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { CreateTicketDrawing, TldrawShape } from "@/types/ticket-drawings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the tldraw shape format
const TLDRAW_SHAPE_FORMAT: TldrawShape = {
  id: "string - Unique identifier for the shape",
  type: "string - Type of shape (text, rectangle, arrow, etc.)",
  x: 0,
  y: 0,
  rotation: 0,
  props: {
    text: "string - Text content if applicable",
    color: "string - Color of the shape",
    size: "string - Size of the shape",
    font: "string - Font for text",
    align: "string - Text alignment",
    // Add other shape-specific properties
  }
};

const SYSTEM_PROMPT = `You are a recipe visualization assistant. Convert recipes into tldraw JSON format for visual representation.
ALWAYS respond with a JSON object containing an array of shapes in this format:
{
  "shapes": [${JSON.stringify(TLDRAW_SHAPE_FORMAT, null, 2)}]
}

Rules for creating the visualization:
1. Create a clear visual hierarchy with title at the top
2. Group ingredients on the left side
3. Show instructions as a flow diagram with arrows connecting steps
4. Use different colors to distinguish between ingredients, steps, and notes
5. Include cooking times and temperatures in relevant steps
6. Keep text concise but informative
7. Use appropriate spacing between elements (x and y coordinates)
8. Ensure shapes don't overlap
9. Create a logical flow from top to bottom
10. Use consistent styling (fonts, colors, sizes)

Shape Types and Usage:
- text: For titles, ingredients, and instruction text
- rectangle: For grouping related items
- arrow: For showing flow between steps
- ellipse: For highlighting important notes
- diamond: For decision points (if any)

Color Guidelines:
- Title: Blue (#1a91ff)
- Ingredients: Green (#00a651)
- Instructions: Black (#1d1d1d)
- Notes: Orange (#ff9500)
- Arrows: Gray (#808080)

All coordinates should be positive numbers, starting from (100, 100)`;

export async function POST(req: Request) {
  try {
    // Get the current user from Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { recipe, ticketId } = await req.json();

    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    // Verify the user owns the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('creator_id')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    if (ticket.creator_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to visualize this recipe" },
        { status: 403 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Convert this recipe into a tldraw visualization:
${JSON.stringify(recipe, null, 2)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    // Parse and validate the JSON response
    const tldrawData = JSON.parse(content);

    // Basic validation of the response structure
    if (!Array.isArray(tldrawData.shapes)) {
      throw new Error("Invalid response format from AI");
    }

    // Store the tldraw data in the database
    const drawingData: CreateTicketDrawing = {
      ticket_id: ticketId,
      created_by: user.id,
      data: tldrawData,
    };

    const { error } = await supabase
      .from('ticket_drawings_generated')
      .insert(drawingData);

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error("Failed to save recipe visualization");
    }

    return NextResponse.json({
      shapes: tldrawData.shapes
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create recipe visualization" },
      { status: 500 }
    );
  }
}
