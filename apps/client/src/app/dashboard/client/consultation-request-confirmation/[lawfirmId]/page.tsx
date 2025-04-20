"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import { FiCheck, FiCalendar, FiClock, FiArrowRight } from "react-icons/fi";

const getLawFirmById = (id: string) => {
  return {
    id: "6",
    name: "Wilson Intellectual Property",
    consultationFee: "190",
  };
};

type Props = {
  params: {
    lawfirmId: string;
  };
};

const ConsultationRequestConfirmationPage: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lawFirm = getLawFirmById(params.lawfirmId);

  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-800">
          <div className="p-6">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <FiCheck className="text-green-600 dark:text-green-400 text-3xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Consultation Request Sent!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your consultation request has been sent to {lawFirm.name}.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg mb-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                Consultation Details
              </h2>

              <div className="space-y-3">
                <div className="flex items-start">
                  <FiCalendar className="text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Date
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiClock className="text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Time
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{time}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-6 mb-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                What happens next?
              </h2>

              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>The law firm will review your consultation request</li>
                <li>
                  They&apos;ll either confirm your selected time or propose
                  alternatives
                </li>
                <li>
                  Once confirmed, you&apos;ll receive a notification and it will
                  appear in your consultations
                </li>
                <li>
                  You&apos;ll be able to prepare for your consultation by
                  providing additional details
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => router.push("/dashboard/client")}
                className="px-6 py-2 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded-md text-gray-800 dark:text-white transition-colors"
              >
                Return to Dashboard
              </button>

              <button
                onClick={() => router.push("/dashboard/client/consultations")}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white transition-colors flex items-center justify-center"
              >
                View My Consultations <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ConsultationRequestConfirmationPage;
