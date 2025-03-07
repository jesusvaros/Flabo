"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../utils/supabase/server";

export async function login(formData: FormData) {
  try {
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
      return { error: error.message, email };
    }

    return revalidatePath("/", "layout"), redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred during login. Please try again later.", email: formData.get("email") as string };
  }
}

export async function signup(formData: FormData) {
  try {
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
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
        data: {
          email_confirm: false
        }
      }
    });

    if (error) {
      return { error: error.message, email };
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
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "An error occurred during signup. Please try again later.", email: formData.get("email") as string };
  }
}

export async function logout() {
  try {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    redirect("/welcome");
  } catch (error) {
    console.error("Logout error:", error);
    redirect("/welcome");
  }
}

export async function googleLogin() {
  try {
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
  } catch (error) {
    console.error("Google login error:", error);
    return { error: "An error occurred during Google login. Please try again later." };
  }
}
