"use client";

import React, { useState, useEffect } from "react";
import { FiActivity, FiUsers, FiFileText, FiClock } from "react-icons/fi";
import DashboardLayout from "@/layouts/DashboardLayout";

const Lawfirms: React.FC = () => {
  const [stats, setStats] = useState({
    roles: 0,
    members: 0,
    cases: 0,
    consultations: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        roles: 5,
        members: 12,
        cases: 24,
        consultations: 18,
      });
    }, 1000);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your law firm management dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Roles
                </p>
                <h3 className="text-2xl font-bold mt-1">{stats.roles}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FiUsers className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Team Members
                </p>
                <h3 className="text-2xl font-bold mt-1">{stats.members}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <FiUsers className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Active Cases
                </p>
                <h3 className="text-2xl font-bold mt-1">{stats.cases}</h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FiFileText className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Consultations
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {stats.consultations}
                </h3>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                <FiClock className="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 border-b border-gray-100 dark:border-neutral-700 pb-4"
                >
                  <div className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-full">
                    <FiActivity className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">New role created</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      2 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors">
                <FiUsers className="text-xl mb-2 text-green-600 dark:text-green-400" />
                <span className="text-sm">Add Member</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors">
                <FiUsers className="text-xl mb-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">Create Role</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors">
                <FiFileText className="text-xl mb-2 text-purple-600 dark:text-purple-400" />
                <span className="text-sm">New Case</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors">
                <FiClock className="text-xl mb-2 text-amber-600 dark:text-amber-400" />
                <span className="text-sm">Schedule Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Lawfirms;
