"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiAlertTriangle } from "react-icons/fi";
import DashboardLayout from "@/layouts/DashboardLayout";
import { API_URL } from "@/utils/constants";

const AddRole: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    lawFirmId: "",
    permRead: true,
    permWrite: false,
    permManage: false,
    permFirmAdmin: false,
  });

  useEffect(() => {
    // Get the lawFirmId from localStorage
    const lawFirmId = localStorage.getItem("lawFirmId");
    if (lawFirmId) {
      setFormData((prev) => ({ ...prev, lawFirmId }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      setError("Role name is required");
      return;
    }

    if (!formData.lawFirmId) {
      setError("Law firm ID is missing");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/lawfirms/${formData.lawFirmId}/roles/new`,
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
        throw new Error(data.message || "Failed to create role");
      }

      setSuccess("Role created successfully");
      setTimeout(() => {
        router.push(`/dashboard/lawfirm/roles`);
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
        <h1 className="text-2xl font-bold mb-6">Create New Role</h1>

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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-700"
                placeholder="Enter role name"
                required
              />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Permissions</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permRead"
                    name="permRead"
                    checked={formData.permRead}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600"
                  />
                  <label
                    htmlFor="permRead"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Read Access - Can view records and data
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permWrite"
                    name="permWrite"
                    checked={formData.permWrite}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600"
                  />
                  <label
                    htmlFor="permWrite"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Write Access - Can create and edit records
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permManage"
                    name="permManage"
                    checked={formData.permManage}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600"
                  />
                  <label
                    htmlFor="permManage"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Manage Access - Can add/remove team members
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permFirmAdmin"
                    name="permFirmAdmin"
                    checked={formData.permFirmAdmin}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600"
                  />
                  <label
                    htmlFor="permFirmAdmin"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Admin Access - Full control over firm settings
                  </label>
                </div>
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
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>Create Role</span>
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

export default AddRole;
