"use client";
import { login, signup } from "./actions";
import { useFormState } from "./formState";
import { useTheme } from '../styles/theme/ThemeProvider';
import { Form, ErrorMessage, FormGroup, Input, ButtonRow, Button } from "./styles";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { email, error, setEmail, setError } = useFormState();
  const { theme } = useTheme();

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget.form!;
    const formData = new FormData(form);
    handleLogin(formData);
  };

  const handleSignupSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget.form!;
    const formData = new FormData(form);
    handleSignup(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <ErrorMessage
          style={{
            backgroundColor: theme.colors.background.tertiary,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border.primary}`
          }}
        >
          {error}
        </ErrorMessage>
      )}
      <FormGroup>
        <Input 
          name="email" 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            backgroundColor: theme.colors.background.tertiary,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border.primary}`
          }}
          required 
        />
        <Input 
          name="password" 
          type="password" 
          placeholder="Password"
          style={{
            backgroundColor: theme.colors.background.tertiary,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border.primary}`
          }}
          required 
        />
      </FormGroup>
      <ButtonRow>
        <Button 
          type="submit"
          style={{
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border.primary}`
          }}
        >
          Log in
        </Button>
        <Button 
          type="button"
          onClick={handleSignupSubmit}
          style={{
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border.primary}`
          }}
        >
          Sign up
        </Button>
      </ButtonRow>
    </Form>
  );
};

export default AuthForm;
