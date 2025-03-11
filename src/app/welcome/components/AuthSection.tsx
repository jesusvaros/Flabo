'use client';

import AuthForm from '@/app/auth/confirm/login/authForm';
import { Parallax } from 'react-scroll-parallax';

export const AuthSection = () => (
  <section className="auth-section">
    <Parallax translateY={[-10, 10]} className="auth-container">
      <h2>Join Flabo Today</h2>
      <AuthForm />
    </Parallax>
  </section>
);
