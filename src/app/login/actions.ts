"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Input validation
  if (!email) return { error: "Email is required", email };
  if (!password) return { error: "Password is required", email };

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    switch (error.message) {
      case "Invalid login credentials":
        return { error: "Invalid email or password", email };
      case "Email not confirmed":
        return { error: "Please verify your email first", email };
      case "Invalid email or password":
        return { error: "Invalid email or password", email };
      default:
        console.error("Login error:", error);
        return { error: error.message, email };
    }
  }

  return revalidatePath("/", "layout"), redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Input validation
  if (!email) return { error: "Email is required", email };
  if (!password) return { error: "Password is required", email };
  if (password.length < 6) return { error: "Password must be at least 6 characters", email };

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
        return { error: "This email is already registered", email };
      case "Password should be at least 6 characters":
        return { error: "Password must be at least 6 characters", email };
      case "Invalid email":
        return { error: "Please enter a valid email address", email };
      default:
        console.error("Signup error:", error);
        return { error: error.message, email };
    }
  }

  // Sign in immediately after signup
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (signInError) {
    console.error("Auto-login error:", signInError);
    return { error: "Account created but could not sign in automatically", email };
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
        return { error: "Access denied" };
      case "Invalid grant":
        return { error: "Invalid grant" };
      default:
        console.error("Google login error:", error);
        return { error: error.message };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
