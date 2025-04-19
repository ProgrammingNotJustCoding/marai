"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCalendar, FiClock, FiInfo } from "react-icons/fi";

const getLawFirmById = (id: string) => {
  return {
    id: "6",
    name: "Wilson Intellectual Property",
    consultationFee: "190",
  };
};

type BookConsultationPageProps = {
  params: {
    lawfirmId: string;
  };
};

const BookConsultationPage: React.FC<BookConsultationPageProps> = ({
  params,
}) => {
  const router = useRouter();
  const lawFirm = getLawFirmById(params.lawfirmId);
  const [caseDetails, setCaseDetails] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDates = [
    "2023-11-15",
    "2023-11-16",
    "2023-11-17",
    "2023-11-20",
    "2023-11-21",
    "2023-11-22",
  ];

  const availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push(
      `/dashboard/consultation-request-confirmation/${lawFirm.id}?date=${selectedDate}&time=${selectedTime}`,
    );
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-300 mb-4 hover:text-gray-900 dark:hover:text-white"
        >
          <FiArrowLeft className="mr-2" /> Back to firm profile
        </button>

        <div className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-800">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Book a Consultation with {lawFirm.name}
            </h1>

            <div className="flex items-center mt-2 mb-6 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-md">
              <FiInfo className="mr-2 flex-shrink-0" />
              <p className="text-sm">
                Consultation fee: ${lawFirm.consultationFee} for a 1-hour
                initial consultation
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="caseDetails"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Brief description of your case
                  </label>
                  <textarea
                    id="caseDetails"
                    rows={5}
                    className="w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-gray-900 dark:text-white focus:border-green-500 focus:ring-green-500"
                    placeholder="Please provide a brief summary of your legal matter..."
                    value={caseDetails}
                    onChange={(e) => setCaseDetails(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        <span>Select a date</span>
                      </div>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableDates.map((date) => (
                        <button
                          key={date}
                          type="button"
                          className={`py-2 px-4 border rounded-md text-center ${
                            selectedDate === date
                              ? "bg-green-600 text-white border-green-600"
                              : "border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <FiClock className="mr-2" />
                        <span>Select a time</span>
                      </div>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`py-2 px-4 border rounded-md text-center ${
                            selectedTime === time
                              ? "bg-green-600 text-white border-green-600"
                              : "border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
                          }`}
                          onClick={() => setSelectedTime(time)}
                          disabled={!selectedDate}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
                  <button
                    type="submit"
                    disabled={
                      !caseDetails ||
                      !selectedDate ||
                      !selectedTime ||
                      isSubmitting
                    }
                    className={`w-full md:w-auto px-6 py-3 rounded-md text-white transition-colors ${
                      !caseDetails ||
                      !selectedDate ||
                      !selectedTime ||
                      isSubmitting
                        ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Request Consultation"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default BookConsultationPage;
