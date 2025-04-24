"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiFileText,
  FiDollarSign,
  FiChevronLeft,
  FiPaperclip,
  FiSend,
  FiDownload,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiUpload,
  FiSave,
} from "react-icons/fi";
import Link from "next/link";
import { API_URL } from "@/utils/constants";

type CaseDetails = {
  id: string;
  clientName: string;
  clientEmail: string;
  topic: string;
  status: string;
  createdAt: string;
  description: string;
  nextDeadline: string;
  nextDeadlineTask: string;
};

type Message = {
  id: string;
  sender: "client" | "lawyer";
  content: string;
  timestamp: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: string;
  }[];
};

type Document = {
  id: string;
  name: string;
  uploadedBy: "client" | "lawyer";
  uploadedAt: string;
  size: string;
  type: string;
  url: string;
};

type BillingInfo = {
  hourlyRate: number;
  initialConsultationFee: number;
  retainerAmount: number;
  billableHoursToDate: number;
  totalBilled: number;
  totalPaid: number;
  nextInvoiceDate: string;
};

export default function CaseDetails() {
  const { caseId } = useParams();
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(true);
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [editingBilling, setEditingBilling] = useState(false);
  const [updatedBilling, setUpdatedBilling] = useState<BillingInfo | null>(
    null,
  );
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        // In a real app, we would fetch from API
        // const response = await fetch(`${API_URL}/cases/${caseId}`);

        // Mock data for demonstration
        setTimeout(() => {
          const mockCaseDetails: CaseDetails = {
            id: caseId as string,
            clientName: "Sarah Williams",
            clientEmail: "sarah.w@example.com",
            topic: "Patent Application",
            status: "active",
            createdAt: "2023-11-20T13:00:00",
            description:
              "Assistance with filing a patent for a new AI-based technology solution.",
            nextDeadline: "2023-12-15T00:00:00",
            nextDeadlineTask: "Complete initial patent application draft",
          };

          const mockMessages: Message[] = [
            {
              id: "msg-001",
              sender: "client",
              content:
                "Hello, I'd like to discuss the first steps for our patent application.",
              timestamp: "2023-11-21T10:30:00",
            },
            {
              id: "msg-002",
              sender: "lawyer",
              content:
                "Good morning, Sarah. I've reviewed your initial description. Let's schedule a call to discuss the technical aspects in more detail.",
              timestamp: "2023-11-21T11:15:00",
            },
            {
              id: "msg-003",
              sender: "client",
              content:
                "That sounds good. Are you available tomorrow afternoon?",
              timestamp: "2023-11-21T11:30:00",
            },
            {
              id: "msg-004",
              sender: "lawyer",
              content:
                "Yes, I can do 2 PM. I'm also attaching our standard patent questionnaire. If you could fill this out before our call, it would help streamline the process.",
              timestamp: "2023-11-21T11:45:00",
              attachments: [
                {
                  id: "attach-001",
                  name: "Patent_Questionnaire.pdf",
                  url: "#",
                  size: "245 KB",
                },
              ],
            },
            {
              id: "msg-005",
              sender: "client",
              content:
                "Great, I've reviewed the questionnaire and I'm attaching it here along with some diagrams of the technology.",
              timestamp: "2023-11-22T13:20:00",
              attachments: [
                {
                  id: "attach-002",
                  name: "Completed_Questionnaire.pdf",
                  url: "#",
                  size: "310 KB",
                },
                {
                  id: "attach-003",
                  name: "Technology_Diagrams.zip",
                  url: "#",
                  size: "4.2 MB",
                },
              ],
            },
            {
              id: "msg-006",
              sender: "lawyer",
              content:
                "Thank you for these materials. I'll review them before our call tomorrow. Based on what I see so far, we should be able to draft the initial application by next week.",
              timestamp: "2023-11-22T14:05:00",
            },
          ];

          const mockDocuments: Document[] = [
            {
              id: "doc-001",
              name: "Patent_Questionnaire.pdf",
              uploadedBy: "lawyer",
              uploadedAt: "2023-11-21T11:45:00",
              size: "245 KB",
              type: "application/pdf",
              url: "#",
            },
            {
              id: "doc-002",
              name: "Completed_Questionnaire.pdf",
              uploadedBy: "client",
              uploadedAt: "2023-11-22T13:20:00",
              size: "310 KB",
              type: "application/pdf",
              url: "#",
            },
            {
              id: "doc-003",
              name: "Technology_Diagrams.zip",
              uploadedBy: "client",
              uploadedAt: "2023-11-22T13:20:00",
              size: "4.2 MB",
              type: "application/zip",
              url: "#",
            },
            {
              id: "doc-004",
              name: "Prior_Art_Research.pdf",
              uploadedBy: "lawyer",
              uploadedAt: "2023-11-23T09:15:00",
              size: "1.8 MB",
              type: "application/pdf",
              url: "#",
            },
            {
              id: "doc-005",
              name: "Draft_Patent_Application_v1.docx",
              uploadedBy: "lawyer",
              uploadedAt: "2023-11-28T15:40:00",
              size: "720 KB",
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              url: "#",
            },
          ];

          const mockBillingInfo: BillingInfo = {
            hourlyRate: 275,
            initialConsultationFee: 500,
            retainerAmount: 3000,
            billableHoursToDate: 7.5,
            totalBilled: 2562.5,
            totalPaid: 3500,
            nextInvoiceDate: "2023-12-15T00:00:00",
          };

          setCaseDetails(mockCaseDetails);
          setMessages(mockMessages);
          setDocuments(mockDocuments);
          setBillingInfo(mockBillingInfo);
          setUpdatedBilling(mockBillingInfo);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching case details:", error);
        setLoading(false);
      }
    };

    setLoading(false);

    if (caseId) {
      fetchCaseDetails();
    }
  }, [caseId]);

  useEffect(() => {
    // Scroll to bottom of messages when they change
    if (messagesEndRef.current && activeTab === "chat") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "lawyer",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      attachments:
        uploadingFiles.length > 0
          ? uploadingFiles.map((file, idx) => ({
              id: `attach-new-${idx}`,
              name: file.name,
              url: "#", // In a real app, we'd upload and get a URL
              size: `${(file.size / 1024).toFixed(0)} KB`,
            }))
          : undefined,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setUploadingFiles([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setUploadingFiles([...uploadingFiles, ...filesArray]);
    }
  };

  const handleRemoveUploadingFile = (index: number) => {
    const newFiles = [...uploadingFiles];
    newFiles.splice(index, 1);
    setUploadingFiles(newFiles);
  };

  const handleUploadDocument = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);

      // In a real app, you would upload these files to your server
      // For demo, we'll just add them to the documents list
      const newDocs = filesArray.map((file) => ({
        id: `doc-new-${Date.now()}-${file.name}`,
        name: file.name,
        uploadedBy: "lawyer" as const,
        uploadedAt: new Date().toISOString(),
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.type,
        url: "#", // In a real app, this would be the uploaded file URL
      }));

      setDocuments([...documents, ...newDocs]);
    }
  };

  const handleBillingUpdate = () => {
    if (updatedBilling) {
      setBillingInfo(updatedBilling);
      setEditingBilling(false);
      // In a real app, you would send this update to your API
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("doc")) return "📝";
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return "📊";
    if (fileType.includes("zip") || fileType.includes("archive")) return "🗄️";
    if (fileType.includes("image")) return "🖼️";
    return "📁";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!caseDetails) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Case Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested case does not exist or you don&apos;t have permission
            to view it.
          </p>
          <Link
            href="/dashboard/lawyers/cases"
            className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Return to All Cases
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Back button and case header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <Link
              href="/dashboard/lawyers/cases"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 mb-2"
            >
              <FiChevronLeft className="mr-1" /> Back to all cases
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {caseDetails.topic}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Client: {caseDetails.clientName} ({caseDetails.clientEmail})
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                caseDetails.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {caseDetails.status === "active" ? "Active" : "Closed"}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Opened on {formatDate(caseDetails.createdAt)}
            </span>
          </div>
        </div>

        {/* Case description */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Case Description:
          </h3>
          <p className="text-gray-800 dark:text-gray-200">
            {caseDetails.description}
          </p>

          {caseDetails.nextDeadline && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
              <div className="flex items-center text-sm">
                <FiCalendar className="text-gray-500 dark:text-gray-400 mr-2" />
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Next deadline:{" "}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDate(caseDetails.nextDeadline)} -{" "}
                    {caseDetails.nextDeadlineTask}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-neutral-800">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("chat")}
              className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "chat"
                  ? "border-green-500 text-green-600 dark:text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FiMessageSquare className="mr-2" />
                Client Communication
              </div>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "documents"
                  ? "border-green-500 text-green-600 dark:text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FiFileText className="mr-2" />
                Documents
              </div>
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "billing"
                  ? "border-green-500 text-green-600 dark:text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FiDollarSign className="mr-2" />
                Billing & Fees
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[60vh]">
          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-[60vh]">
              <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-t-lg p-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">
                      No messages yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "lawyer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.sender === "lawyer"
                              ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">
                              {message.sender === "lawyer"
                                ? "Me"
                                : caseDetails.clientName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {formatDateTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>

                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  Attachments:
                                </p>
                                <div className="space-y-2">
                                  {message.attachments.map((attachment) => (
                                    <div
                                      key={attachment.id}
                                      className="flex items-center bg-white dark:bg-gray-700 p-2 rounded text-sm"
                                    >
                                      <FiPaperclip className="mr-2 text-gray-500 dark:text-gray-400" />
                                      <div className="flex-1 overflow-hidden">
                                        <p className="truncate">
                                          {attachment.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {attachment.size}
                                        </p>
                                      </div>
                                      <button className="ml-2 p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
                                        <FiDownload size={16} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Uploading files preview */}
              {uploadingFiles.length > 0 && (
                <div className="bg-gray-50 dark:bg-neutral-800 border-l border-r border-gray-200 dark:border-neutral-700 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Attachments to send:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uploadingFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white dark:bg-gray-700 p-2 rounded text-sm"
                      >
                        <FiPaperclip className="mr-2 text-gray-500" />
                        <span className="truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <button
                          className="ml-2 text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveUploadingFile(index)}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message input */}
              <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 border-t-0 rounded-b-lg p-4">
                <div className="flex items-end">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center text-gray-500 hover:text-green-600 dark:text-gray-400"
                      >
                        <FiPaperclip className="mr-1" /> Attach files
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                          multiple
                        />
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Press Enter to send
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && uploadingFiles.length === 0}
                    className="ml-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Case Documents
                </h2>
                <button
                  onClick={handleUploadDocument}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  <FiUpload className="mr-2" /> Upload Document
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleDocumentUpload}
                  />
                </button>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No documents uploaded yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Uploaded By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                      {documents.map((doc) => (
                        <tr
                          key={doc.id}
                          className="hover:bg-gray-50 dark:hover:bg-neutral-800"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="mr-2">
                                {getFileIcon(doc.type)}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {doc.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {doc.uploadedBy === "lawyer"
                                ? "Me"
                                : caseDetails.clientName}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDateTime(doc.uploadedAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {doc.size}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <FiDownload size={18} />
                              </button>
                              <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && billingInfo && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Billing and Fee Information
                </h2>
                {!editingBilling ? (
                  <button
                    onClick={() => setEditingBilling(true)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Edit Fee Structure
                  </button>
                ) : (
                  <button
                    onClick={handleBillingUpdate}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    <FiSave className="mr-2" /> Save Changes
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Fee Structure
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hourly Rate
                      </label>
                      {editingBilling ? (
                        <div className="flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 mr-2">
                            $
                          </span>
                          <input
                            type="number"
                            value={updatedBilling?.hourlyRate}
                            onChange={(e) =>
                              setUpdatedBilling({
                                ...updatedBilling!,
                                hourlyRate: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-700 rounded-md px-3 py-2 w-32"
                          />
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            / hour
                          </span>
                        </div>
                      ) : (
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          ${billingInfo.hourlyRate}{" "}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            / hour
                          </span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Initial Consultation Fee
                      </label>
                      {editingBilling ? (
                        <div className="flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 mr-2">
                            $
                          </span>
                          <input
                            type="number"
                            value={updatedBilling?.initialConsultationFee}
                            onChange={(e) =>
                              setUpdatedBilling({
                                ...updatedBilling!,
                                initialConsultationFee:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                            className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-700 rounded-md px-3 py-2 w-32"
                          />
                        </div>
                      ) : (
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          ${billingInfo.initialConsultationFee}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Retainer Amount
                      </label>
                      {editingBilling ? (
                        <div className="flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 mr-2">
                            $
                          </span>
                          <input
                            type="number"
                            value={updatedBilling?.retainerAmount}
                            onChange={(e) =>
                              setUpdatedBilling({
                                ...updatedBilling!,
                                retainerAmount: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-700 rounded-md px-3 py-2 w-32"
                          />
                        </div>
                      ) : (
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          ${billingInfo.retainerAmount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Billing Summary
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Billable Hours to Date
                      </label>
                      <div className="flex items-center">
                        <FiClock className="text-gray-500 dark:text-gray-400 mr-2" />
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {billingInfo.billableHoursToDate} hours
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Total Billed
                        </span>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">
                          ${billingInfo.totalBilled.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-700 dark:text-gray-300">
                          Total Paid
                        </span>
                        <span className="text-xl font-semibold text-green-600 dark:text-green-500">
                          ${billingInfo.totalPaid.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-700 dark:text-gray-300">
                          Balance
                        </span>
                        <span
                          className={`text-xl font-semibold ${
                            billingInfo.totalPaid - billingInfo.totalBilled >= 0
                              ? "text-green-600 dark:text-green-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          $
                          {(
                            billingInfo.totalPaid - billingInfo.totalBilled
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Next Invoice Date
                      </label>
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-500 dark:text-gray-400 mr-2" />
                        <p className="text-gray-900 dark:text-white">
                          {formatDate(billingInfo.nextInvoiceDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Actions
                </h3>
                <div className="flex space-x-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    Generate Invoice
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                    Record Payment
                  </button>
                  <button className="border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 px-4 py-2 rounded-md">
                    Payment History
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
