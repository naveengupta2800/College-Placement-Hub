import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  User,
  UserRound,
} from "lucide-react";

import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      role,
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
        role,
      });

      if (response.data.success) {
        setSuccess(
          "Account created successfully. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(
          response.data.message ||
            "Registration failed."
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* ================================
            LEFT BRANDING
        ================================= */}

        <div className="hidden w-[42%] bg-blue-700 lg:flex">
          <div className="flex w-full flex-col justify-between p-12">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700">
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

            {/* Content */}
            <div className="max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                Start Your Journey
              </p>

              <h2 className="mt-4 text-5xl font-bold leading-tight text-white">
                Your next opportunity
                <span className="block text-blue-200">
                  starts here.
                </span>
              </h2>

              <p className="mt-6 text-base leading-7 text-blue-100">
                Create your account and manage your
                placement journey from one centralized
                platform.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <div className="h-2 w-2 rounded-full bg-blue-200" />
                  Discover verified placement drives
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <div className="h-2 w-2 rounded-full bg-blue-200" />
                  Track applications and interview rounds
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <div className="h-2 w-2 rounded-full bg-blue-200" />
                  Receive important placement updates
                </div>
              </div>
            </div>

            <p className="text-xs text-blue-200">
              © 2026 College Placement Cell
            </p>
          </div>
        </div>

        {/* ================================
            REGISTER FORM
        ================================= */}

        <div className="flex flex-1 items-center justify-center px-8 py-10">
          <div className="w-full max-w-lg">

            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
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
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Join the placement management platform.
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

            {/* Success */}
            {success && (
              <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-medium text-emerald-600">
                  {success}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Register as
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "student",
                      }))
                    }
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      border
                      px-4
                      py-3
                      text-left
                      transition
                      ${
                        formData.role === "student"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <UserRound size={19} />

                    <div>
                      <p className="text-sm font-semibold">
                        Student
                      </p>

                      <p className="text-xs opacity-70">
                        Find opportunities
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "recruiter",
                      }))
                    }
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      border
                      px-4
                      py-3
                      text-left
                      transition
                      ${
                        formData.role === "recruiter"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <BriefcaseBusiness size={19} />

                    <div>
                      <p className="text-sm font-semibold">
                        Recruiter
                      </p>

                      <p className="text-xs opacity-70">
                        Hire candidates
                      </p>
                    </div>
                  </button>

                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4">

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
                      className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-11 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-11 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

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
                    placeholder="Minimum 6 characters"
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Login */}
            <div className="mt-7 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;