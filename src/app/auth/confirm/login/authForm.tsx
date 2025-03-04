"use client";
import { login, signup } from "./actions";
import { useFormState } from "./formState";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { email, error, setEmail, setError } = useFormState();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full">
          {isLogin ? "Log in" : "Sign up"}
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full"
        >
          {isLogin ? "Need an account? Sign up" : "Have an account? Log in"}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
