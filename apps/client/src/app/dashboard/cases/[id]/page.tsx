"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import CaseHeader from "@/components/dashboard/CaseHeader";
import TabNavigation from "@/components/dashboard/TabNavigation";
import OverviewTab from "@/components/dashboard/OverviewTab";
import DocumentsTab from "@/components/dashboard/DocumentsTab";
import MessagesTab from "@/components/dashboard/MessagesTab";
import BillingTab from "@/components/dashboard/BillingTab";

const getCaseById = (id: string) => {
  return {
    id: "case-001",
    title: "Software Innovation IP Protection",
    lawFirmId: "6",
    lawFirmName: "Wilson Intellectual Property",
    status: "active",
    startDate: "2023-10-15",
    lastUpdated: "2023-11-10T14:30:00",
    type: "Intellectual Property",
    description:
      "Filing for legal protection for a new AI-driven software innovation focusing on natural language processing.",
    assignedAttorney: "Sarah Wilson",
    documents: [
      {
        id: "doc-1",
        name: "Application Draft",
        type: "pdf",
        uploadedBy: "law-firm",
        date: "2023-10-18T09:15:00",
        needsSignature: false,
        signed: false,
      },
      {
        id: "doc-2",
        name: "Invention Disclosure Form",
        type: "pdf",
        uploadedBy: "law-firm",
        date: "2023-10-16T11:30:00",
        needsSignature: true,
        signed: false,
      },
      {
        id: "doc-3",
        name: "Prior Art Research",
        type: "pdf",
        uploadedBy: "law-firm",
        date: "2023-10-20T15:45:00",
        needsSignature: false,
        signed: false,
      },
    ],
    messages: [
      {
        id: "msg-1",
        from: "law-firm",
        sender: "Sarah Wilson",
        content:
          "Hello, I've uploaded the initial draft of your application. Please review it when you have a chance and let me know if you have any questions.",
        timestamp: "2023-10-18T09:20:00",
        read: true,
      },
      {
        id: "msg-2",
        from: "client",
        sender: "You",
        content:
          "Thanks Sarah, I'll review it today. Are there specific sections I should pay extra attention to?",
        timestamp: "2023-10-18T10:45:00",
        read: true,
      },
      {
        id: "msg-3",
        from: "law-firm",
        sender: "Sarah Wilson",
        content:
          "Yes, please focus on the technical description in sections 3-5. Make sure it accurately describes your innovation without revealing too much proprietary information.",
        timestamp: "2023-10-18T11:30:00",
        read: true,
      },
    ],
    nextSteps: [
      {
        id: 1,
        text: "Sign and return the Invention Disclosure Form",
        completed: false,
      },
      { id: 2, text: "Review application draft", completed: false },
      { id: 3, text: "Schedule follow-up consultation", completed: false },
    ],
    fees: {
      fixedFees: [
        { description: "Initial Consultation", amount: 190 },
        { description: "Application Filing", amount: 3500 },
      ],
      hourlyRate: 350,
      estimatedTotal: 5000,
    },
  };
};

type CaseDetailsPageProps = {
  params: {
    id: string;
  };
};

const CaseDetailsPage: React.FC<CaseDetailsPageProps> = ({ params }) => {
  const caseData = getCaseById(params.id);
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSignDocument = (docId: string) => {
    console.log("Signing document:", docId);
  };

  const handleCompleteStep = (stepId: number) => {
    console.log("Completing step:", stepId);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CaseHeader
          title={caseData.title}
          lawFirmName={caseData.lawFirmName}
          startDate={caseData.startDate}
          type={caseData.type}
          formatDate={formatDate}
        />

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            messageCount={caseData.messages.length}
            documentCount={caseData.documents.length}
          />

          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab
                caseData={caseData}
                formatDate={formatDate}
                formatTime={formatTime}
                handleCompleteStep={handleCompleteStep}
                handleSignDocument={handleSignDocument}
              />
            )}

            {activeTab === "documents" && (
              <DocumentsTab
                documents={caseData.documents}
                lawFirmName={caseData.lawFirmName}
                formatDate={formatDate}
                handleSignDocument={handleSignDocument}
              />
            )}

            {activeTab === "messages" && (
              <MessagesTab
                messages={caseData.messages}
                formatTime={formatTime}
              />
            )}

            {activeTab === "billing" && <BillingTab fees={caseData.fees} />}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CaseDetailsPage;
