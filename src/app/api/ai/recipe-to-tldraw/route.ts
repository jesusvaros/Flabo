import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { CreateTicketDrawing, TldrawShape } from "@/types/ticket-drawings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const SYSTEM_PROMPT = `You are a recipe visualization assistant. Convert recipes into tldraw JSON format for visual representation.
ALWAYS respond with a JSON object containing a session and document structure like this:

{
  "session": {
    "version": 0,
    "isGridMode": false,
    "pageStates": [
      {
        "camera": {
          "x": 0,
          "y": 0,
          "z": 1
        },
        "pageId": "page:page",
        "focusedGroupId": null,
        "selectedShapeIds": []
      }
    ],
    "isDebugMode": false,
    "isFocusMode": false,
    "isToolLocked": false,
    "currentPageId": "page:page",
    "exportBackground": true
  },
  "document": {
    "store": {
      "page:page": {
        "id": "page:page",
        "meta": {},
        "name": "Page 1",
        "index": "a1",
        "typeName": "page"
      },
      // Define shapes here with properties like id, type, x, y, etc.
    },
    "schema": {
      "sequences": {
        // Define sequence data here
      },
      "schemaVersion": 2
    }
  }
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
      max_tokens: 6000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    console.log('Raw content:', content);

    let tldrawData ;
    try {
      tldrawData = JSON.parse(content);
      // Basic validation of the response structure
      if (!tldrawData || !tldrawData.document || !tldrawData.document.store) {
        console.error('Invalid tldrawData structure:', tldrawData);
        throw new Error('Invalid response format from AI');
      }
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw new Error('Invalid JSON response from AI');
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
