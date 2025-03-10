import React, { useState } from "react";
import signUpImage from "../../../public/images/signup.jpeg";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formattedMobile = formData.mobile.startsWith("+")
        ? formData.mobile
        : `+${formData.mobile}`;

      const updatedFormData = {
        ...formData,
        mobile: formattedMobile,
      };

      await authAPI.signup(updatedFormData);

      localStorage.setItem("verificationMobile", formattedMobile);

      navigate("/signup/verification");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

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
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-zinc-200 transition duration-200 mt-2 shadow-md shadow-zinc-900/30 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign up"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-zinc-300 hover:text-white hover:underline"
              >
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
