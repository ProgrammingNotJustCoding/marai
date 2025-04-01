import React, { useState } from "react";
import SignInImage from "../../../public/images/signin.jpeg";
import instance from "../../api/axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await instance.post(
        "/user/signin/password",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("login failed: ", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 bg-gradient-to-br from-zinc-950 to-black">
      <div className="w-full max-w-4xl flex overflow-hidden rounded-lg shadow-2xl shadow-zinc-800/20 border border-zinc-800/50">
        <div className="hidden md:block w-1/2 bg-zinc-900 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-zinc-900/80 z-10"></div>
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={SignInImage}
              alt="Login visual"
              className="object-cover h-full w-full opacity-90"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/30 to-zinc-950 pointer-events-none"></div>

          <div className="absolute -top-40 -right-40 w-80 h-80 bg-zinc-700/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zinc-700/5 rounded-full blur-3xl"></div>

          <div className="p-8 relative z-10">
            <h2 className="text-xl font-semibold mb-1">Login</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Enter your email below to login to your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-zinc-400">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 shadow-sm shadow-zinc-900/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm text-zinc-400"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-zinc-400 hover:text-zinc-300"
                  >
                    Forgot your password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 shadow-sm shadow-zinc-900/50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-zinc-200 transition duration-200 mt-2 shadow-md shadow-zinc-900/30"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-zinc-300 hover:text-white hover:underline"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
