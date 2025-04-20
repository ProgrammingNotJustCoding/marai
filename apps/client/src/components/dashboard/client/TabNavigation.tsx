"use client";

import React from "react";

type TabNavigationProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messageCount: number;
  documentCount: number;
};

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  messageCount,
  documentCount,
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-neutral-800">
      <nav className="flex overflow-x-auto">
        <button
          className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            activeTab === "overview"
              ? "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            activeTab === "documents"
              ? "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("documents")}
        >
          Documents ({documentCount})
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            activeTab === "messages"
              ? "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("messages")}
        >
          Messages ({messageCount})
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            activeTab === "billing"
              ? "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("billing")}
        >
          Fees & Billing
        </button>
      </nav>
    </div>
  );
};

export default TabNavigation;
