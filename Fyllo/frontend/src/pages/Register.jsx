import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "@/features/auth/authSlice.js";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-900 p-10 rounded-2xl shadow-lg w-96 flex flex-col space-y-6 border border-green-700/40"
      >
        <h2 className="text-3xl font-bold text-green-400 text-center">
          Create Account
        </h2>

        {/* Name */}
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          }}
          render={({ field }) => (
            <div className="flex flex-col space-y-2">
              <Label className="text-green-400">Name</Label>
              <Input
                {...field}
                className="bg-neutral-800 border-green-700/40 text-white focus-visible:ring-green-500"
                placeholder="Enter your name"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name.message}</span>
              )}
            </div>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
          }}
          render={({ field }) => (
            <div className="flex flex-col space-y-2">
              <Label className="text-green-400">Email</Label>
              <Input
                {...field}
                type="email"
                className="bg-neutral-800 border-green-700/40 text-white focus-visible:ring-green-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          }}
          render={({ field }) => (
            <div className="flex flex-col space-y-2 relative">
              <Label className="text-green-400">Password</Label>
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                className="bg-neutral-800 border-green-700/40 text-white focus-visible:ring-green-500 pr-10"
                placeholder="Enter your password"
              />
              <span
                className="absolute right-3 top-[42px] cursor-pointer text-green-500 hover:text-green-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>
          )}
        />

        {/* Role */}
        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <div className="flex flex-col space-y-2">
              <Label className="text-green-400">Role</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-neutral-800 border-green-700/40 text-white focus-visible:ring-green-500">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border border-green-700/40 text-green-400">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <span className="text-red-500 text-sm">{errors.role.message}</span>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-400 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
