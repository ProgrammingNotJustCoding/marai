"use client";

import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const getConsultationById = (id: string) => {
  return {
    id,
    lawFirmName: "Wilson Intellectual Property",
    attorneyName: "Sarah Wilson",
    attorneyAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    scheduledTime: "2023-12-15T10:00:00",
    status: "pending",
    topic: "Software Innovation Protection",
    contractSigned: false,
    description:
      "Initial consultation to discuss intellectual property protection options for your new AI-driven software innovation.",
    contractDetails: {
      title: "Legal Services Agreement",
      description:
        "This agreement outlines the scope of work, fees, and terms for legal representation.",
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
        sender: "Sarah Wilson",
        content:
          "Hello! I'm looking forward to our consultation. Please review the contract details before our call.",
        timestamp: "2023-12-10T14:30:00",
        senderType: "attorney",
      },
      {
        id: "msg-2",
        sender: "You",
        content:
          "Thanks Sarah. I have a few questions about the pricing structure that I'd like to discuss during our call.",
        timestamp: "2023-12-10T15:45:00",
        senderType: "client",
      },
      {
        id: "msg-3",
        sender: "Sarah Wilson",
        content:
          "Of course! We can go over all the details and make adjustments as needed. Feel free to bring up any concerns during our video consultation.",
        timestamp: "2023-12-11T09:15:00",
        senderType: "attorney",
      },
    ],
  };
};

type ConsultationDetailsProps = {
  params: {
    id: string;
  };
};

export default function ConsultationDetailsPage({
  params,
}: ConsultationDetailsProps) {
  const consultation = getConsultationById(params.id);
  const [newMessage, setNewMessage] = useState("");
  const [confirmationStep, setConfirmationStep] = useState(0); // 0: not started, 1: contract reviewed, 2: confirmed
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

  const handleSignContract = () => {
    setConfirmationStep(2);
    setTimeout(() => {
      router.push("/dashboard/cases/case-001");
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log("Sending message:", newMessage);
    setNewMessage("");
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
            href="/dashboard/consultations"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Consultations
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {consultation.topic}
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-2">
            with {consultation.lawFirmName}, scheduled for{" "}
            {formatDateTime(consultation.scheduledTime)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800">
                <h2 className="font-medium">
                  Chat with {consultation.attorneyName}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {consultation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === "attorney" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderType === "attorney"
                          ? "bg-gray-100 dark:bg-neutral-800"
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.senderType === "attorney" && (
                          <img
                            src={consultation.attorneyAvatar}
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
                <a
                  href={consultation.contractDetails.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center py-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  onClick={() =>
                    setConfirmationStep(Math.max(confirmationStep, 1))
                  }
                >
                  View Full Contract
                </a>

                <button
                  onClick={handleSignContract}
                  className={`py-2 rounded-lg font-medium ${
                    confirmationStep >= 1
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400 cursor-not-allowed"
                  }`}
                  disabled={confirmationStep < 1}
                >
                  {confirmationStep === 2
                    ? "Contract Signed!"
                    : "Sign Contract & Create Case"}
                </button>

                {confirmationStep === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Please review the contract before signing
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
