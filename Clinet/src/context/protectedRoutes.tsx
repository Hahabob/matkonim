import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute: checking user:", user?.email);
    if (!user) {
      console.log("ProtectedRoute: user not authenticated, redirecting to /");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return <>{children}</>;
}
