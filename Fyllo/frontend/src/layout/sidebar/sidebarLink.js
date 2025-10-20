import { LayoutDashboardIcon, PlusIcon } from "lucide-react";

export const sidebarLinks = {
  common: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon },
    { name: "Manage Fertilizers", path: "/fertilizers", icon: PlusIcon },
    { name: "Manage Availability", path: "/availability", icon: PlusIcon },
  ],
  admin: [
    { name: "Manage Fertilizers", path: "/fertilizers", icon: PlusIcon },
    { name: "Manage Availability", path: "/availability", icon: PlusIcon },
  ],
};
