import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const Layout = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen w-full flex flex-col bg-neutral-950 text-white">
      {/* ✅ Top Navigation Bar */}
      <Navbar user={user} />

      {/* ✅ Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
