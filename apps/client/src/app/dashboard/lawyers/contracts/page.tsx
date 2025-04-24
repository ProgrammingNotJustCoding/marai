"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiFile,
  FiSearch,
  FiChevronDown,
  FiFilter,
  FiCopy,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/utils/constants";

type Contract = {
  id: string;
  title: string;
  description: string;
  content: string;
  isTemplate: boolean;
};

export default function LawyerContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, templates, custom
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContract, setNewContract] = useState({
    title: "",
    description: "",
    content: "",
    isTemplate: false,
  });
  const router = useRouter();

  const getLawFirmId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lawfirmId");
    } else {
      return "demo-law-firm-id";
    }
  };

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const lawFirmId = getLawFirmId();
        // In a real application, we would fetch from API
        // const response = await axios.get(`${API_URL}/contracts/${lawFirmId}`);

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const mockData = [
            {
              id: "contract-001",
              title: "Standard Legal Services Agreement",
              description:
                "Standard service agreement for general legal representation",
              createdAt: "2023-11-15T10:30:00",
              updatedAt: "2023-12-01T14:15:00",
              isTemplate: true,
              author: "Jane Wilson",
            },
            {
              id: "contract-002",
              title: "IP Protection Agreement",
              description:
                "Contract for intellectual property protection services",
              createdAt: "2023-10-20T09:45:00",
              updatedAt: "2023-11-28T16:30:00",
              isTemplate: true,
              author: "Michael Stevens",
            },
            {
              id: "contract-003",
              title: "Merger & Acquisition Legal Services",
              description: "Specialized contract for M&A legal representation",
              createdAt: "2023-09-05T11:15:00",
              updatedAt: "2023-10-12T13:00:00",
              isTemplate: true,
              author: "Robert Black",
            },
            {
              id: "contract-004",
              title: "Sarah Williams - Patent Application",
              description:
                "Legal services agreement for patent application processing",
              createdAt: "2023-11-22T14:30:00",
              updatedAt: "2023-11-22T14:30:00",
              isTemplate: false,
              author: "You",
            },
            {
              id: "contract-005",
              title: "David Lee - Employment Contract Dispute",
              description: "Contract for employment dispute representation",
              createdAt: "2023-11-18T09:00:00",
              updatedAt: "2023-11-18T09:00:00",
              isTemplate: false,
              author: "You",
            },
          ];

          setContracts(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateContract = async () => {
    try {
      const lawFirmId = getLawFirmId();
      const userId = localStorage.getItem("userId");
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/contracts`,
        {
          title: newContract.title,
          description: newContract.description,
          content: newContract.content,
          isTemplate: newContract.isTemplate,
          lawFirmId: lawFirmId,
          creator_id: userId,
        },
        { withCredentials: true },
      );

      // Transform API response to match expected contract structure
      const newContractData = {
        id: response.data.data.id,
        title: response.data.data.title,
        description: response.data.data.description,
        content: response.data.data.content,
        isTemplate: response.data.data.isTemplate,
        createdAt: response.data.data.createdAt,
        updatedAt: response.data.data.updatedAt,
        author: "You", // Default author for new contracts
      };

      setContracts([newContractData, ...contracts]);

      setNewContract({
        title: "",
        description: "",
        content: "",
        isTemplate: false,
      });
      setShowCreateModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error creating contract:", error);
      alert(
        "Failed to create contract: " +
          (error.response?.data?.message || error.message),
      );
      setLoading(false);
    }
  };

  const handleDuplicateContract = (contract) => {
    setNewContract({
      title: `Copy of ${contract.title}`,
      description: contract.description,
      content: "Sample contract content...",
      isTemplate: false,
    });
    setShowCreateModal(true);
  };

  const filteredContracts = contracts.filter((contract) => {
    const contractTitle = contract.title || "";
    const contractDescription = contract.description || "";

    const matchesSearch =
      contractTitle.toLowerCase().includes(search.toLowerCase()) ||
      contractDescription.toLowerCase().includes(search.toLowerCase());

    if (filter === "all") {
      return matchesSearch;
    } else if (filter === "templates") {
      return contract.isTemplate && matchesSearch;
    } else {
      return !contract.isTemplate && matchesSearch;
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
            Contracts
          </h1>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center space-x-2"
          >
            <FiPlus />
            <span>Create Contract</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 flex items-center space-x-2"
              onClick={() =>
                setFilter(
                  filter === "all"
                    ? "templates"
                    : filter === "templates"
                      ? "custom"
                      : "all",
                )
              }
            >
              <FiFilter />
              <span>
                {filter === "all"
                  ? "All Contracts"
                  : filter === "templates"
                    ? "Templates Only"
                    : "Custom Contracts"}
              </span>
              <FiChevronDown />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
            <FiFile
              size={48}
              className="mx-auto mb-4 text-gray-400 dark:text-gray-600"
            />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No contracts found matching your criteria
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Create New Contract
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                {filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/dashboard/lawyers/contracts/${contract.id}`,
                          )
                        }
                      >
                        <FiFile className="text-gray-400 dark:text-gray-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {contract.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {contract.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      <div>{formatDate(contract.createdAt)}</div>
                      {contract.updatedAt !== contract.createdAt && (
                        <div className="text-xs">
                          Updated: {formatDate(contract.updatedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {contract.author}
                    </td>
                    <td className="px-6 py-4">
                      {contract.isTemplate ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          Template
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateContract(contract);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded"
                          title="Duplicate"
                        >
                          <FiCopy className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/lawyers/contracts/${contract.id}/edit`,
                            );
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded"
                          title="Edit"
                        >
                          <FiEdit className="text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Are you sure you want to delete this contract?",
                              )
                            ) {
                              console.log("Deleting contract:", contract.id);
                              setContracts(
                                contracts.filter((c) => c.id !== contract.id),
                              );
                            }
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded"
                          title="Delete"
                        >
                          <FiTrash2 className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Contract Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Create New Contract
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md dark:bg-neutral-800"
                    value={newContract.title}
                    onChange={(e) =>
                      setNewContract({ ...newContract, title: e.target.value })
                    }
                    placeholder="e.g., Legal Services Agreement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md dark:bg-neutral-800"
                    value={newContract.description}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the contract purpose"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Content
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md h-60 dark:bg-neutral-800"
                    value={newContract.content}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        content: e.target.value,
                      })
                    }
                    placeholder="This AGREEMENT is made between [CLIENT NAME] and [LAW FIRM NAME]..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTemplate"
                    checked={newContract.isTemplate}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        isTemplate: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                  <label
                    htmlFor="isTemplate"
                    className="ml-2 text-gray-700 dark:text-gray-300"
                  >
                    Save as template for future use
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContract}
                  disabled={!newContract.title || !newContract.content}
                  className={`px-4 py-2 bg-green-600 text-white rounded-md ${
                    !newContract.title || !newContract.content
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-700"
                  }`}
                >
                  Create Contract
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
