import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaUserTie,
  FaArrowLeft,
} from "react-icons/fa";
import { LawFirm } from "../../types/Lawfirm";
import { lawFirmsData } from "../../data/lawFirmsData";
import Sidebar from "./Sidebar";

const LawFirmDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lawFirm, setLawFirm] = useState<LawFirm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const firm = lawFirmsData.find((firm) => firm.id === id);
    setLawFirm(firm || null);
    setLoading(false);
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="text-xl">Loading...</div>
        </div>
      );
    }

    if (!lawFirm) {
      return (
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="text-xl mb-4">Law firm not found</div>
          <Link
            to="/dashboard"
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Return to Dashboard
          </Link>
        </div>
      );
    }

    return (
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <FaBuilding className="mr-3 text-blue-300" />
              {lawFirm.name}
            </h2>
            <Link
              to="/dashboard"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
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

                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <h4 className="font-semibold mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {lawFirm.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-gray-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <h4 className="font-semibold mb-2">Established</h4>
                  <p>{lawFirm.established}</p>
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
                  className="bg-neutral-800 rounded-lg p-4 mb-3"
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
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200">
      <Sidebar />
      {renderContent()}
    </div>
  );
};

export default LawFirmDetailsPage;
