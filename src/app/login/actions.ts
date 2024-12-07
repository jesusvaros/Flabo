"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Input validation
  if (!email) return redirect("/welcome?message=Email is required");
  if (!password) return redirect("/welcome?message=Password is required");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    switch (error.message) {
      case "Invalid login credentials":
        return redirect("/welcome?message=Invalid email or password");
      case "Email not confirmed":
        return redirect("/welcome?message=Please verify your email first");
      case "Invalid email or password":
        return redirect("/welcome?message=Invalid email or password");
      default:
        console.error("Login error:", error);
        return redirect(`/welcome?message=${encodeURIComponent(error.message)}`);
    }
  }

  return revalidatePath("/", "layout"), redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Input validation
  if (!email) return redirect("/welcome?message=Email is required");
  if (!password) return redirect("/welcome?message=Password is required");
  if (password.length < 6) return redirect("/welcome?message=Password must be at least 6 characters");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: null,
      data: {
        email_confirm: false
      }
    }
  });

  if (error) {
    switch (error.message) {
      case "User already registered":
        return redirect("/welcome?message=This email is already registered");
      case "Password should be at least 6 characters":
        return redirect("/welcome?message=Password must be at least 6 characters");
      case "Invalid email":
        return redirect("/welcome?message=Please enter a valid email address");
      default:
        console.error("Signup error:", error);
        return redirect(`/welcome?message=${encodeURIComponent(error.message)}`);
    }
  }

  // Sign in immediately after signup
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (signInError) {
    console.error("Auto-login error:", signInError);
    return redirect("/welcome?message=Account created but could not sign in automatically");
  }

  return revalidatePath("/", "layout"), redirect("/");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/welcome");
}

export async function googleLogin() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    switch (error.message) {
      case "Access denied":
        return redirect("/welcome?message=Access denied");
      case "Invalid grant":
        return redirect("/welcome?message=Invalid grant");
      default:
        console.error("Google login error:", error);
        return redirect(`/welcome?message=${encodeURIComponent(error.message)}`);
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
