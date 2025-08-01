import { LoginForm } from "@/components/ui/Forms/loginForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <LoginForm />

      <Button variant="link" className="text-sm">
        <Link to="/register">Don't have an account? Register here</Link>
      </Button>
    </div>
  );
}
