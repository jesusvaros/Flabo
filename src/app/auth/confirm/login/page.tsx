"use server";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../utils/supabase/server";

export default async function LoginPage() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user is logged in, redirect to home
    if (user) {
      redirect("/");
    } else {
      redirect("/welcome");
    }
  } catch (error) {
    // If there's an error (like missing env vars during build), redirect to welcome
    console.error("Error in login page:", error);
    redirect("/welcome");
  }
}
