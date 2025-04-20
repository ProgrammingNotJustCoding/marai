"use client";

import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

type CaseHeaderProps = {
  title: string;
  lawFirmName: string;
  startDate: string;
  type: string;
  formatDate: (dateString: string) => string;
};

const CaseHeader: React.FC<CaseHeaderProps> = ({
  title,
  lawFirmName,
  startDate,
  type,
  formatDate,
}) => {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.push("/dashboard/cases")}
        className="flex items-center text-gray-600 dark:text-gray-300 mb-4 hover:text-gray-900 dark:hover:text-white"
      >
        <FiArrowLeft className="mr-2" /> Back to all cases
      </button>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>

            <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400">
              <span>Handled by {lawFirmName}</span>
              <span className="mx-2">•</span>
              <span>Case opened on {formatDate(startDate)}</span>
            </div>
          </div>

          <div className="mt-3 sm:mt-0">
            <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
              {type}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseHeader;
