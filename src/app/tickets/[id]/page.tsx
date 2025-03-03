import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { Container, Title, Content, Metadata } from "../styles";
import { BackButton } from "../../components/Navigation/BackButton";

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
    <Container>
      <BackButton />
      <Title>{ticket.content}</Title>
      <Content>
        <p>{ticket.content}</p>
      </Content>
      <Metadata>
        <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
      </Metadata>
    </Container>
  );
}
