// src/components/LawFirmCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
import { LawFirm } from "../../types/Lawfirm";
interface LawFirmCardProps {
  firm: LawFirm;
  onClick: () => void;
}

const LawFirmCard: React.FC<LawFirmCardProps> = ({ firm, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onClick}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 cursor-pointer hover:bg-neutral-850 transition-colors"
    >
      <div className="flex items-center mb-4">
        <FaBuilding className="mr-3 text-gray-300" />
        <h3 className="text-xl font-semibold">{firm.name}</h3>
      </div>
      <div className="space-y-2 text-gray-400">
        <p>Established: {firm.established}</p>
        <p>Specializations: {firm.specializations.join(", ")}</p>
        <p>Lawyers: {firm.lawyers.length}</p>
      </div>
    </motion.div>
  );
};

export default LawFirmCard;
