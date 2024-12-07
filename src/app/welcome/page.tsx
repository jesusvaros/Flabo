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
    <div>
      <h1>Welcome to Flabo</h1>
      <div>
        <AuthForm session={null} message={null} />
      </div>
    </div>
  );
}
