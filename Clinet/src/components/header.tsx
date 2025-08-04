import { useCurrentUser } from "@/hooks/fetchUserHook";
import { useNavigate, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "./themeProvider";
import { Moon, Sun, Laptop, Home, LogOut } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const themeOptions = [
  { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
  { value: "system", label: "System", icon: <Laptop className="w-4 h-4" /> },
];

export default function Header() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

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
    <header
      className="px-8 py-4 rounded-b-lg shadow-md flex justify-between items-center transition-colors duration-300 select-none
  bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400
  dark:bg-gradient-to-r dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900
  text-gray-900 dark:text-gray-100
"
    >
      <div className="text-2xl font-semibold tracking-wide flex items-center gap-3">
        <Link
          to="/home"
          className="flex items-center gap-2 hover:text-teal-700 dark:hover:text-teal-400 transition"
          aria-label="Go to home page"
        >
          <Home className="w-6 h-6" />
          <span>My Recepies App</span>
        </Link>
      </div>

      <NavBar />

      {isLoading ? (
        <div className="text-gray-700 dark:text-gray-400">Loading...</div>
      ) : user ? (
        <div className="flex items-center gap-5">
          <span
            className="relative text-sm font-semibold text-gray-900 dark:text-gray-200 bg-gradient-to-r from-teal-200 to-cyan-300 dark:from-teal-700 dark:to-cyan-800 px-5 py-2 rounded-full shadow-sm hover:shadow-teal-500 dark:hover:shadow-cyan-700 transition ease-in-out flex items-center gap-2 select-none"
            aria-label={`Welcome ${user?.name ?? "guest"}`}
          >
            <span className="capitalize">
              🌟 Welcome {user?.name ?? "guest"}
            </span>
          </span>

          <Select
            value={theme}
            onValueChange={(value) =>
              setTheme(value as "light" | "dark" | "system")
            }
          >
            <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <SelectValue
                className="text-gray-900 dark:text-gray-100 [&_[data-placeholder]]:text-gray-900 dark:[&_[data-placeholder]]:text-gray-100"
                placeholder="Select theme"
              />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 dark:border-gray-700">
              {themeOptions.map(({ value, label, icon }) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer px-3 py-1 text-gray-900 dark:text-gray-100 select-none"
                >
                  {icon}
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 transition px-4 py-2 rounded-md text-white font-medium shadow-sm select-none"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/"
          className="px-4 py-2 rounded-md bg-white text-gray-900 font-semibold shadow-sm transition duration-200 hover:bg-gray-100 active:scale-95 select-none"
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
