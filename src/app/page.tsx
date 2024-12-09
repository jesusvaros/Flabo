import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { logout } from "./login/actions";
import { LogoutButton } from "./components/LogoutButton/LogoutButton";


export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  const { data: tickets } = await supabase.from("tickets").select("*,auth.user(email)");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <h1>Welcome to Flabo</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>{user.email}</span>
          <LogoutButton />
        </div>
      </div>

      <div style={{ padding: "1rem" }}>
        <h2>Your Tickets:</h2>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
            marginTop: "1rem",
            color:'black'
          }}
        >
          {JSON.stringify(tickets, null, 2)}
        </pre>
      </div>
    </div>
  );
}
