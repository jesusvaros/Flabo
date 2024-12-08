import { createClient } from "../../../utils/supabase/server";
import AuthForm from "../login/authForm";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect to home
  if (user) {
    redirect("/");
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ marginBottom: '2rem' }}>Welcome to Flabo</h1>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <AuthForm />
      </div>
    </div>
  );
}
