import { LoginForm } from "@/components/ui/Forms/loginForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <LoginForm />

      <Button variant="link" className="text-sm">
        <Link to="/register">Don't have an account? Register here</Link>
      </Button>
    </div>
  );
}
