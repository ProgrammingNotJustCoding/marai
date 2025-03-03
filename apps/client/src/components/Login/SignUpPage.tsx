import React, { useState } from "react";
import signUpImage from "../../../public/images/signup.jpeg";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup with:", formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 bg-gradient-to-br from-zinc-950 to-black">
      <div className="w-full max-w-4xl flex overflow-hidden rounded-lg shadow-2xl shadow-zinc-800/20 border border-zinc-800/50">
        <div className="hidden md:block w-1/2 bg-zinc-900 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-zinc-900/80 z-10"></div>
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={signUpImage}
              alt="Signup visual"
              className="object-cover h-full w-full opacity-90"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/30 to-zinc-950 pointer-events-none"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-zinc-700/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zinc-700/5 rounded-full blur-3xl"></div>

          <div className="p-8 relative z-10">
            <h2 className="text-xl font-semibold mb-1">Create an account</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Enter your details below to sign up
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm text-zinc-400"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 shadow-sm shadow-zinc-900/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-zinc-400">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 shadow-sm shadow-zinc-900/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="mobile" className="block text-sm text-zinc-400">
                  Mobile
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 shadow-sm shadow-zinc-900/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm text-zinc-400"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 shadow-sm shadow-zinc-900/50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-zinc-200 transition duration-200 mt-2 shadow-md shadow-zinc-900/30"
              >
                Sign up
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:text-blue-400">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
