"use client";
import { login, signup } from "./actions";
import { useFormState } from "./formState";

const AuthForm = () => {
  const { email, error, setEmail, setError } = useFormState();

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setEmail(result.email);
    }
  };

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setEmail(result.email);
    }
  };

  return (
    <form>
      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          color: '#dc2626',
          width: '100%',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      <label htmlFor="email">Email:</label>
      <input 
        id="email" 
        name="email" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const form = e.currentTarget.form!;
            const formData = new FormData(form);
            handleLogin(formData);
          }}
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
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const form = e.currentTarget.form!;
            const formData = new FormData(form);
            handleSignup(formData);
          }}
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
    </form>
  );
};

export default AuthForm;
