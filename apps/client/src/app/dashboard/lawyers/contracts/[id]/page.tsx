"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiEdit,
  FiDownload,
  FiShare2,
  FiPrinter,
  FiCopy,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/constants";

type ContractDetailsProps = {
  params: {
    id: string;
  };
};

const getContractById = (id: string) => {
  // In a real app, this would be an API call
  return {
    id,
    title:
      id === "contract-001"
        ? "Standard Legal Services Agreement"
        : "IP Protection Agreement",
    description:
      id === "contract-001"
        ? "Standard service agreement for general legal representation"
        : "Contract for intellectual property protection services",
    content: `THIS AGREEMENT is made on [DATE],

BETWEEN:
[LAW FIRM NAME], a law firm organized under the laws of [STATE/JURISDICTION], with its principal office at [ADDRESS] (hereinafter referred to as the "Firm")

AND

[CLIENT NAME], [an individual/a corporation] with [address/principal place of business] at [ADDRESS] (hereinafter referred to as the "Client")

WHEREAS:
A. The Firm is in the business of providing legal services.
B. The Client wishes to engage the Firm to provide certain legal services.
C. The Firm has agreed to provide the legal services to the Client on the terms and conditions of this Agreement.

NOW THEREFORE, in consideration of the mutual covenants contained in this Agreement, the parties agree as follows:

1. SCOPE OF SERVICES
   1.1. The Client engages the Firm to provide the following legal services: [DESCRIPTION OF SERVICES].
   1.2. The Firm shall assign appropriate attorneys and staff to perform the legal services.
   1.3. Additional services not specified in this Agreement may be provided upon mutual agreement of the parties, potentially subject to additional fees.

2. FEES AND BILLING
   2.1. The Client agrees to pay the Firm for legal services at the following rates:
       a) Partner attorneys: $[RATE] per hour
       b) Associate attorneys: $[RATE] per hour
       c) Paralegals: $[RATE] per hour
   2.2. The Client shall pay a retainer of $[AMOUNT] upon execution of this Agreement.
   2.3. The Firm shall send monthly invoices detailing services rendered, time spent, and expenses incurred.
   2.4. Payment is due within 30 days of the invoice date.
   2.5. Interest of 1.5% per month may be charged on overdue amounts.

3. EXPENSES
   3.1. In addition to legal fees, the Client shall reimburse the Firm for all reasonable expenses incurred in connection with the legal services, including but not limited to:
       a) Court filing fees
       b) Deposition costs
       c) Expert witness fees
       d) Travel expenses
       e) Photocopying and document production costs
   3.2. Expenses exceeding $[AMOUNT] shall require prior approval from the Client.

4. TERM AND TERMINATION
   4.1. This Agreement shall commence on the date of execution and continue until the legal services are completed or the Agreement is terminated.
   4.2. The Client may terminate this Agreement at any time by providing written notice to the Firm.
   4.3. The Firm may terminate this Agreement for good cause, including:
       a) Non-payment of fees or expenses
       b) Client's failure to cooperate or follow advice
       c) Client's request to take actions that are illegal or unethical
   4.4. Upon termination, the Client shall pay for all services rendered and expenses incurred up to the termination date.

5. CONFIDENTIALITY
   5.1. The Firm shall maintain the confidentiality of all information provided by the Client in accordance with applicable rules of professional conduct.
   5.2. The Client authorizes the Firm to disclose information as necessary to provide effective representation.

6. CONFLICTS OF INTEREST
   6.1. The Firm has conducted a conflicts check and found no current conflicts of interest.
   6.2. The Client shall promptly inform the Firm of any changes that might create a conflict of interest.

7. CLIENT RESPONSIBILITIES
   7.1. The Client agrees to:
       a) Provide complete and accurate information
       b) Cooperate fully with the Firm
       c) Keep the Firm informed of developments relevant to the legal services
       d) Consider the Firm's advice and recommendations
       e) Promptly pay invoices as provided in this Agreement

8. NO GUARANTEE OF OUTCOME
   8.1. The Firm will use its best efforts in providing legal services but makes no guarantees or promises about the outcome of the matter.

9. DOCUMENT RETENTION
   9.1. The Firm will retain documents related to this matter for [NUMBER] years after completion.
   9.2. Original documents provided by the Client will be returned upon request.

10. GOVERNING LAW
    10.1. This Agreement shall be governed by the laws of [STATE/JURISDICTION].
    10.2. Any disputes arising from this Agreement shall be resolved in the courts of [VENUE].

11. ENTIRE AGREEMENT
    11.1. This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements or understandings.
    11.2. This Agreement may only be modified in writing signed by both parties.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

[LAW FIRM NAME]

By: ________________________
Name: [NAME]
Title: [TITLE]

[CLIENT NAME]

By: ________________________
Name: [NAME]
Title: [TITLE]`,
    createdAt: "2023-11-15T10:30:00",
    updatedAt: "2023-12-01T14:15:00",
    isTemplate: true,
    author: "Jane Wilson",
  };
};

export default function ContractDetails({ params }: ContractDetailsProps) {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchContract = async () => {
      try {
        // In a real application, we would fetch from API
        // const response = await axios.get(`${API_URL}/contracts/${params.id}`);
        // setContract(response.data);

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const contractData = getContractById(params.id);
          setContract(contractData);
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error("Error fetching contract:", error);
        setLoading(false);
      }
    };

    fetchContract();
  }, [params.id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = () => {
    if (contract) {
      navigator.clipboard.writeText(contract.content);
      alert("Contract content copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (contract) {
      const element = document.createElement("a");
      const file = new Blob([contract.content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${contract.title.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
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

  if (!contract) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Contract not found
          </p>
          <Link
            href="/dashboard/lawyers/contracts"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Back to Contracts
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
      >
        <div className="mb-6">
          <Link
            href="/dashboard/lawyers/contracts"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Contracts
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {contract.title}
            </h1>

            <div className="flex space-x-2">
              <button
                onClick={handleCopyToClipboard}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
                title="Copy to clipboard"
              >
                <FiCopy />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
                title="Download"
              >
                <FiDownload />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
                title="Print"
              >
                <FiPrinter />
              </button>
              <button
                onClick={() =>
                  router.push(`/dashboard/lawyers/contracts/${params.id}/edit`)
                }
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full"
                title="Edit"
              >
                <FiEdit />
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-neutral-400 mt-2">
            {contract.description}
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 space-x-4">
            <span>Created: {formatDate(contract.createdAt)}</span>
            <span>Last updated: {formatDate(contract.updatedAt)}</span>
            <span>By: {contract.author}</span>
            {contract.isTemplate && (
              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Template
              </span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {contract.content}
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
