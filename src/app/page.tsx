import { createClient } from "../../utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: tickets } = await supabase.from("tickets").select("*");

  return (
    <div>
      <h1>Welcome to Flabo</h1>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <h2>Your Tickets:</h2>
          <pre>{JSON.stringify(tickets, null, 2)}</pre>
        </div>
      ) : (
        <p>Not logged in. Please <a href="/login">login</a> to continue.</p>
      )}
    </div>
  );
}
