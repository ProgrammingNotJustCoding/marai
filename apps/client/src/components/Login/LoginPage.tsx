import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInImage from "../../../public/images/signin.jpeg";
import { authAPI } from "../../api/auth";

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password"
  );
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSwitchMethod = () => {
    setLoginMethod((prev) => (prev === "password" ? "otp" : "password"));
    setError("");
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formattedMobile = mobile.startsWith("+") ? mobile : `+${mobile}`;

      const response = await authAPI.signinWithPassword({
        mobile: formattedMobile,
        password,
      });

      if (response.user) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formattedMobile = mobile.startsWith("+") ? mobile : `+${mobile}`;

      await authAPI.requestSigninOTP(formattedMobile);

      localStorage.setItem("verificationMobile", formattedMobile);

      navigate("/login/verification");
    } catch (err: any) {
      console.error("OTP request error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send verification code. Please try again."
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
              {loginMethod === "password"
                ? "Enter your details below to login"
                : "We'll send a verification code to your mobile"}
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setLoginMethod("password")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  loginMethod === "password"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Password
              </button>
              <button
                onClick={() => setLoginMethod("otp")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  loginMethod === "otp"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                OTP
              </button>
            </div>

            {loginMethod === "password" ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm text-zinc-400"
                  >
                    Mobile
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 000-0000"
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
                  className={`w-full bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-zinc-200 transition duration-200 mt-2 shadow-md shadow-zinc-900/30 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTPLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="mobile-otp"
                    className="block text-sm text-zinc-400"
                  >
                    Mobile
                  </label>
                  <input
                    id="mobile-otp"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 shadow-sm shadow-zinc-900/50"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-zinc-200 transition duration-200 mt-2 shadow-md shadow-zinc-900/30 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending code..." : "Send verification code"}
                </button>
              </form>
            )}

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
