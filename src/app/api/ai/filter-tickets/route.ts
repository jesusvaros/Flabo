import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the system prompt for the AI
const SYSTEM_PROMPT = `You are an AI assistant that helps users find tickets in their collection based on natural language queries.
Your task is to analyze the user's query and determine which tickets from their collection match their request.

You will be given:
1. A user query describing what they're looking for
2. A list of tickets with their content and metadata

You should:
1. Understand the intent of the user's query
2. Analyze each ticket to determine if it matches the query
3. Return the IDs of matching tickets in a JSON object with the key "matching_ids"

IMPORTANT: Your response must be a valid JSON object with the following format:
{
  "matching_ids": ["ticket-id-1", "ticket-id-2", "ticket-id-3"]
}

If no tickets match, return an empty array: { "matching_ids": [] }`;

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

    // Get the query from the request body
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
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
          title,
          ingredients,
          instructions,
          notes
        )
      `)
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    console.log("tickets", tickets);

    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
      return NextResponse.json(
        { error: "Failed to fetch tickets" },
        { status: 500 }
      );
    }

    const userPrompt = `
      I'm looking for tickets that match the following description: ${query}
      
      Here are my tickets:
      ${JSON.stringify(tickets, null, 2)}
      
      Return the IDs of matching tickets in a JSON object with the key "matching_ids".
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        }
      ],
      temperature: 0.3, 
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      return NextResponse.json(
        { error: "No content in response from AI" },
        { status: 500 }
      );
    }

    // Parse the response
    let ticketIds: string[] = [];
    try {
      const parsedResponse = JSON.parse(content);

      console.log("parsedResponse", parsedResponse);
      
      // Check for matching_ids format first (our preferred format)
      if (parsedResponse.matching_ids && Array.isArray(parsedResponse.matching_ids)) {
        ticketIds = parsedResponse.matching_ids;
      } 
      // Fall back to other possible formats
      else if (Array.isArray(parsedResponse)) {
        ticketIds = parsedResponse;
      } 
      else if (parsedResponse.ticketIds && Array.isArray(parsedResponse.ticketIds)) {
        ticketIds = parsedResponse.ticketIds;
      }
      else if (parsedResponse.ids && Array.isArray(parsedResponse.ids)) {
        ticketIds = parsedResponse.ids;
      }
      else {
        // If we can't find a valid format, log the issue and return an empty array
        console.error("Unexpected response format:", parsedResponse);
        ticketIds = [];
      }
      
      // Ensure all returned IDs actually exist in the user's tickets
      const validTicketIds = tickets.map(t => t.id);
      ticketIds = ticketIds.filter((id: string) => validTicketIds.includes(id));
      
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ticketIds });
    
  } catch (error) {
    console.error("Error in filter-tickets API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 