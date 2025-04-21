"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiUser,
  FiSearch,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiBriefcase,
  FiUsers,
  FiPlusCircle,
  FiLayers,
  FiHome,
  FiUserCheck,
  FiUserPlus,
  FiShield,
  FiFile,
  FiMessageCircle,
} from "react-icons/fi";
import UserDetailsModal from "@/components/dashboard/UserDetailsModal";
import Theme from "@/components/common/Theme";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

type User = {
  name: string;
  email: string;
  role: "admin" | "lawfirm" | "lawyer" | "client";
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedUser = localStorage.getItem("__user");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          const defaultUser = {
            name: "Demo User",
            email: "demo@example.com",
            role: "lawfirm",
          };

          localStorage.setItem("__user", JSON.stringify(defaultUser));
          setUser(defaultUser as User);
        }

        if (!localStorage.getItem("lawfirmId")) {
          router.push("/auth");
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        setUser({
          name: "Demo User",
          email: "demo@example.com",
          role: "lawfirm",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const getNavItems = (role: string) => {
    switch (role) {
      case "admin":
        return [
          { icon: <FiHome />, label: "Dashboard", href: "/dashboard/admin" },
          {
            icon: <FiLayers />,
            label: "Law Firms",
            href: "/dashboard/admin/lawfirms",
          },
          {
            icon: <FiUsers />,
            label: "Lawyers",
            href: "/dashboard/admin/lawyers",
          },
          {
            icon: <FiUsers />,
            label: "Clients",
            href: "/dashboard/admin/clients",
          },
          {
            icon: <FiPlusCircle />,
            label: "Add Law Firm",
            href: "/dashboard/admin/add-lawfirm",
          },
          {
            icon: <FiSettings />,
            label: "Settings",
            href: "/dashboard/admin/settings",
          },
          {
            icon: <FiMessageCircle />,
            label: "AI Chat",
            href: "/dashboard/ai-chat",
          },
        ];

      case "lawfirm":
        return [
          {
            icon: <FiHome />,
            label: "Dashboard",
            href: "/dashboard/lawfirms",
          },
          {
            icon: <FiShield />,
            label: "Roles",
            href: "/dashboard/lawfirms/roles",
          },
          {
            icon: <FiPlusCircle />,
            label: "Add Role",
            href: "/dashboard/lawfirms/add-role",
          },
          {
            icon: <FiUsers />,
            label: "Members",
            href: "/dashboard/lawfirms/members",
          },
          {
            icon: <FiUserPlus />,
            label: "Add Member",
            href: "/dashboard/lawfirms/add-member",
          },
          {
            icon: <FiUserCheck />,
            label: "Our Lawyers",
            href: "/dashboard/lawfirms/lawyers",
          },
          {
            icon: <FiUsers />,
            label: "Our Clients",
            href: "/dashboard/lawfirms/clients",
          },
          {
            icon: <FiCalendar />,
            label: "Consultations",
            href: "/dashboard/lawfirms/consultations",
          },
          {
            icon: <FiSettings />,
            label: "Settings",
            href: "/dashboard/lawfirms/settings",
          },
          {
            icon: <FiMessageCircle />,
            label: "AI Chat",
            href: "/dashboard/ai-chat",
          },
        ];

      case "lawyer":
        return [
          {
            icon: <FiHome />,
            label: "Dashboard",
            href: "/dashboard/lawyers",
          },
          {
            icon: <FiCalendar />,
            label: "Consultations",
            href: "/dashboard/lawyers/consultations",
          },
          {
            icon: <FiBriefcase />,
            label: "Cases",
            href: "/dashboard/lawyers/cases",
          },
          {
            icon: <FiFile />,
            label: "Contracts",
            href: "/dashboard/lawyers/contracts",
          },
          {
            icon: <FiUsers />,
            label: "My Clients",
            href: "/dashboard/lawyers/clients",
          },
          {
            icon: <FiSettings />,
            label: "Settings",
            href: "/dashboard/lawyers/settings",
          },
          {
            icon: <FiMessageCircle />,
            label: "AI Chat",
            href: "/dashboard/ai-chat",
          },
        ];

      case "client":
      default:
        return [
          {
            icon: <FiSearch />,
            label: "Find Law Firms",
            href: "/dashboard/client/lawfirms",
          },
          {
            icon: <FiCalendar />,
            label: "My Consultations",
            href: "/dashboard/client/consultations",
          },
          {
            icon: <FiBriefcase />,
            label: "My Cases",
            href: "/dashboard/client/cases",
          },
          {
            icon: <FiSettings />,
            label: "Settings",
            href: "/dashboard/client/settings",
          },
          {
            icon: <FiMessageCircle />,
            label: "AI Chat",
            href: "/dashboard/ai-chat",
          },
        ];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("__token");
    localStorage.removeItem("__user");
    window.location.href = "/auth";
  };

  const setRole = (role: User["role"]) => {
    if (user) {
      const updatedUser = { ...user, role };
      localStorage.setItem("__user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const redirectToDashboard = () => {
    if (user) {
      const basePath = `/dashboard/${user.role.toLowerCase()}`;
      window.location.href = basePath;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-green-600 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const navItems = user ? getNavItems(user.role) : [];

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <div className="fixed top-8 right-5 z-10">
        <Theme />
      </div>
      <div className="w-64 bg-gray-100 dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
          <button onClick={redirectToDashboard} className="flex items-center">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              Marai
            </span>
          </button>
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

          {user && (
            <div className="mt-6 px-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-4">
                Demo: Switch Role
              </p>
              <div className="flex flex-wrap gap-2 px-4">
                <button
                  onClick={() => setRole("client")}
                  className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                >
                  Client
                </button>
                <button
                  onClick={() => setRole("lawyer")}
                  className="px-2 py-1 text-xs rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                >
                  Lawyer
                </button>
                <button
                  onClick={() => setRole("lawfirm")}
                  className="px-2 py-1 text-xs rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                >
                  Law Firm
                </button>
                <button
                  onClick={() => setRole("admin")}
                  className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                >
                  Admin
                </button>
              </div>
            </div>
          )}
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
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400 capitalize">
                {user?.role}
              </p>
            </div>
            <FiChevronDown className="text-gray-500 dark:text-neutral-400" />
          </button>

          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 w-full px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800 text-red-500 dark:text-red-400 transition-colors"
          >
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
        user={user}
      />
    </div>
  );
};

export default DashboardLayout;
