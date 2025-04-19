"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiFileText,
  FiClock,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";

const mockCases = [
  {
    id: "case-001",
    title: "Patent Application for Software Innovation",
    lawFirmId: "6",
    lawFirmName: "Wilson Intellectual Property",
    status: "active",
    lastUpdated: "2023-11-10T14:30:00",
    documents: 3,
    type: "Intellectual Property",
  },
];

export default function CasesPage() {
  const router = useRouter();
  const [cases] = useState(mockCases);

  const activeCases = cases.filter((c) => c.status === "active");
  const archivedCases = cases.filter((c) => c.status === "archived");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderCaseCard = (caseItem: {
    id: string;
    title: string;
    type: string;
    status: string;
    documents: number;
    lawFirmName: string;
    lastUpdated: string;
  }) => (
    <div
      key={caseItem.id}
      onClick={() => router.push(`/dashboard/cases/${caseItem.id}`)}
      className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-4 cursor-pointer hover:border-green-500 dark:hover:border-green-500 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
          {caseItem.type}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {formatDate(caseItem.lastUpdated)}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {caseItem.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Handled by: {caseItem.lawFirmName}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <FiFileText className="mr-1" />
            <span>{caseItem.documents} documents</span>
          </div>
        </div>

        <div className="text-green-600 dark:text-green-400">
          <FiChevronRight />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Cases
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track your ongoing legal cases
            </p>
          </div>
        </div>

        {activeCases.length > 0 ? (
          <div>
            <h2 className="flex items-center text-xl font-semibold text-gray-900 dark:text-white mb-4">
              <FiBriefcase className="mr-2" />
              Active Cases
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {activeCases.map((caseItem) => renderCaseCard(caseItem))}
            </div>

            {archivedCases.length > 0 && (
              <>
                <h2 className="flex items-center text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  <FiClock className="mr-2" />
                  Archived Cases
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {archivedCases.map((caseItem) => renderCaseCard(caseItem))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBriefcase className="text-gray-500 dark:text-gray-400 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No active cases
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don&apos;t have any active cases with law firms yet.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
            >
              Find a Law Firm
            </button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
