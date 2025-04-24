"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiCalendar,
  FiBriefcase,
  FiFile,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

type Consultations = {
  id: string;
  clientName: string;
  date: string;
  topic: string;
  status: string;
};

export default function LawyersHome() {
  const [stats, setStats] = useState<{
    pendingConsultations: number;
    activeCases: number;
    totalClients: number;
    contractsCreated: number;
  }>({
    pendingConsultations: 0,
    activeCases: 0,
    totalClients: 0,
    contractsCreated: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState<
    Consultations[]
  >([]);
  const [upcomingConsultations, setUpcomingConsultations] = useState<
    Consultations[]
  >([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, these would be API calls
    // For demo purposes, we'll use mock data
    setStats({
      pendingConsultations: 5,
      activeCases: 12,
      totalClients: 18,
      contractsCreated: 24,
    });

    setRecentConsultations([
      {
        id: "consult-001",
        clientName: "John Smith",
        date: "2023-12-01T14:30:00",
        topic: "Divorce Proceedings",
        status: "assigned",
      },
      {
        id: "consult-002",
        clientName: "Amy Johnson",
        date: "2023-11-28T11:00:00",
        topic: "Real Estate Contract Review",
        status: "assigned",
      },
      {
        id: "consult-003",
        clientName: "Michael Brown",
        date: "2023-11-25T09:15:00",
        topic: "Business Formation",
        status: "assigned",
      },
    ]);

    setUpcomingConsultations([
      {
        id: "consult-004",
        clientName: "Sarah Williams",
        date: "2023-12-05T13:00:00",
        topic: "Patent Application",
        status: "confirmed",
      },
      {
        id: "consult-005",
        clientName: "David Lee",
        date: "2023-12-07T10:30:00",
        topic: "Employment Contract Dispute",
        status: "confirmed",
      },
    ]);

    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Lawyer Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                <FiCalendar size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Consultations
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingConsultations}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                <FiBriefcase size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active Cases
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeCases}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
                <FiUsers size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Clients
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalClients}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 mr-4">
                <FiFile size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Contracts Created
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.contractsCreated}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm mb-8">
          <div className="border-b border-gray-200 dark:border-neutral-800 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Assigned Consultations
            </h2>
            <Link
              href="/dashboard/lawyers/consultations"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              View all <FiArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-neutral-800">
            {recentConsultations.length > 0 ? (
              recentConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/lawyers/consultations/${consultation.id}`,
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {consultation.topic}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Client: {consultation.clientName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        Assigned
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(consultation.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No recent consultations to display
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
          <div className="border-b border-gray-200 dark:border-neutral-800 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Consultations
            </h2>
            <Link
              href="/dashboard/lawyers/consultations"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              View calendar <FiCalendar size={16} className="ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-neutral-800">
            {upcomingConsultations.length > 0 ? (
              upcomingConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/lawyers/consultations/${consultation.id}`,
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {consultation.topic}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Client: {consultation.clientName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Confirmed
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(consultation.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No upcoming consultations scheduled
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
