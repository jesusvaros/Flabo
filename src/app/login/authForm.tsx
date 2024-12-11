"use client";
import { login, signup } from "./actions";
import { useFormState } from "./formState";
import { useTheme } from "../styles/theme/ThemeProvider";
import {
  Form,
  ErrorMessage,
  FormGroup,
  Input,
  ButtonRow,
  Button,
} from "./styles";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { email, error, setEmail, setError } = useFormState();
  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setEmail(result.email);
    } else {
      onSuccess?.();
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setEmail(result.email);
    } else {
      onSuccess?.();
    }
  };

  return (
    <Form onSubmit={handleLogin}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <FormGroup>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
      </FormGroup>
      <ButtonRow>
        <Button type="submit">Log in</Button>
        <Button type="button" onClick={(e) => handleSignup(e as any)}>
          Sign up
        </Button>
      </ButtonRow>
    </Form>
  );
};

export default AuthForm;
