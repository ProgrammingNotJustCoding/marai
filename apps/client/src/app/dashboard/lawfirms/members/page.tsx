"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiMail,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";
import DashboardLayout from "@/layouts/DashboardLayout";
import { API_URL } from "@/utils/constants";

type Member = {
  id: string;
  lawFirmId: string;
  roleId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberImageUrl?: string;
  memberBannerUrl?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type Role = {
  id: string;
  name: string;
};

const MembersPage: React.FC = () => {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Record<string, Role>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lawFirmId, setLawFirmId] = useState("");

  useEffect(() => {
    const fetchedLawFirmId = localStorage.getItem("lawFirmId");

    if (fetchedLawFirmId) {
      setLawFirmId(fetchedLawFirmId);
      fetchRoles(fetchedLawFirmId);
      fetchMembers(fetchedLawFirmId);
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
        // Convert to a map for easy lookup
        const rolesMap: Record<string, Role> = {};
        data.data.forEach((role: Role) => {
          rolesMap[role.id] = role;
        });
        setRoles(rolesMap);
      }
    } catch (err: any) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchMembers = async (firmId: string) => {
    try {
      const response = await fetch(`${API_URL}/lawfirms/${firmId}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("__token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();

      if (data.data) {
        setMembers(data.data);
      } else {
        setMembers([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-6 h-6 border-2 border-t-green-600 border-gray-200 rounded-full animate-spin mr-2"></div>
        <p>Loading members...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Link href="/dashboard/lawfirm/members/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <FiPlus />
            <span>Add Member</span>
          </button>
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-8 text-center">
          <div className="flex flex-col items-center">
            <FiAlertCircle className="text-4xl text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-2">No members found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't added any team members to your law firm yet.
            </p>
            <Link href="/dashboard/lawfirm/members/new">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <FiPlus />
                <span>Add First Member</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {member.memberImageUrl ? (
                    <img
                      src={member.memberImageUrl}
                      alt={member.memberName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 text-xl font-bold">
                      {getInitials(member.memberName)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-lg">{member.memberName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {roles[member.roleId]?.name || "Unknown Role"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-500 dark:text-gray-400" />
                    <a
                      href={`mailto:${member.memberEmail}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {member.memberEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-500 dark:text-gray-400" />
                    <a href={`tel:${member.memberPhone}`} className="text-sm">
                      {member.memberPhone}
                    </a>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-neutral-700 flex justify-end gap-2">
                  <button
                    className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    title="Edit member"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete member"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MembersPage;
