"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Theme from "../common/Theme";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import { useTheme } from "next-themes";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/images/logo-white.png"
      : "/images/logo-black.png";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white dark:bg-neutral-900 shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center"
            >
              {mounted && (
                <Image
                  src={logoSrc}
                  alt="Marai Logo"
                  width={32}
                  height={32}
                  className="mr-2 w-20 h-14"
                />
              )}
              Marai
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-neutral-700 hover:text-green-600 dark:text-neutral-300 dark:hover:text-green-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Theme />
            <Link
              href="/auth"
              className="ml-4 px-5 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 text-white dark:text-neutral-900 rounded-md font-medium transition-colors"
            >
              Login
            </Link>
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <Theme />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-700 dark:text-neutral-300"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-neutral-900 shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-green-600 dark:text-neutral-300 dark:hover:text-green-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/auth"
                className="block px-3 py-2 mt-4 text-base font-medium bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 text-white dark:text-neutral-900 text-center rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
