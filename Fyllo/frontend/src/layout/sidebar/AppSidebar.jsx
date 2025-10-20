import React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"; // Shadcn Sidebar components
import { sidebarLinks } from "@/core/constant/sidebarLinks";
import { MenuIcon } from "lucide-react";

const AppSidebar = ({ role, collapsed, toggleSidebar }) => {
  const links = sidebarLinks.filter((link) => link.roles.includes(role));

  return (
    <div
      className={`flex flex-col h-screen bg-white border-r transition-all duration-300 shadow-md ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2 border-b border-gray-200">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-green-100 transition-colors"
        >
          <MenuIcon className="w-5 h-5 text-green-600" />
        </button>
      </div>

      {/* Sidebar Links */}
      <SidebarContent className="flex-1 overflow-auto mt-2">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {links.map((link) => (
              <SidebarMenuItem key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 mx-2 my-1 rounded-md transition-colors
                    ${
                      isActive
                        ? "bg-green-100 font-semibold text-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <div className="text-gray-600">{link.icon}</div>
                  {!collapsed && <span>{link.name}</span>}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Optional Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 text-gray-500 text-sm">
          © 2025 MyApp
        </div>
      )}
    </div>
  );
};

export default AppSidebar;
