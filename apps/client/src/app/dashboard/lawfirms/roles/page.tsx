"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import DashboardLayout from "@/layouts/DashboardLayout";
import { API_URL } from "@/utils/constants";

type Role = {
  id: string;
  name: string;
  lawFirmId: string;
  permRead: boolean;
  permWrite: boolean;
  permManage: boolean;
  permAdmin: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

const RolesPage: React.FC = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lawFirmId, setLawFirmId] = useState("");

  useEffect(() => {
    const fetchedLawFirmId = localStorage.getItem("lawFirmId");

    if (fetchedLawFirmId) {
      setLawFirmId(fetchedLawFirmId);
      fetchRoles(fetchedLawFirmId);
    } else {
      setError("Law firm ID not found");
      setLoading(false);
    }
  }, []);

  const fetchRoles = async (firmId: string) => {
    try {
      const response = await fetch(`${API_URL}/lawfirms/${firmId}/roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("__token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await response.json();

      if (data.data) {
        setRoles(data.data);
      } else {
        setRoles([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const PermissionIndicator = ({ enabled }: { enabled: boolean }) => (
    <div
      className={`flex items-center ${enabled ? "text-green-500" : "text-red-500"}`}
    >
      {enabled ? (
        <FiCheckCircle className="mr-1" />
      ) : (
        <FiXCircle className="mr-1" />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-6 h-6 border-2 border-t-green-600 border-gray-200 rounded-full animate-spin mr-2"></div>
        <p>Loading roles...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Roles Management</h1>
          <Link href="/dashboard/lawfirm/roles/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <FiPlus />
              <span>Add Role</span>
            </button>
          </Link>
        </div>

        {roles.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-8 text-center">
            <div className="flex flex-col items-center">
              <FiAlertCircle className="text-4xl text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-2">No roles found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't created any roles for your law firm yet.
              </p>
              <Link href="/dashboard/lawfirm/roles/new">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  <FiPlus />
                  <span>Create First Role</span>
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Read
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Write
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Manage
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {roles.map((role) => (
                    <tr
                      key={role.id}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{role.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(role.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <PermissionIndicator enabled={role.permRead} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <PermissionIndicator enabled={role.permWrite} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <PermissionIndicator enabled={role.permManage} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <PermissionIndicator enabled={role.permAdmin} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/lawfirm/members/new?roleId=${role.id}`}
                          >
                            <button
                              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Add member with this role"
                            >
                              <FiPlus />
                            </button>
                          </Link>
                          <button
                            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title="Edit role"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete role"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RolesPage;
