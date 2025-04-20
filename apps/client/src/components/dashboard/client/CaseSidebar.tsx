"use client";

import React from "react";
import { FiFileText } from "react-icons/fi";

type CaseSidebarProps = {
  caseData: {
    type: string;
    status: string;
    startDate: string;
    lastUpdated: string;
    assignedAttorney: string;
    lawFirmName: string;
    documents: {
      id: string;
      name: string;
      needsSignature: boolean;
      signed: boolean;
    }[];
  };
  formatDate: (dateString: string) => string;
  handleSignDocument: (docId: string) => void;
};

const CaseSidebar: React.FC<CaseSidebarProps> = ({
  caseData,
  formatDate,
  handleSignDocument,
}) => {
  return (
    <div>
      <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-md mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Case Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Case Type:
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {caseData.type}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Status:
            </span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {caseData.status === "active" ? "Active" : "Archived"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Start Date:
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {formatDate(caseData.startDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated:
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {formatDate(caseData.lastUpdated)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-md mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Your Attorney
        </h3>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mr-3">
            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {caseData.assignedAttorney.split(" ")[0][0]}
              {caseData.assignedAttorney.split(" ")[1][0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {caseData.assignedAttorney}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {caseData.lawFirmName}
            </p>
          </div>
        </div>
        <button className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors text-sm">
          Send Message
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-md">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Documents Needing Action
        </h3>

        {caseData.documents.filter((d) => d.needsSignature && !d.signed)
          .length > 0 ? (
          <ul className="space-y-3">
            {caseData.documents
              .filter((d) => d.needsSignature && !d.signed)
              .map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiFileText className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {doc.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSignDocument(doc.id)}
                    className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Sign
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No documents require your signature at this time.
          </p>
        )}
      </div>
    </div>
  );
};

export default CaseSidebar;
