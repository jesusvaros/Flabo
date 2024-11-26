"use client";
import React, { useState } from "react";
import { login, signup, googleLogin, logout } from "./actions";

const AuthForm = ({ session }) => {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e) => {
    const { error } = await login(e);
    if (error) {
      setError(error.message);
    }
  };
  const handleSignup = async (e) => {
    const { error } = await signup(e);
    if (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={handleLogin}>Log in</button>
        <button formAction={handleSignup}>Sign up</button>
        {error && <div> error: {error}</div>}
      </form>
    </>
  );
};

export default AuthForm;
