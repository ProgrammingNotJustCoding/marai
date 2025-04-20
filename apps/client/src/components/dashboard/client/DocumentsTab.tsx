"use client";

import React from "react";
import { FiDownload, FiFileText, FiUpload } from "react-icons/fi";

type Document = {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  date: string;
  needsSignature: boolean;
  signed: boolean;
};

type DocumentsTabProps = {
  documents: Document[];
  lawFirmName: string;
  formatDate: (dateString: string) => string;
  handleSignDocument: (docId: string) => void;
};

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  lawFirmName,
  formatDate,
  handleSignDocument,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Case Documents
        </h2>
        <button className="flex items-center px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
          <FiUpload className="mr-2" />
          Upload Document
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Document Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Date Added
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Added By
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiFileText className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(doc.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {doc.uploadedBy === "law-firm" ? lawFirmName : "You"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {doc.needsSignature ? (
                    doc.signed ? (
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                        Signed
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full">
                        Needs Signature
                      </span>
                    )
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      Informational
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mr-3">
                    <FiDownload />
                  </button>
                  {doc.needsSignature && !doc.signed && (
                    <button
                      onClick={() => handleSignDocument(doc.id)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      Sign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentsTab;
