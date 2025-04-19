"use client";

import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";

export default function ConsultationsPage() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Your Consultations
        </h1>

        <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg text-center shadow-md">
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            No consultations scheduled with any law firms yet.
          </p>
          <button className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors">
            Find a Law Firm
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
