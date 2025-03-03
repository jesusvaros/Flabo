"use client";
import { login, signup } from "./actions";
import { useFormState } from "./formState";
import { useTheme } from "../styles/theme/ThemeProvider";
import { Form, ErrorMessage, FormGroup, Input, ButtonRow } from "./styles";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { email, error, setEmail, setError } = useFormState();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await (isLogin ? login(formData) : signup(formData));
    if (result?.error) {
      setError(result.error);
      setEmail(result.email);
    } else {
      onSuccess?.();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
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
        <Button type="submit">{isLogin ? "Log in" : "Sign up"}</Button>
        <Button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign up" : "Have an account? Log in"}
        </Button>
      </ButtonRow>
    </Form>
  );
};

export default AuthForm;
