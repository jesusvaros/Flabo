import { BackButton } from "@/app/components/navigation/BackButton";
import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TicketPage(props: Props) {
  const params = await props.params;
  const ticketId = params.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get ticket details including the collection it belongs to
  const { error, data: ticket } = await supabase
    .from("tickets")
    .select(
      `
      id,
      content,
      created_at,
      creator_id
    `
    )
    .eq("id", ticketId)
    .eq("creator_id", user.id)
    .single();

  if (ticket === null) {
    redirect("/tickets");
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-semibold mb-4">{ticket.content}</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p>{ticket.content}</p>
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
