import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

interface User {
  name: string;
  email: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-[#2A7B9B] to-[#57C785] text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-2xl font-bold tracking-wide flex items-center gap-2">
        <span>My Recepies App</span>
      </div>

      <NavBar />

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
            {user.name || user.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg text-sm font-medium shadow"
          >
            Logout
          </button>
        </div>
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
              to="/books"
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
