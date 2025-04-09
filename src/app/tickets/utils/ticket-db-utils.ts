import { SupabaseClient } from "@supabase/supabase-js";
import { TicketWithPositionConversion } from "@/types/collections";

export async function updateTicketContent(
  supabase: SupabaseClient,
  ticketId: string,
  content?: string,
  textContent?: string
) {
  const updates: Record<string, any> = {};
  if (content !== undefined) updates.content = content;
  if (textContent !== undefined) updates.text_content = textContent;
  
  if (Object.keys(updates).length === 0) return null;
  
  const result = await supabase
    .from("tickets")
    .update(updates)
    .eq("id", ticketId);
  return result;
}

export async function updateTicketUrl(
  supabase: SupabaseClient,
  ticketId: string,
  urlData: TicketWithPositionConversion["ticket_url"],
  hasExistingUrl: boolean
) {
  // Case 1: Create/update URL
  if (urlData && urlData.url) {
    const data = {
      ticket_id: ticketId,
      url: urlData.url,
      metadata: urlData.metadata || ''
    };
    
    return await supabase
      .from("ticket_urls")
      .upsert(data, { onConflict: 'ticket_id' });
  } 
  // Case 2: Delete URL if it exists and the update is null/empty
  else if (hasExistingUrl) {
    return await supabase
      .from("ticket_urls")
      .delete()
      .eq("ticket_id", ticketId);
  }
  
  return null;
}

export async function updateTicketImages(
  supabase: SupabaseClient,
  ticketId: string,
  images?: TicketWithPositionConversion["ticket_images"]
) {
  // Always delete existing images first
  const { error: deleteError } = await supabase
    .from("ticket_images")
    .delete()
    .eq("ticket_id", ticketId);
  
  if (deleteError) {
    console.error("Error deleting ticket images:", deleteError);
    return { error: deleteError };
  }
  
  // Insert new images if any exist
  if (images && images.length > 0) {
    const imageInserts = images.map(image => ({
      ticket_id: ticketId,
      image_title: image.image_title || '',
      image_description: image.image_description || '',
    }));
    
    return await supabase
      .from("ticket_images")
      .insert(imageInserts);
  }
  
  return null;
}

export async function getTicketState(
  supabase: SupabaseClient,
  ticketId: string
) {
  return await supabase
    .from("tickets")
    .select(`
      id, 
      ticket_urls (id), 
      ticket_images (id)
    `)
    .eq("id", ticketId)
    .single();
}
