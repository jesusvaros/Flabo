
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { collectionId, ticketId, positionX, positionY, zIndex } = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First verify that the user owns both the collection and the ticket
    const { data: collection } = await supabase
      .from("collections")
      .select("*")
      .eq("id", collectionId)
      .eq("creator_id", user.id)
      .single();

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    const { data: ticket } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .eq("creator_id", user.id)
      .single();

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Add the ticket to the collection with its position
    const { error } = await supabase.from("collections_tickets").insert({
      collection_id: collectionId,
      ticket_id: ticketId,
      position_x: positionX,
      position_y: positionY,
      z_index: zIndex,
    });

    if (error) {
      console.error("Error adding ticket to collection:", error);
      return NextResponse.json(
        { error: "Failed to add ticket to collection" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in add-ticket-to-collection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
