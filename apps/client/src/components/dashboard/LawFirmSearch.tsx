import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

interface LawFirmSearchProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  allSpecializations: string[];
  selectedSpecializations: string[];
  toggleSpecializationFilter: (spec: string) => void;
}

const LawFirmSearch: React.FC<LawFirmSearchProps> = ({
  searchQuery,
  onSearchChange,
  allSpecializations,
  selectedSpecializations,
  toggleSpecializationFilter,
}) => {
  return (
    <div>
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search for law firms..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="flex items-center mb-4">
        <FaFilter className="mr-2 text-gray-500" />
        <div className="flex space-x-2">
          {allSpecializations.map((spec) => (
            <button
              key={spec}
              onClick={() => toggleSpecializationFilter(spec)}
              className={`
                px-3 py-1 rounded-full text-sm transition-colors
                ${
                  selectedSpecializations.includes(spec)
                    ? "bg-gray-600 text-white"
                    : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
                }
              `}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LawFirmSearch;
