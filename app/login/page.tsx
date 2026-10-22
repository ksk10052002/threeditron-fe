"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();               // login now needs email & password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    // ✅ Pass both arguments to the updated login function
    login(email, password);
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-black/80">
      <div className="bg-zinc-900/90 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
          Sign In
        </h1>
        {error && (
          <p className="mb-4 text-center text-red-400 text-sm">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs text-gray-400 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-yellow-500/30 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-yellow-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-gray-400 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-yellow-500/30 rounded-xl py-2 px-4 pr-10 text-white focus:outline-none focus:border-yellow-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded-xl font-bold hover:bg-yellow-400 transition"
          >
            Sign In
          </button>

          <p className="mt-4 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-yellow-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
