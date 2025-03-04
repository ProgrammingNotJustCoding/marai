// src/pages/DashboardMain.tsx
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";

import Sidebar from "../dashboard/Sidebar";
import LawFirmSearch from "../dashboard/LawFirmSearch";
import LawFirmCard from "../dashboard/LawFirmCard";
import LawFirmDetailsModal from "../dashboard/LawFirmDetailsModel";

import { lawFirmsData } from "../../data/lawFirmsData";
import { LawFirm } from "../../types/Lawfirm";

const DashboardMain: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [selectedLawFirm, setSelectedLawFirm] = useState<LawFirm | null>(null);

  const allSpecializations = useMemo(() => {
    return [...new Set(lawFirmsData.flatMap((firm) => firm.specializations))];
  }, []);

  const handleSearch = useCallback(
    debounce((query: string) => {
      console.log("Searching for:", query);
    }, 300),
    []
  );

  const filteredLawFirms = useMemo(() => {
    return lawFirmsData.filter(
      (firm) =>
        firm.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedSpecializations.length === 0 ||
          selectedSpecializations.some((spec) =>
            firm.specializations.includes(spec)
          ))
    );
  }, [searchQuery, selectedSpecializations]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const toggleSpecializationFilter = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200">
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <LawFirmSearch
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            allSpecializations={allSpecializations}
            selectedSpecializations={selectedSpecializations}
            toggleSpecializationFilter={toggleSpecializationFilter}
          />

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredLawFirms.map((firm) => (
                <LawFirmCard
                  key={firm.id}
                  firm={firm}
                  onClick={() => setSelectedLawFirm(firm)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {selectedLawFirm && (
            <LawFirmDetailsModal
              lawFirm={selectedLawFirm}
              onClose={() => setSelectedLawFirm(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardMain;
