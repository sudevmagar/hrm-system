"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials"); 
      setLoading(false); 
    } else {
      // Fetch the user's role from the session
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      if (session?.user?.role) {
        // Redirect based on the user's role
        switch (session.user.role) {
          case "HR":
            router.push("/dashboard");
            break;
          case "MANAGER":
            router.push("/dashboard/manager-dashboard");
            break;
          case "EMPLOYEE":
            router.push("/dashboard/employee-dashboard");
            break;
          default:
            setError("Invalid role");
            setLoading(false);
        }
      } else {
        setError("Failed to fetch user role");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-400">MayaMatrix Technologies</h1>
        <h2 className="text-xl font-semibold text-gray-900">Human Resource Management System</h2>
      </div>

      {/* Login Form */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
              type="submit"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Signing in.." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}