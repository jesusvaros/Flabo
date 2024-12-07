import { createClient } from "../../utils/supabase/server";
import { logout } from "./login/actions";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: tickets } = await supabase.from("tickets").select("*");

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>Welcome to Flabo</h1>
        {user && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>{user.email}</span>
            <form action={logout}>
              <button 
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
      {user ? (
        <div style={{ padding: '1rem' }}>
          <h2>Your Tickets:</h2>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '4px',
            marginTop: '1rem' 
          }}>
            {JSON.stringify(tickets, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Not logged in. Please <a href="/login">login</a> to continue.</p>
      )}
    </div>
  );
}
