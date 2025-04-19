import React, { useState } from "react";
import { FiSliders, FiChevronDown } from "react-icons/fi";

type Category = {
  id: string;
  name: string;
};

type LocationOption = {
  id: string;
  name: string;
};

const categories: Category[] = [
  { id: "family", name: "Family Law" },
  { id: "criminal", name: "Criminal Defense" },
  { id: "immigration", name: "Immigration" },
  { id: "real-estate", name: "Real Estate" },
  { id: "corporate", name: "Corporate Law" },
  { id: "intellectual", name: "Intellectual Property" },
  { id: "tax", name: "Tax Law" },
  { id: "labor", name: "Labor & Employment" },
];

const locations: LocationOption[] = [
  { id: "nyc", name: "New York City" },
  { id: "la", name: "Los Angeles" },
  { id: "chicago", name: "Chicago" },
  { id: "houston", name: "Houston" },
  { id: "phoenix", name: "Phoenix" },
  { id: "philadelphia", name: "Philadelphia" },
  { id: "san-antonio", name: "San Antonio" },
  { id: "san-diego", name: "San Diego" },
];

type LawfirmFiltersProps = {
  onFilterChange: (filters: {
    categories: string[];
    location: string | null;
    establishment: number | null;
    rating: number | null;
  }) => void;
};

const LawfirmFilters: React.FC<LawfirmFiltersProps> = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [minEstablishment, setMinEstablishment] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value === "" ? null : e.target.value);
  };

  const handleEstablishmentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMinEstablishment(parseInt(e.target.value));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinRating(parseInt(e.target.value));
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      location: selectedLocation,
      establishment: minEstablishment > 0 ? minEstablishment : null,
      rating: minRating > 0 ? minRating : null,
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLocation(null);
    setMinEstablishment(0);
    setMinRating(0);
    onFilterChange({
      categories: [],
      location: null,
      establishment: null,
      rating: null,
    });
  };

  return (
    <div className="mb-6">
      <button
        className="md:hidden w-full flex items-center justify-between p-3 mb-4 bg-gray-100 dark:bg-neutral-900 rounded-md"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        <div className="flex items-center gap-2">
          <FiSliders />
          <span>Filters</span>
        </div>
        <FiChevronDown
          className={`transform transition ${showMobileFilters ? "rotate-180" : ""}`}
        />
      </button>

      <div className={`md:block ${showMobileFilters ? "block" : "hidden"}`}>
        <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-sm dark:shadow-none border border-gray-200 dark:border-neutral-800">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2">
              Practice Areas
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 accent-green-500 bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-600"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-neutral-300 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2">
              Location
            </h3>
            <select
              value={selectedLocation || ""}
              onChange={handleLocationChange}
              className="w-full p-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2">
              Years Established
            </h3>
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-neutral-300">
                  Min. Years: {minEstablishment}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={minEstablishment}
                onChange={handleEstablishmentChange}
                className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-neutral-500 mt-1">
                <span>0</span>
                <span>25</span>
                <span>50+</span>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2">
              Client Rating
            </h3>
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-neutral-300">
                  Min. Rating: {minRating}/5
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={minRating}
                onChange={handleRatingChange}
                className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-neutral-500 mt-1">
                <span>Any</span>
                <span>3★</span>
                <span>5★</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={resetFilters}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded text-gray-700 dark:text-neutral-300 transition-colors text-sm"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white transition-colors text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawfirmFilters;
