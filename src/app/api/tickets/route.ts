import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET(req: Request) {
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

    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
      return NextResponse.json(
        { error: "Failed to fetch tickets" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tickets });
    
  } catch (error) {
    console.error("Error in tickets API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
