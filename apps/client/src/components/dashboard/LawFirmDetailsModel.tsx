// src/components/LawFirmDetailsModal.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaUserTie,
} from "react-icons/fa";
import { LawFirm } from "../../types/Lawfirm";

interface LawFirmDetailsModalProps {
  lawFirm: LawFirm;
  onClose: () => void;
}

const LawFirmDetailsModal: React.FC<LawFirmDetailsModalProps> = ({
  lawFirm,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-neutral-900 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FaBuilding className="mr-3 text-blue-300" />
            {lawFirm.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2">
              Firm Details
            </h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>{lawFirm.address}</span>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="mr-2" />
                <span>{lawFirm.contactNumber}</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>{lawFirm.email}</span>
              </div>
              <div className="flex items-center">
                <FaGlobe className="mr-2" />
                <span>{lawFirm.website}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2">
              Lawyers
            </h3>
            {lawFirm.lawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-neutral-850 rounded-lg p-4 mb-3"
              >
                <div className="flex items-center mb-2">
                  <FaUserTie className="mr-2 text-blue-500" />
                  <h4 className="font-semibold">{lawyer.name}</h4>
                </div>
                <div className="text-gray-400 space-y-1">
                  <p>Specialization: {lawyer.specialization}</p>
                  <p>Experience: {lawyer.experience} years</p>
                  <p>Contact: {lawyer.contactEmail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LawFirmDetailsModal;
