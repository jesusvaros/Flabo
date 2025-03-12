import { NextResponse } from "next/server";
import { createClient } from "../../../../../../utils/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;
    
    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Get the current user from Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the user owns the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('creator_id, id')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      console.error("Ticket error:", ticketError);
      return NextResponse.json(
        { error: ticketError?.message || "Ticket not found" },
        { status: 404 }
      );
    }

    if (ticket.creator_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to access this ticket's conversions" },
        { status: 403 }
      );
    }

    // Get all conversions for this ticket
    const { data: conversions, error: fetchError } = await supabase
      .from('recipe_conversions')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch conversions" },
        { status: 500 }
      );
    }

    return NextResponse.json(conversions);
  } catch (error) {
    console.error("Error fetching conversions:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversions" },
      { status: 500 }
    );
  }
}
