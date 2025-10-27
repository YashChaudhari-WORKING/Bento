"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormData,
} from "@/validation/schema/auth/loginSchema";
import { useDispatch, useSelector } from "react-redux";
import { login, authCheck } from "@/redux/features/auth/authThunks";
import { setWorkspacesFromAuth } from "@/redux/features/workspace/workspaceSlice";
import { RootState, AppDispatch } from "@/redux/store";

const LinearLoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0d0e]">
        <div className="text-center">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-[#5e6ad2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-[#9ca3af] text-sm font-medium">
            Signing you in...
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login(data)).unwrap();

      // After login, get full user data
      const authResult = await dispatch(authCheck()).unwrap();

      // Store workspace data in workspace slice
      dispatch(setWorkspacesFromAuth(authResult.memberships));

      // Redirect to first available workspace/team
      if (authResult.memberships?.length > 0) {
        const firstMembership = authResult.memberships[0];
        const workspace = firstMembership.workspace;

        if (firstMembership.teams?.length > 0) {
          const firstTeam = firstMembership.teams[0];
          router.push(`/${workspace.slug}/team/${firstTeam.slug}`);
        } else {
          router.push(`/${workspace.slug}`);
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Linear Logo */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#5e6ad2] rounded-[6px] flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M1 13L13 1M13 1H3M13 1V11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg sm:text-xl tracking-tight">
                Bento
              </span>
            </div>
            <div className="text-[#9ca3af] text-sm">
              Don't have an account?{" "}
              <button className="text-[#5e6ad2] hover:text-[#7c3aed] transition-colors font-medium">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Sign in to Bento
            </h1>
            <p className="text-[#9ca3af] text-sm sm:text-base">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#e5e7eb]"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`
                    w-full px-4 py-3 bg-[#1a1b1e] border rounded-lg text-white placeholder-[#6b7280] 
                    focus:outline-none focus:ring-2 focus:ring-[#5e6ad2] focus:border-transparent
                    transition-all duration-200 text-sm sm:text-base
                    ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-[#374151] hover:border-[#4b5563]"
                    }
                  `}
                  placeholder="Enter your email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm font-medium flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#e5e7eb]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`
                    w-full px-4 py-3 pr-12 bg-[#1a1b1e] border rounded-lg text-white placeholder-[#6b7280]
                    focus:outline-none focus:ring-2 focus:ring-[#5e6ad2] focus:border-transparent
                    transition-all duration-200 text-sm sm:text-base
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-[#374151] hover:border-[#4b5563]"
                    }
                  `}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6b7280] hover:text-[#9ca3af] transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm font-medium flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-[#5e6ad2] hover:bg-[#4c59c7] disabled:bg-[#374151] 
                text-white font-medium py-3 px-4 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#5e6ad2] focus:ring-offset-2 focus:ring-offset-[#0c0d0e]
                transition-all duration-200 text-sm sm:text-base
                disabled:cursor-not-allowed disabled:opacity-50
                flex items-center justify-center space-x-2
              "
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-[#6b7280]">
              <button className="hover:text-[#9ca3af] transition-colors">
                Privacy
              </button>
              <button className="hover:text-[#9ca3af] transition-colors">
                Terms
              </button>
              <button className="hover:text-[#9ca3af] transition-colors">
                Help
              </button>
            </div>
            <div className="text-sm text-[#6b7280]">
              © 2024 Bento. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LinearLoginForm;
