import { createClient } from "../../../utils/supabase/server";
import AuthForm from "../login/authForm";
import { redirect } from "next/navigation";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: { message?: string; email?: string }
}) {
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
      {searchParams.message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          color: '#dc2626',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          {searchParams.message}
        </div>
      )}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <AuthForm 
          session={null} 
          message={null} 
          defaultEmail={searchParams.email}
        />
      </div>
    </div>
  );
}
