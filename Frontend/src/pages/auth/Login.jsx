
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

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
  // EMAIL PASSWORD LOGIN
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
        setError(response.message || "Login failed.");
      }
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GOOGLE LOGIN
  // =====================================

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");

      if (!credentialResponse.credential) {
        throw new Error("Google credential not received.");
      }

      setLoading(true);

      const response = await googleLogin(
        credentialResponse.credential
      );

      if (response.success && response.user) {
        redirectUser(response.user.role);
      } else {
        setError(response.message || "Google login failed.");
      }
    } catch (error) {
      setError(
        error.message || "Google authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* =================================
            LEFT BRANDING SECTION
        ================================= */}

        <div className="relative hidden w-[48%] overflow-hidden bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-800 lg:flex">

          {/* Background Decoration */}

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-sm" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-900/30" />

          <div className="absolute right-20 top-1/2 h-40 w-40 rounded-full border border-white/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-700 shadow-lg">
                <BriefcaseBusiness size={23} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  PlacementHub
                </h1>

                <p className="text-xs text-blue-100">
                  College Placement Management
                </p>
              </div>

            </div>

            {/* Main Content */}

            <div className="max-w-lg">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">

                <span className="h-2 w-2 rounded-full bg-green-400" />

                <span className="text-xs font-medium text-blue-50">
                  Campus Placement Platform
                </span>

              </div>

              <h2 className="text-5xl font-bold leading-tight tracking-tight text-white">
                Build your career

                <span className="mt-1 block text-blue-200">
                  with the right opportunity.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-8 text-blue-100">
                Discover placement opportunities,
                manage applications and stay updated
                throughout your placement journey.
              </p>

              {/* Feature Cards */}

              <div className="mt-10 grid grid-cols-3 gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-2xl font-bold text-white">
                    100+
                  </p>

                  <p className="mt-2 text-xs text-blue-100">
                    Opportunities
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-2xl font-bold text-white">
                    50+
                  </p>

                  <p className="mt-2 text-xs text-blue-100">
                    Companies
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-2xl font-bold text-white">
                    24/7
                  </p>

                  <p className="mt-2 text-xs text-blue-100">
                    Updates
                  </p>
                </div>

              </div>

            </div>

            {/* Footer */}

            <p className="text-xs text-blue-200">
              © 2026 College Placement Cell. All rights reserved.
            </p>

          </div>
        </div>

        {/* =================================
            RIGHT LOGIN SECTION
        ================================= */}

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <h1 className="font-bold text-gray-900">
                  PlacementHub
                </h1>

                <p className="text-xs text-gray-500">
                  College Placement Management
                </p>
              </div>

            </div>

            {/* Heading */}

            <div className="mb-8">

              <p className="mb-3 text-sm font-semibold text-blue-600">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your credentials to access your placement dashboard.
              </p>

            </div>

            {/* Error Message */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500" />

                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>

              </div>
            )}

            {/* EMAIL PASSWORD FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <div className="group relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-blue-600"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-600 transition hover:text-blue-800"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="group relative">

                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-blue-600"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* Remember Me */}

              <div className="flex items-center gap-2">

                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <label
                  htmlFor="remember"
                  className="cursor-pointer text-sm text-gray-600"
                >
                  Remember me
                </label>

              </div>

              {/* Submit Button */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
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

            {/* =================================
                GOOGLE LOGIN SECTION
            ================================= */}

            <div className="mt-7">

              {/* OR DIVIDER */}

              <div className="mb-6 flex items-center gap-4">

                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Or continue with
                </span>

                <div className="h-px flex-1 bg-gray-200" />

              </div>

              {/* GOOGLE BUTTON CARD */}

              <div className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md">

                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex w-full justify-center">

                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="continue_with"
                    width="350"
                    logo_alignment="center"
                  />

                </div>

              </div>

              {/* Security Text */}

              <div className="mt-4 flex items-center justify-center gap-2">

                <ShieldCheck
                  size={15}
                  className="text-green-500"
                />

                <p className="text-xs text-gray-400">
                  Securely access your PlacementHub account
                </p>

              </div>

            </div>

            {/* REGISTER LINK */}

            <div className="mt-8 text-center">

              <p className="text-sm text-gray-500">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-semibold text-blue-600 transition hover:text-blue-800"
                >
                  Create an account
                </Link>

              </p>

            </div>

            {/* DEMO ADMIN */}

            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">

              <p className="text-xs font-bold text-gray-700">
                Development Admin
              </p>

              <p className="mt-2 text-xs text-gray-500">
                admin@collegeplacement.com
              </p>

              <p className="mt-1 text-xs text-gray-500">
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
