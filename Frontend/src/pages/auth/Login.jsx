import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =====================================
  // ROLE BASED REDIRECT
  // =====================================

  const redirectUser = (role) => {
    if (role === "student") {
      navigate("/student/dashboard");
    } else if (role === "recruiter") {
      navigate("/recruiter/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  // =====================================
  // LOGIN
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login(
        formData.email,
        formData.password
      );

      if (response.success) {
        redirectUser(response.user.role);
      } else {
        setError(
          response.message || "Login failed."
        );
      }
    } catch (error) {
      setError(
        error.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* =================================
            LEFT BRANDING SECTION
        ================================= */}

        <div className="relative hidden w-[48%] overflow-hidden bg-blue-700 lg:flex">
          
          {/* Background decoration */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/40" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-800/50" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700 shadow-lg">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h1 className="text-lg font-bold text-white">
                  PlacementHub
                </h1>

                <p className="text-xs text-blue-100">
                  College Placement Management
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
                Campus Placement Platform
              </p>

              <h2 className="text-5xl font-bold leading-tight text-white">
                Build your career
                <span className="block text-blue-200">
                  with the right opportunity.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
                Discover placement opportunities,
                manage applications and stay updated
                throughout your placement journey.
              </p>

              {/* Feature Cards */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">
                    100+
                  </p>

                  <p className="mt-1 text-xs text-blue-100">
                    Opportunities
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">
                    50+
                  </p>

                  <p className="mt-1 text-xs text-blue-100">
                    Companies
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">
                    24/7
                  </p>

                  <p className="mt-1 text-xs text-blue-100">
                    Updates
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-blue-200">
              © 2026 College Placement Cell
            </p>
          </div>
        </div>

        {/* =================================
            RIGHT LOGIN SECTION
        ================================= */}

        <div className="flex flex-1 items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h1 className="font-bold text-gray-900">
                  PlacementHub
                </h1>

                <p className="text-xs text-gray-500">
                  College Placement
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to continue to your placement
                dashboard.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="
                      h-12
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      pl-11
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="
                      h-12
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      pl-11
                      pr-12
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  duration-200
                  hover:bg-blue-700
                  hover:shadow-md
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-100
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Demo Admin */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-700">
                Development Admin
              </p>

              <p className="mt-1 text-xs text-gray-500">
                admin@collegeplacement.com
              </p>

              <p className="text-xs text-gray-500">
                Password: Admin@123
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;