"use client";
import { login, signup } from "./actions";
import { useFormState } from "./formState";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { email, error, setEmail, setError } = useFormState();

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setEmail(result.email);
    } else {
      onSuccess?.();
    }
  };

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setEmail(result.email);
    } else {
      onSuccess?.();
    }
  };

  return (
    <form className="auth-form">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <div className="form-row">
        <input 
          name="email" 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password"
          required 
        />
      </div>
      <div className="button-row">
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const form = e.currentTarget.form!;
            const formData = new FormData(form);
            handleLogin(formData);
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
        >
          Sign up
        </button>
      </div>
      <style jsx>{`
        .auth-form {
          width: 100%;
        }

        .error-message {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 4px;
          color: #dc2626;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          text-align: center;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
        }

        .button-row {
          display: flex;
          gap: 0.5rem;
        }

        button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
        }

        button:first-of-type {
          background-color: #3b82f6;
          color: white;
        }

        button:first-of-type:hover {
          background-color: #2563eb;
        }

        button:last-of-type {
          background-color: #10b981;
          color: white;
        }

        button:last-of-type:hover {
          background-color: #059669;
        }
      `}</style>
    </form>
  );
};

export default AuthForm;
