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
import {
  Moon,
  Sun,
  Laptop,
  Home,
  LogOut,
  Menu,
  X,
  User,
  Pencil,
} from "lucide-react";
import { useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className="
        px-4 py-3 rounded-b-lg shadow-md
        bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400
        dark:bg-gradient-to-r dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900
        text-gray-900 dark:text-gray-100
        transition-colors duration-300 select-none
        z-50 relative
      "
    >
      <div className="hidden sm:flex w-full max-w-7xl mx-auto items-center justify-between gap-4">
        <div className="text-2xl font-semibold tracking-wide flex items-center gap-3">
          <Link
            to="/home"
            className="flex items-center gap-2 hover:text-teal-700 dark:hover:text-teal-400 transition"
            aria-label="Go to home page"
          >
            <Home className="w-6 h-6" />
            <span>My Recipes App</span>
          </Link>
        </div>

        <NavBar />

        {isLoading ? (
          <div className="text-gray-700 dark:text-gray-400 text-center">
            Loading...
          </div>
        ) : user ? (
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-semibold text-gray-900 dark:text-gray-200 bg-gradient-to-r from-teal-200 to-cyan-300 dark:from-teal-700 dark:to-cyan-800 px-4 py-2 rounded-full shadow-sm hover:shadow-teal-500 dark:hover:shadow-cyan-700 transition ease-in-out flex items-center gap-2 select-none whitespace-nowrap"
              aria-label={`Welcome ${user?.name ?? "guest"}`}
            >
              <span className="flex items-center gap-2 capitalize">
                <User className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                Welcome {user?.name ?? "guest"}
              </span>
            </span>

            <Select
              value={theme}
              onValueChange={(value) =>
                setTheme(value as "light" | "dark" | "system")
              }
            >
              <SelectTrigger className="w-[120px] bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <SelectValue
                  className="text-gray-900 dark:text-gray-100"
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
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 transition px-4 py-2 rounded-md text-white font-medium shadow-sm select-none whitespace-nowrap"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-white text-gray-900 font-semibold shadow-sm transition duration-200 hover:bg-gray-100 active:scale-95 select-none whitespace-nowrap"
          >
            Login
          </Link>
        )}
      </div>

      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <Link
            to="/home"
            className="flex items-center gap-2 text-xl font-semibold hover:text-teal-700 dark:hover:text-teal-400 transition"
            aria-label="Go to home page"
          >
            <Home className="w-5 h-5" />
            <span>My Recipes App</span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-700 dark:text-gray-400 py-2">
            Loading...
          </div>
        ) : user ? (
          <div className="flex items-center justify-center mb-3">
            <span className="flex items-center gap-2 capitalize">
              <User className="w-4 h-4 text-gray-800 dark:text-gray-200" />
              Welcome {user?.name ?? "guest"}
            </span>
          </div>
        ) : null}

        {isMobileMenuOpen && (
          <div className="border-t border-white/20 pt-3 space-y-3">
            <div className="flex flex-col gap-2">
              <Link
                to="/home"
                className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold transition-all duration-200 hover:bg-white/20 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/recepie/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-semibold transition hover:bg-white/20"
              >
                <Pencil className="w-4 h-4" />
                <span>Add a new Recipe</span>
              </Link>
            </div>

            {user && (
              <div className="flex flex-col gap-3 pt-2 border-t border-white/20">
                <div className="flex items-center justify-center">
                  <Select
                    value={theme}
                    onValueChange={(value) =>
                      setTheme(value as "light" | "dark" | "system")
                    }
                  >
                    <SelectTrigger className="w-full max-w-[200px] bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm">
                      <SelectValue
                        className="text-gray-900 dark:text-gray-100"
                        placeholder="Select theme"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 dark:border-gray-700">
                      {themeOptions.map(({ value, label, icon }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer px-3 py-1 text-gray-900 dark:text-gray-100"
                        >
                          {icon}
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 transition px-6 py-2 rounded-md text-white font-medium shadow-sm"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <div className="flex justify-center pt-2 border-t border-white/20">
                <Link
                  to="/"
                  className="px-6 py-2 rounded-md bg-white text-gray-900 font-semibold shadow-sm transition duration-200 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
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
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold transition-all duration-200 hover:bg-white/20 active:scale-95 shadow-sm whitespace-nowrap"
            >
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/recepie/create"
              className="flex flex-row items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-semibold transition-all duration-200 hover:bg-white/20 active:scale-95 shadow-sm whitespace-nowrap"
            >
              <Pencil className="w-4 h-4" />
              Add a new Recipe here!
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
