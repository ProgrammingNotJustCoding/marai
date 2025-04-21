"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiFilter, FiSearch } from "react-icons/fi";

type Consultation = {
  id: string;
  clientName: string;
  clientEmail: string;
  scheduledTime: string;
  topic: string;
  status: string;
  isTaken: boolean;
  caseDetails: string;
};

export default function LawyerConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("assigned");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        // In a real application, we would fetch from API
        // const response = await axios.get(`${API_URL}/consultations?status=${filter}`);
        // setConsultations(response.data.data);

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const mockData = [
            {
              id: "consult-001",
              clientName: "John Smith",
              clientEmail: "john.smith@example.com",
              scheduledTime: "2023-12-05T14:30:00",
              topic: "Divorce Proceedings",
              status: "assigned",
              isTaken: false,
              caseDetails:
                "Client is seeking guidance on divorce proceedings and child custody arrangements.",
            },
            {
              id: "consult-002",
              clientName: "Amy Johnson",
              clientEmail: "amy.johnson@example.com",
              scheduledTime: "2023-12-04T11:00:00",
              topic: "Real Estate Contract Review",
              status: "assigned",
              isTaken: false,
              caseDetails:
                "Review of purchase agreement for commercial property.",
            },
            {
              id: "consult-003",
              clientName: "Michael Brown",
              clientEmail: "michael.brown@example.com",
              scheduledTime: "2023-12-08T09:15:00",
              topic: "Business Formation",
              status: "assigned",
              isTaken: false,
              caseDetails:
                "Assistance with forming an LLC and drafting operating agreements.",
            },
            {
              id: "consult-004",
              clientName: "Sarah Williams",
              clientEmail: "sarah.w@example.com",
              scheduledTime: "2023-12-03T13:00:00",
              topic: "Patent Application",
              status: "confirmed",
              isTaken: true,
              caseDetails:
                "Consultation about filing a patent for a new technology invention.",
            },
            {
              id: "consult-005",
              clientName: "David Lee",
              clientEmail: "david.lee@example.com",
              scheduledTime: "2023-12-07T10:30:00",
              topic: "Employment Contract Dispute",
              status: "confirmed",
              isTaken: true,
              caseDetails:
                "Client facing issues with non-compete clause in employment contract.",
            },
          ];

          setConsultations(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching consultations:", error);
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [filter]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAcceptConsultation = async (id: string) => {
    try {
      // In a real app, this would be an API call
      console.log("Accepting consultation", id);

      // Update the local state to show the change immediately
      setConsultations((prevConsultations) =>
        prevConsultations.map((consultation) =>
          consultation.id === id
            ? { ...consultation, status: "confirmed", isTaken: true }
            : consultation,
        ),
      );
    } catch (error) {
      console.error("Error accepting consultation:", error);
    }
  };

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.clientName.toLowerCase().includes(search.toLowerCase()) ||
      consultation.topic.toLowerCase().includes(search.toLowerCase()) ||
      consultation.caseDetails.toLowerCase().includes(search.toLowerCase());

    if (filter === "assigned") {
      return consultation.status === "assigned" && matchesSearch;
    } else if (filter === "confirmed") {
      return consultation.status === "confirmed" && matchesSearch;
    } else {
      return matchesSearch;
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
            Consultations
          </h1>

          <div className="flex space-x-2">
            <div className="relative">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 flex items-center space-x-2"
                onClick={() =>
                  setFilter(filter === "assigned" ? "confirmed" : "assigned")
                }
              >
                <FiFilter />
                <span>{filter === "assigned" ? "Assigned" : "Confirmed"}</span>
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
              placeholder="Search consultations..."
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
        ) : filteredConsultations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
            <p className="text-gray-500 dark:text-gray-400">
              No consultations found matching your criteria
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Scheduled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                  {filteredConsultations.map((consultation) => (
                    <tr
                      key={consultation.id}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {consultation.clientName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {consultation.clientEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {consultation.topic}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[300px]">
                          {consultation.caseDetails}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {formatDateTime(consultation.scheduledTime)}
                      </td>
                      <td className="px-6 py-4">
                        {consultation.status === "assigned" ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            Assigned
                          </span>
                        ) : consultation.status === "confirmed" ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Confirmed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            {consultation.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {consultation.status === "assigned" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleAcceptConsultation(consultation.id)
                              }
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                            >
                              Accept
                            </button>
                            <Link
                              href={`/dashboard/lawyers/consultations/${consultation.id}`}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={`/dashboard/lawyers/consultations/${consultation.id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
