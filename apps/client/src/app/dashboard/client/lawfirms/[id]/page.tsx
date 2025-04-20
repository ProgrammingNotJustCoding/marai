"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiStar,
  FiUsers,
  FiBriefcase,
  FiArrowLeft,
} from "react-icons/fi";

const getLawFirmById = (id: string) => {
  return {
    id: "6",
    name: "Wilson Intellectual Property",
    imageUrl: "/images/logo-white.png",
    categories: ["Intellectual Property", "Patents"],
    location: "Seattle",
    established: 1998,
    attorneys: 15,
    rating: 4.8,
    consultationFee: "190",
    description:
      "Wilson Intellectual Property is a leading firm specializing in patent law, trademark registration, and copyright protection. Our team of experienced attorneys has been serving clients across the United States since 1998.",
    expertise: [
      "Patent Applications and Prosecution",
      "Trademark Registration and Defense",
      "Copyright Protection",
      "Intellectual Property Litigation",
      "Licensing and Technology Transfers",
    ],
    attorneyDetails: [
      {
        name: "Sarah Wilson",
        title: "Founding Partner",
        specialization: "Patents",
      },
      {
        name: "Michael Chang",
        title: "Senior Partner",
        specialization: "Trademarks",
      },
      {
        name: "Jennifer Lee",
        title: "Associate",
        specialization: "Copyright Law",
      },
    ],
  };
};

type LawFirmProfilePageProps = {
  params: {
    id: string;
  };
};

const LawFirmProfilePage: React.FC<LawFirmProfilePageProps> = ({ params }) => {
  const router = useRouter();
  const lawFirm = getLawFirmById(params.id);
  const yearsEstablished = new Date().getFullYear() - lawFirm.established;

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
          <FiArrowLeft className="mr-2" /> Back to results
        </button>

        <div className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-800">
          <div className="relative h-64 bg-gradient-to-r from-green-700 to-green-500">
            <div className="absolute inset-0 flex items-center justify-center">
              {lawFirm.imageUrl && (
                <div className="h-32 w-32 relative">
                  <Image
                    src={lawFirm.imageUrl}
                    alt={lawFirm.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {lawFirm.name}
              </h1>
              <div className="flex items-center mt-2 md:mt-0">
                <FiStar className="text-yellow-500 mr-1" />
                <span className="text-gray-700 dark:text-neutral-300 font-semibold">
                  {lawFirm.rating}/5 client rating
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {lawFirm.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-gray-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-500 dark:text-neutral-500" />
                <span>{lawFirm.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <FiBriefcase className="text-gray-500 dark:text-neutral-500" />
                <span>
                  Est. {lawFirm.established} ({yearsEstablished} years)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FiUsers className="text-gray-500 dark:text-neutral-500" />
                <span>{lawFirm.attorneyDetails?.length || 0} attorneys</span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                About the firm
              </h2>
              <p className="text-gray-600 dark:text-neutral-400">
                {lawFirm.description}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Areas of Expertise
              </h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-neutral-400">
                {lawFirm.expertise.map((item, index) => (
                  <li key={index} className="mb-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Key Attorneys
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lawFirm.attorneyDetails.map((attorney: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {attorney.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {attorney.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      {attorney.specialization}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-neutral-800 pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Consultation Fee
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400">
                    Initial consultation from ${lawFirm.consultationFee}
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/client/book-consultation/${lawFirm.id}`,
                    )
                  }
                  className="mt-4 md:mt-0 px-6 py-3 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
                >
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default LawFirmProfilePage;
