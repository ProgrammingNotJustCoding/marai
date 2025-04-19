import React from "react";
import Image from "next/image";
import {
  FiMapPin,
  FiStar,
  FiUsers,
  FiBriefcase,
  FiClock,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

type LawfirmProps = {
  id: string;
  name: string;
  imageUrl: string;
  categories: string[];
  location: string;
  established: number;
  attorneys: number;
  rating: number;
  consultationFee: string;
};

const LawfirmCard: React.FC<LawfirmProps> = ({
  id,
  name,
  imageUrl,
  categories,
  location,
  established,
  attorneys,
  rating,
  consultationFee,
}) => {
  const router = useRouter();
  const yearsEstablished = new Date().getFullYear() - established;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col h-full">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>

          <div className="flex flex-wrap gap-1 mt-2">
            {categories.map((category, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-gray-500 dark:text-neutral-500" />
              <span>{location}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiBriefcase className="text-gray-500 dark:text-neutral-500" />
              <span>
                Est. {established} ({yearsEstablished} years)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FiUsers className="text-gray-500 dark:text-neutral-500" />
              <span>{attorneys} attorneys</span>
            </div>

            <div className="flex items-center gap-2">
              <FiStar className="text-yellow-500" />
              <span className="text-gray-700 dark:text-neutral-300">
                {rating}/5 client rating
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FiClock className="text-gray-500 dark:text-neutral-500" />
              <span>From ${consultationFee} consultation fee</span>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={() => router.push(`/dashboard/lawfirms/${id}`)}
              className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawfirmCard;
