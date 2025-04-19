"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiUser,
  FiSearch,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiBriefcase,
} from "react-icons/fi";
import UserDetailsModal from "@/components/dashboard/UserDetailsModal";
import Theme from "@/components/common/Theme";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const navItems = [
    { icon: <FiSearch />, label: "Find Law Firms", href: "/dashboard" },
    {
      icon: <FiCalendar />,
      label: "Consultations",
      href: "/dashboard/consultations",
    },
    { icon: <FiBriefcase />, label: "My Cases", href: "/dashboard/cases" },
    { icon: <FiSettings />, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <div className="fixed top-8 right-5">
        <Theme />
      </div>
      <div className="w-64 bg-gray-100 dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              Marai
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    pathname === item.href
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center w-full gap-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="relative w-10 h-10 rounded-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center">
              <FiUser className="text-lg" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium truncate">John Doe</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400 truncate">
                john@example.com
              </p>
            </div>
            <FiChevronDown className="text-gray-500 dark:text-neutral-400" />
          </button>

          <button className="mt-3 flex items-center gap-2 w-full px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800 text-red-500 dark:text-red-400 transition-colors">
            <FiLogOut />
            <span>Log out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-950">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>

      <UserDetailsModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
