"use client";
import React from "react";
import { login, signup, googleLogin, logout } from "./actions";

const AuthForm = ({ session, message }) => {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
      {message && <div> error: {message}</div>}
    </form>
  );
};

export default AuthForm;
