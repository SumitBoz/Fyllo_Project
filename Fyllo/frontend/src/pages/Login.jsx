import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { loginUser } from "@/features/auth/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      window.alert("Login successful!"); // will auto disappear
      navigate("/dashboard");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-black relative">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-10 rounded-2xl shadow-lg w-96 flex flex-col space-y-6 border border-green-700/40"
      >
        <h2 className="text-3xl font-bold text-green-400 text-center">
          Welcome Back
        </h2>

        {/* Email Field */}
        <div className="flex flex-col space-y-2">
          <Label className="text-green-400">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-neutral-800 border-green-700/40 text-white focus-visible:ring-green-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col space-y-2 relative">
          <Label className="text-green-400">Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-neutral-800 border-green-700/40 text-white focus-visible:ring-green-500 pr-10"
            placeholder="Enter your password"
          />
          <span
            className="absolute right-3 top-[42px] cursor-pointer text-green-500 hover:text-green-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300"
        >
          Login
        </Button>

        <p className="text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
