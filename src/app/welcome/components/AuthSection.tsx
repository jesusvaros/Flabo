'use client';

import { Parallax } from 'react-scroll-parallax';
import AuthForm from "../../login/authForm";

export const AuthSection = () => (
  <section className="auth-section">
    <Parallax translateY={[-10, 10]} className="auth-container">
      <h2>Join Flabo Today</h2>
      <AuthForm />
    </Parallax>
  </section>
);
