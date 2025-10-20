import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes/appRouter";
import { fetchCurrentUser } from "@/features/auth/authSlice";
import ToastProvider from "./layout/ToastProvider";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>; 

  return (
    <>
          <ToastProvider />

      <RouterProvider router={router} />
    </>
  );
};

export default App;
