"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSave, FiAlertTriangle } from "react-icons/fi";
import DashboardLayout from "@/layouts/DashboardLayout";
import { API_URL } from "@/utils/constants";

type Role = {
  id: string;
  name: string;
};

const AddMember: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    roleId: "",
    memberName: "",
    memberEmail: "",
    memberPhone: "",
  });
  const [lawFirmId, setLawFirmId] = useState("");

  useEffect(() => {
    const firmId = localStorage.getItem("lawFirmId");

    if (firmId) {
      setLawFirmId(firmId);
      fetchRoles(firmId);

      // Get roleId from query params if available
      const roleId = searchParams?.get("roleId");
      if (roleId) {
        setFormData((prev) => ({ ...prev, roleId }));
      }
    } else {
      setError("Law firm ID not found");
    }
  }, [searchParams]);

  const fetchRoles = async (firmId: string) => {
    try {
      const response = await fetch(`${API_URL}/lawfirms/${firmId}/roles`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await response.json();

      if (data.data) {
        setRoles(data.data);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.memberName ||
      !formData.memberEmail ||
      !formData.memberPhone ||
      !formData.roleId
    ) {
      setError("All fields are required");
      return;
    }

    if (!lawFirmId) {
      setError("Law firm ID is missing");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/lawfirms/${lawFirmId}/members/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("__token")}`,
          },
          body: JSON.stringify(formData),
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create member");
      }

      setSuccess("Member added successfully");
      setTimeout(() => {
        router.push(`/dashboard/lawfirm/members`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Member</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-3 text-red-700 dark:text-red-400">
            <FiAlertTriangle />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="roleId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Role *
                </label>
                <select
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="memberName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="memberName"
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700"
                  placeholder="Enter member's full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="memberEmail"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="memberEmail"
                  name="memberEmail"
                  value={formData.memberEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="memberPhone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="memberPhone"
                  name="memberPhone"
                  value={formData.memberPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>Add Member</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddMember;
