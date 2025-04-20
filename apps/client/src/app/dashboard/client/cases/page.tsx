"use client";

import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";

const cases = [
  {
    id: "case-001",
    title: "Software Innovation IP Protection",
    lawFirmName: "Wilson Intellectual Property",
    startDate: "2023-10-15",
    lastUpdated: "2023-11-10T14:30:00",
    type: "Intellectual Property",
    status: "active",
  },
  {
    id: "case-002",
    title: "Trademark Registration - TechBrand",
    lawFirmName: "Davis & Partners LLC",
    startDate: "2023-12-05",
    lastUpdated: "2023-12-07T09:15:00",
    type: "Trademark",
    status: "active",
  },
];

export default function CasesPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          My Cases
        </h1>

        {cases.length > 0 ? (
          <div className="grid gap-6">
            {cases.map((caseItem) => (
              <Link
                href={`/dashboard/client/cases/${caseItem.id}`}
                key={caseItem.id}
                className="block"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-6 transition-all hover:shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                          {caseItem.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-neutral-400 mb-1">
                        <span className="font-medium">Law Firm:</span>{" "}
                        {caseItem.lawFirmName}
                      </p>
                      <p className="text-gray-600 dark:text-neutral-400 mb-1">
                        <span className="font-medium">Type:</span>{" "}
                        {caseItem.type}
                      </p>
                      <p className="text-gray-600 dark:text-neutral-400">
                        <span className="font-medium">Started:</span>{" "}
                        {formatDate(caseItem.startDate)}
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          caseItem.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {caseItem.status === "active" ? "Active" : "Closed"}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Last updated: {formatDateTime(caseItem.lastUpdated)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg text-center shadow-md">
            <p className="text-gray-600 dark:text-neutral-400 text-lg">
              You don't have any active cases yet.
            </p>
            <Link href="/dashboard/client/consultations">
              <button className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors">
                Schedule a Consultation
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
