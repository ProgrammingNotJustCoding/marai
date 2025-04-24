"use client";

import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiPaperclip, FiFile } from "react-icons/fi";

const getConsultationById = (id: string) => {
  // In a real app, this would be an API call
  return {
    id,
    clientName: "Sarah Williams",
    clientAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    scheduledTime: "2023-12-15T10:00:00",
    status: "confirmed",
    topic: "Software Innovation Protection",
    contractSigned: false,
    description:
      "Initial consultation to discuss intellectual property protection options for new AI-driven software innovation.",
    contractDetails: {
      title: "Legal Services Agreement",
      description:
        "This agreement outlines the scope of work, fees, and terms for legal representation.",
      contractId: "contract-001",
      signedUrl: "#",
      terms: [
        "Hourly billing rate: $350/hour",
        "Initial retainer: $2,000",
        "Filing fees to be paid separately",
        "Estimated timeline: 3-6 months",
        "Scope: Patent application preparation and filing",
      ],
    },
    messages: [
      {
        id: "msg-1",
        sender: "You",
        content:
          "Hello Sarah! I'm looking forward to our consultation. Please review the contract details before our call.",
        timestamp: "2023-12-10T14:30:00",
        senderType: "attorney",
      },
      {
        id: "msg-2",
        sender: "Sarah Williams",
        content:
          "Thanks for reaching out. I have a few questions about the pricing structure that I'd like to discuss during our call.",
        timestamp: "2023-12-10T15:45:00",
        senderType: "client",
      },
      {
        id: "msg-3",
        sender: "You",
        content:
          "Of course! We can go over all the details and make adjustments as needed. Feel free to bring up any concerns during our video consultation.",
        timestamp: "2023-12-11T09:15:00",
        senderType: "attorney",
      },
    ],
  };
};

export default function LawyerConsultationDetailsPage() {
  const { id } = useParams();
  const consultation = getConsultationById(String(id));
  const [newMessage, setNewMessage] = useState("");
  const [showContractUpload, setShowContractUpload] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [showContractEditor, setShowContractEditor] = useState(false);
  const [contractContent, setContractContent] = useState({
    title: consultation.contractDetails?.title || "Legal Services Agreement",
    description:
      consultation.contractDetails?.description ||
      "This agreement outlines the scope of work, fees, and terms for legal representation.",
    content:
      "This AGREEMENT is made between [CLIENT NAME] and [LAW FIRM NAME]...",
    isTemplate: false,
  });
  const router = useRouter();

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

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleContractSubmit = async () => {
    try {
      const lawFirmId = localStorage.getItem("lawFirmId") || "";

      // In a real app, this would be an API call
      console.log("Submitting contract:", {
        ...contractContent,
        lawFirmId,
      });

      // Show success message
      alert("Contract has been updated successfully!");
      setShowContractEditor(false);
      setShowContractUpload(false);
    } catch (error) {
      console.error("Error submitting contract:", error);
      alert("Failed to update contract.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContractFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!contractFile) return;

    try {
      // In a real app, this would upload the file to the server
      console.log("Uploading contract file:", contractFile.name);

      // Show success message
      alert("Contract file has been uploaded successfully!");
      setContractFile(null);
      setShowContractUpload(false);
    } catch (error) {
      console.error("Error uploading contract:", error);
      alert("Failed to upload contract.");
    }
  };

  const isConsultationTime = () => {
    const now = new Date();
    const consultTime = new Date(consultation.scheduledTime);
    const joinWindow = new Date(consultTime.getTime() - 5 * 60000);

    return now >= joinWindow;
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <Link
            href="/dashboard/lawyers/consultations"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Consultations
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {consultation.topic}
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-2">
            with {consultation.clientName}, scheduled for{" "}
            {formatDateTime(consultation.scheduledTime)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800">
                <h2 className="font-medium">
                  Chat with {consultation.clientName}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {consultation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === "client" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderType === "client"
                          ? "bg-gray-100 dark:bg-neutral-800"
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.senderType === "client" && (
                          <img
                            src={consultation.clientAvatar}
                            alt={message.sender}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        )}
                        <span className="font-medium text-sm">
                          {message.sender}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 dark:border-neutral-800"
              >
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-l-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Video Consultation
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 mb-4">
                Scheduled for {formatDateTime(consultation.scheduledTime)}
              </p>
              <button
                className={`w-full py-3 rounded-lg font-medium ${
                  isConsultationTime()
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400 cursor-not-allowed"
                }`}
                disabled={!isConsultationTime()}
              >
                {isConsultationTime()
                  ? "Join Video Call"
                  : "Video Call Not Yet Available"}
              </button>
              {!isConsultationTime() && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Available 5 minutes before scheduled time
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Legal Services Contract
              </h2>

              {!showContractEditor && !showContractUpload && (
                <>
                  <p className="text-gray-600 dark:text-neutral-400 mb-4">
                    {consultation.contractDetails.description}
                  </p>

                  <div className="mb-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg max-h-60 overflow-y-auto">
                    <h3 className="font-medium mb-2">Key Terms:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {consultation.contractDetails.terms.map((term, index) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col space-y-3">
                    {consultation.contractDetails.contractId && (
                      <Link
                        href={`/dashboard/lawyers/contracts/${consultation.contractDetails.contractId}`}
                        className="text-center py-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        View Full Contract
                      </Link>
                    )}

                    <button
                      onClick={() => setShowContractEditor(true)}
                      className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Edit Contract
                    </button>

                    <button
                      onClick={() => setShowContractUpload(true)}
                      className="py-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
                    >
                      <FiPaperclip className="mr-2" />
                      Upload Contract File
                    </button>
                  </div>
                </>
              )}

              {showContractEditor && (
                <div className="space-y-4">
                  <h3 className="font-medium">Edit Contract</h3>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Contract Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md dark:bg-neutral-800"
                      value={contractContent.title}
                      onChange={(e) =>
                        setContractContent({
                          ...contractContent,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md dark:bg-neutral-800"
                      value={contractContent.description}
                      onChange={(e) =>
                        setContractContent({
                          ...contractContent,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Contract Content
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded-md h-40 dark:bg-neutral-800"
                      value={contractContent.content}
                      onChange={(e) =>
                        setContractContent({
                          ...contractContent,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isTemplate"
                      checked={contractContent.isTemplate}
                      onChange={(e) =>
                        setContractContent({
                          ...contractContent,
                          isTemplate: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800"
                    />
                    <label
                      htmlFor="isTemplate"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      Save as template for future use
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleContractSubmit}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Save Contract
                    </button>
                    <button
                      onClick={() => setShowContractEditor(false)}
                      className="flex-1 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {showContractUpload && (
                <div className="space-y-4">
                  <h3 className="font-medium">Upload Contract File</h3>

                  <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-6 text-center">
                    <FiFile
                      size={36}
                      className="mx-auto mb-2 text-gray-400 dark:text-gray-500"
                    />

                    {contractFile ? (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-medium">{contractFile.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(contractFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                          Drag and drop your file here, or click to browse
                        </p>
                        <input
                          type="file"
                          id="contract-file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx"
                        />
                        <label
                          htmlFor="contract-file"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer inline-block"
                        >
                          Select File
                        </label>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleUploadSubmit}
                      className={`flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${!contractFile ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={!contractFile}
                    >
                      Upload Contract
                    </button>
                    <button
                      onClick={() => {
                        setShowContractUpload(false);
                        setContractFile(null);
                      }}
                      className="flex-1 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
