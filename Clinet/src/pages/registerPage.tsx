import { RegisterForm } from "@/components/ui/Forms/registerForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <RegisterForm />

      <Button variant="link" className="text-sm">
        <Link to="/">Already have an account? Log in</Link>
      </Button>
    </div>
  );
}
