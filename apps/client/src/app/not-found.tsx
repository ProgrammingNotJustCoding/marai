"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        <div className="mb-8 text-green-600 dark:text-green-400">
          <span className="text-8xl lg:text-9xl font-bold">404</span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
          Page not found
        </h2>

        <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed mb-10">
          We couldn&apos;t find the page you&apos;re looking for. It might have
          been moved or doesn&apos;t exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md font-medium transition-colors w-full sm:w-auto"
          >
            <FiArrowLeft /> Go Back
          </button>

          <Link
            href="/"
            className="flex items-center hover:cursor-pointer justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 text-white dark:text-neutral-900 rounded-md font-medium transition-colors w-full sm:w-auto"
          >
            <FiHome /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
