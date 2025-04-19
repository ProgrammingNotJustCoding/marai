"use client";

import React from "react";
import { FiFileText, FiMessageSquare } from "react-icons/fi";
import CaseSidebar from "./CaseSidebar";
import NextStepsItem from "./NextStepsItem";

type Document = {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  date: string;
  needsSignature: boolean;
  signed: boolean;
};

type Message = {
  id: string;
  from: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
};

type NextStep = {
  id: number;
  text: string;
  completed: boolean;
};

type OverviewTabProps = {
  caseData: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    startDate: string;
    lastUpdated: string;
    lawFirmName: string;
    assignedAttorney: string;
    documents: Document[];
    messages: Message[];
    nextSteps: NextStep[];
  };
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  handleCompleteStep: (stepId: number) => void;
  handleSignDocument: (docId: string) => void;
};

const OverviewTab: React.FC<OverviewTabProps> = ({
  caseData,
  formatDate,
  formatTime,
  handleCompleteStep,
  handleSignDocument,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Case Description
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {caseData.description}
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Next Steps
        </h2>
        <ul className="space-y-3 mb-6">
          {caseData.nextSteps.map((step) => (
            <NextStepsItem
              key={step.id}
              step={step}
              handleCompleteStep={handleCompleteStep}
            />
          ))}
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Recent Activity
        </h2>
        <div className="border border-gray-200 dark:border-neutral-800 rounded-md">
          <div className="border-b border-gray-200 dark:border-neutral-800 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md mr-3">
                  <FiFileText className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Document uploaded: Prior Art Research
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(caseData.documents[2].date)} at{" "}
                    {formatTime(caseData.documents[2].date)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200 dark:border-neutral-800 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md mr-3">
                  <FiMessageSquare className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New message from Sarah Wilson
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(caseData.messages[2].timestamp)} at{" "}
                    {formatTime(caseData.messages[2].timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md mr-3">
                  <FiFileText className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Document uploaded: Application Draft
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(caseData.documents[0].date)} at{" "}
                    {formatTime(caseData.documents[0].date)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CaseSidebar
        caseData={caseData}
        formatDate={formatDate}
        handleSignDocument={handleSignDocument}
      />
    </div>
  );
};

export default OverviewTab;
