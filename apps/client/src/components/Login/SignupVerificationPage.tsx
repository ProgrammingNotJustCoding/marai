import React, { useState } from "react";
import verificationImage from "../../../public/images/verification.jpeg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "../ui/input-otp";

interface VerificationFormData {
  mobile: string;
  otp: string;
}

export default function VerificationPage() {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [formData, setFormData] = useState<VerificationFormData>({
    mobile: "",
    otp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Verification successful", formData);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPChange = (value: string) => {
    setFormData((prev) => ({ ...prev, otp: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 bg-gradient-to-br from-zinc-950 to-black">
      <div className="w-full max-w-4xl flex overflow-hidden rounded-lg shadow-2xl shadow-zinc-800/20 border border-zinc-800/50">
        <div className="hidden md:block w-1/2 bg-zinc-900 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-zinc-900/80 z-10"></div>
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={verificationImage}
              alt="Verification visual"
              className="object-cover h-full w-full opacity-90"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/30 to-zinc-950 pointer-events-none"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-zinc-700/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zinc-700/5 rounded-full blur-3xl"></div>

          <div className="p-8 relative z-10">
            <h2 className="text-xl font-semibold mb-1">
              {step === "mobile"
                ? "Verify your account"
                : "Enter verification code"}
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              {step === "mobile"
                ? "Enter your mobile number to receive a verification code"
                : `We've sent a code to ${formData.mobile}`}
            </p>

            {step === "mobile" ? (
              <form onSubmit={handleMobileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm text-zinc-400"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 shadow-sm shadow-zinc-900/50"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-zinc-200 transition duration-200 mt-2 shadow-md shadow-zinc-900/30 ${
                    isSubmitting || !formData.mobile
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isSubmitting || !formData.mobile}
                >
                  {isSubmitting ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label htmlFor="otp" className="block text-sm text-zinc-400">
                    Verification Code
                  </label>
                  <div className="flex justify-center py-2">
                    <InputOTP
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleOTPChange}
                      containerClassName="gap-2"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="bg-zinc-900/80 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-700"
                        />
                        <InputOTPSlot
                          index={1}
                          className="bg-zinc-900/80 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-700"
                        />
                        <InputOTPSlot
                          index={2}
                          className="bg-zinc-900/80 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-700"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className="bg-zinc-900/80 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-700"
                        />
                        <InputOTPSlot
                          index={4}
                          className="bg-zinc-900/80 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-700"
                        />
                        <InputOTPSlot
                          index={5}
                          className="bg-zinc-900/80 border-zinc-800 text-white focus:border-zinc-700 focus:ring-zinc-700"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-center text-sm text-zinc-400">
                    Didn't receive a code?{" "}
                    <button
                      type="button"
                      className="text-zinc-300 hover:text-white hover:underline"
                    >
                      Resend
                    </button>
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    type="submit"
                    className={`w-full bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-zinc-200 transition duration-200 shadow-md shadow-zinc-900/30 ${
                      isSubmitting || formData.otp.length !== 6
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isSubmitting || formData.otp.length !== 6}
                  >
                    {isSubmitting ? "Verifying..." : "Verify"}
                  </button>
                  <button
                    type="button"
                    className="w-full border border-zinc-800 bg-transparent px-4 py-2 font-medium text-zinc-400 transition-colors hover:bg-zinc-900 focus:outline-none rounded-md"
                    onClick={() => setStep("mobile")}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

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
}
