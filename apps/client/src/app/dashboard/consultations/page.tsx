"use client";

import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";

const consultations = [
  {
    id: "consul-001",
    lawFirmName: "Wilson Intellectual Property",
    attorneyName: "Sarah Wilson",
    scheduledTime: "2023-12-15T10:00:00",
    status: "pending",
    topic: "Software Innovation Protection",
    contractSigned: false,
  },
  {
    id: "consul-002",
    lawFirmName: "Davis & Partners LLC",
    attorneyName: "Michael Davis",
    scheduledTime: "2023-12-16T14:30:00",
    status: "pending",
    topic: "Trademark Registration Consultation",
    contractSigned: false,
  },
  {
    id: "consul-003",
    lawFirmName: "Johnson Legal Group",
    attorneyName: "Robert Johnson",
    scheduledTime: "2023-12-12T11:00:00",
    status: "completed",
    topic: "Patent Filing Strategy",
    contractSigned: true,
  },
];

export default function ConsultationsPage() {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Consultations
          </h1>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors">
            Schedule New Consultation
          </button>
        </div>

        {consultations.length > 0 ? (
          <div className="grid gap-6">
            {consultations.map((consultation) => (
              <Link
                href={`/dashboard/consultations/${consultation.id}`}
                key={consultation.id}
                className="block"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-6 transition-all hover:shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        {consultation.topic}
                      </h3>
                      <p className="text-gray-600 dark:text-neutral-400 mb-1">
                        <span className="font-medium">Law Firm:</span>{" "}
                        {consultation.lawFirmName}
                      </p>
                      <p className="text-gray-600 dark:text-neutral-400 mb-1">
                        <span className="font-medium">Attorney:</span>{" "}
                        {consultation.attorneyName}
                      </p>
                      <p className="text-gray-600 dark:text-neutral-400">
                        <span className="font-medium">Scheduled:</span>{" "}
                        {formatDateTime(consultation.scheduledTime)}
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          consultation.status === "pending"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {consultation.status === "pending"
                          ? "Upcoming"
                          : "Completed"}
                      </span>

                      <span
                        className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                          consultation.contractSigned
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {consultation.contractSigned
                          ? "Contract Signed"
                          : "Contract Pending"}
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
              No consultations scheduled with any law firms yet.
            </p>
            <button className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors">
              Find a Law Firm
            </button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
