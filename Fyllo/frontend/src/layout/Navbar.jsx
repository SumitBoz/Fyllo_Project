import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOutIcon } from "lucide-react";
import { logoutUser } from "../features/auth/authSlice";
import { sidebarLinks } from "@/core/constant/sidebarLinks";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="h-16 bg-black text-white flex items-center justify-between px-8 shadow-lg">
      {/* ✅ Left: App Name or Welcome */}
      <div className="text-xl font-semibold">
        Welcome, {user?.name || "Guest"}
      </div>

      {/* ✅ Center: Navigation Links */}
      <nav className="flex space-x-8">
        {sidebarLinks
          .filter((link) => link.roles.includes(user?.role || "user"))
          .map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-green-400 border-b-2 border-green-400"
                    : "hover:text-green-300"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
      </nav>

      {/* ✅ Right: Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
      >
        <LogOutIcon className="w-5 h-5" />
        <span className="ml-2">Logout</span>
      </button>
    </header>
  );
};

export default Navbar;
