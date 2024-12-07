"use client";
import { login, signup, googleLogin, logout } from "./actions";

const AuthForm = ({ session, message, defaultEmail = '' }) => {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input 
        id="email" 
        name="email" 
        type="email" 
        defaultValue={defaultEmail}
        required 
        style={{
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <label htmlFor="password">Password:</label>
      <input 
        id="password" 
        name="password" 
        type="password" 
        required 
        style={{
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          formAction={login}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Log in
        </button>
        <button 
          formAction={signup}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Sign up
        </button>
      </div>
      {message && <div> error: {message}</div>}
    </form>
  );
};

export default AuthForm;
