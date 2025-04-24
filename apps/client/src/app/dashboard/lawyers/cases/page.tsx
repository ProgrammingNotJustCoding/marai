"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiChevronDown,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import { API_URL } from "@/utils/constants";

type Cases = {
  id: string;
  clientName: string;
  clientEmail: string;
  topic: string;
  status: string;
  createdAt: string;
  lastActivity: string;
  description: string;
  nextDeadline: string;
  nextDeadlineTask: string;
};

export default function LawyerCases() {
  const [cases, setCases] = useState<Cases[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, closed
  const router = useRouter();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        // In a real application, we would fetch from API
        // const response = await axios.get(`${API_URL}/consultations?status=confirmed`);

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const mockData: Cases[] = [
            {
              id: "case-001",
              clientName: "Sarah Williams",
              clientEmail: "sarah.w@example.com",
              topic: "Patent Application",
              status: "active",
              createdAt: "2023-11-20T13:00:00",
              lastActivity: "2023-12-02T09:30:00",
              description:
                "Assistance with filing a patent for a new AI-based technology solution.",
              nextDeadline: "2023-12-15T00:00:00",
              nextDeadlineTask: "Complete initial patent application draft",
            },
            {
              id: "case-002",
              clientName: "David Lee",
              clientEmail: "david.lee@example.com",
              topic: "Employment Contract Dispute",
              status: "active",
              createdAt: "2023-11-15T10:30:00",
              lastActivity: "2023-12-01T14:15:00",
              description:
                "Representing client in dispute regarding non-compete clause violations.",
              nextDeadline: "2023-12-10T00:00:00",
              nextDeadlineTask:
                "Prepare response to opposing counsel's settlement offer",
            },
            {
              id: "case-003",
              clientName: "Emily Chen",
              clientEmail: "emily.chen@example.com",
              topic: "Trademark Registration",
              status: "active",
              createdAt: "2023-10-05T09:00:00",
              lastActivity: "2023-12-03T11:45:00",
              description:
                "Handling trademark registration for client's new product line.",
              nextDeadline: "2023-12-20T00:00:00",
              nextDeadlineTask: "Submit revised trademark application",
            },
            {
              id: "case-004",
              clientName: "Robert Johnson",
              clientEmail: "robert.j@example.com",
              topic: "Copyright Infringement",
              status: "closed",
              createdAt: "2023-09-12T14:00:00",
              lastActivity: "2023-11-28T16:30:00",
              description:
                "Successfully resolved copyright infringement case against competitor.",
              nextDeadline: null,
              nextDeadlineTask: null,
            },
            {
              id: "case-005",
              clientName: "Jennifer Adams",
              clientEmail: "jennifer.a@example.com",
              topic: "Merger & Acquisition",
              status: "closed",
              createdAt: "2023-08-20T11:15:00",
              lastActivity: "2023-10-15T15:00:00",
              description:
                "Provided legal counsel for acquisition of competitor startup.",
              nextDeadline: null,
              nextDeadlineTask: null,
            },
          ];

          setCases(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching cases:", error);
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const daysUntilDeadline = (deadlineString) => {
    if (!deadlineString) return null;

    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.clientName.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.topic.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(search.toLowerCase());

    if (filter === "all") {
      return matchesSearch;
    } else {
      return caseItem.status === filter && matchesSearch;
    }
  });

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cases
          </h1>

          <div className="flex space-x-2">
            <div className="relative">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 flex items-center space-x-2"
                onClick={() =>
                  setFilter(
                    filter === "all"
                      ? "active"
                      : filter === "active"
                        ? "closed"
                        : "all",
                  )
                }
              >
                <FiFilter />
                <span>
                  {filter === "all"
                    ? "All Cases"
                    : filter === "active"
                      ? "Active Cases"
                      : "Closed Cases"}
                </span>
                <FiChevronDown />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
            <p className="text-gray-500 dark:text-gray-400">
              No cases found matching your criteria
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((caseItem) => {
              const daysToDeadline = daysUntilDeadline(caseItem.nextDeadline);

              return (
                <div
                  key={caseItem.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/lawyers/cases/${caseItem.id}`)
                  }
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {caseItem.topic}
                      </h2>
                      <div className="mt-1 flex items-center space-x-3">
                        <span className="text-gray-600 dark:text-gray-400">
                          {caseItem.clientName}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          {caseItem.clientEmail}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          caseItem.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {caseItem.status === "active" ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {caseItem.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Case opened
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 font-medium">
                          {formatDate(caseItem.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FiFileText className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Last activity
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 font-medium">
                          {formatDateTime(caseItem.lastActivity)}
                        </div>
                      </div>
                    </div>

                    {caseItem.nextDeadline && (
                      <div className="flex items-center space-x-2">
                        <FiCheckCircle
                          className={
                            daysToDeadline <= 3
                              ? "text-red-500"
                              : daysToDeadline <= 7
                                ? "text-yellow-500"
                                : "text-green-500"
                          }
                        />
                        <div>
                          <div
                            className={
                              daysToDeadline <= 3
                                ? "text-red-500"
                                : daysToDeadline <= 7
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }
                          >
                            {caseItem.nextDeadlineTask}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 font-medium">
                            {formatDate(caseItem.nextDeadline)}
                            {daysToDeadline <= 0
                              ? " (Overdue)"
                              : daysToDeadline === 1
                                ? " (Tomorrow)"
                                : daysToDeadline < 7
                                  ? ` (${daysToDeadline} days)`
                                  : ""}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
