"use client";

import { ReactNode } from "react";
import { useTheme } from "next-themes";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  const logoSrc =
    resolvedTheme === "dark"
      ? "/images/logo-white.png"
      : "/images/logo-black.png";

  return (
    <div className="h-screen flex md:flex-row md:items-center md:justify-center dark:bg-neutral-900">
      <div className="w-1/2 h-screen md:flex hidden bg-green-50 dark:bg-neutral-950 flex-col justify-center items-center p-8 md:p-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <img
              src={logoSrc}
              alt="Marai Logo"
              width={120}
              height={80}
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-6">
            Marai
          </h1>
          <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-8">
            Marai is a cloud-based architecture designed to streamline legal
            consultations and case file management for clients and law firms.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white dark:bg-neutral-900 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
