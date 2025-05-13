import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { makeChatCompletion, SystemPrompts } from "../../../../../utils/transformers/openaiClient";

interface FilterTicketsResponse {
  matching_ids: string[];
}

export async function POST(req: Request) {
  try {
    // Get the current user from Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { query } = await req.json();

    if (!query || !user?.id) {
      return NextResponse.json(
        { error: "Query is required or user is not authenticated" },
        { status: 400 }
      );
    }

    // Fetch a limited set of tickets (most recent 100) to avoid sending too much data
    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select(`
        id,
        content,
        created_at,
        recipe_conversions (
          id,
          recipe_data
        ),
        ticket_images (
          image_url,
          caption
        )
      `)
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
      return NextResponse.json(
        { error: "Failed to fetch tickets" },
        { status: 500 }
      );
    }

    if (!tickets || tickets.length === 0) {
      return NextResponse.json({ matching_ids: [] });
    }

    // Prepare a simplified representation of the tickets for the AI
    const ticketsForAI = tickets.map(ticket => {
      // Extract images and captions
      const images = ticket.ticket_images || [];
      const imageCaptions = images.map(img => img.caption).filter(Boolean);
      
      // Extract recipe data if available
      const recipeData = ticket.recipe_conversions && ticket.recipe_conversions.length > 0
        ? ticket.recipe_conversions[0].recipe_data
        : null;
      
      return {
        id: ticket.id,
        content: ticket.content,
        recipe: recipeData,
        image_captions: imageCaptions,
        created_at: ticket.created_at
      };
    });

    // Create a prompt for the AI
    const userMessage = `User query: "${query}"
    
Tickets to search (${ticketsForAI.length}):
${JSON.stringify(ticketsForAI, null, 2)}

Return only the IDs of tickets that match the query.`;

    // Call OpenAI API with the unified client
    const response = await makeChatCompletion<FilterTicketsResponse>({
      systemPrompt: SystemPrompts.FILTER_TICKETS,
      userMessage,
      temperature: 0.3,
      responseFormat: { type: 'json_object' }
    });

    // Return the matching IDs
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error filtering tickets:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}