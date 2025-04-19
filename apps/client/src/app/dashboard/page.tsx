"use client";

import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import LawfirmFilters from "@/components/dashboard/LawfirmFilters";
import LawfirmsList from "@/components/dashboard/LawfirmsList";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    location: null as string | null,
    establishment: null as number | null,
    rating: null as number | null,
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Find a Law Firm
          </h1>
          <p className="text-neutral-700 dark:text-neutral-400 mt-2">
            Connect with reputable law firms specialized in your specific legal
            needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <LawfirmFilters onFilterChange={handleFilterChange} />
          </div>

          <div className="lg:col-span-3">
            <LawfirmsList filters={filters} />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
