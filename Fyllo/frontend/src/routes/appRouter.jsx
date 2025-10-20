import React from "react";
import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import Layout from "@/layout/Layout";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Fertilizers from "@/pages/Fertilizers";
import Availability from "@/pages/Availability";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Protected routes
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },

      {
        path: "fertilizers",
        element: (
          <PrivateRoute roles={["admin","user"]}>
            <Fertilizers />
          </PrivateRoute>
        ),
      },

      {
        path: "availability",
        element: (
          <PrivateRoute roles={["admin","user"]}>
            <Availability />
          </PrivateRoute>
        ),
      },

      {
        path: "*",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
