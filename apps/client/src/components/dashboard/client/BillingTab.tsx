"use client";

import React from "react";
import { FiInfo } from "react-icons/fi";

type Fee = {
  description: string;
  amount: number;
};

type BillingTabProps = {
  fees: {
    fixedFees: Fee[];
    hourlyRate: number;
    estimatedTotal: number;
  };
};

const BillingTab: React.FC<BillingTabProps> = ({ fees }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Fees Structure
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-start">
          <FiInfo className="text-blue-600 dark:text-blue-400 mr-3 mt-1" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Legal fees for this case are broken down below. If you have
            questions about any charges, please contact your attorney directly.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Fee Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
            {fees.fixedFees.map((fee, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {fee.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  ${fee.amount}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                Hourly Rate (for additional work)
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                ${fees.hourlyRate}/hour
              </td>
            </tr>
            <tr className="bg-gray-50 dark:bg-neutral-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Estimated Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900 dark:text-white">
                ${fees.estimatedTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Payment History
        </h2>

        <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-md text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No payments have been recorded yet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
