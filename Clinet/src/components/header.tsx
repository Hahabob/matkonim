import { useCurrentUser } from "@/hooks/fetchUserHook";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", null, { withCredentials: true });
      logout();
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#2A7B9B] to-[#57C785] text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-2xl font-bold tracking-wide flex items-center gap-2">
        <span>My Recepies App</span>
      </div>

      <NavBar />

      {isLoading ? (
        <div>Loading...</div>
      ) : user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
            welcome {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg text-sm font-medium shadow"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold transition-all duration-200 hover:bg-white/20 active:scale-95 shadow-sm"
        >
          Login
        </Link>
      )}
    </header>
  );
}

export function NavBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/home"
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold transition-all duration-200 hover:bg-white/20 active:scale-95 shadow-sm"
            >
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/recepie/create"
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold transition-all duration-200 hover:bg-white/20 active:scale-95 shadow-sm"
            >
              Add a new Recepie here!
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
