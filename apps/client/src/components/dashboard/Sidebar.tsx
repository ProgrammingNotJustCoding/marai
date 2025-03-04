import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaBuilding,
  FaSignOutAlt,
  FaHome,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}) => (
  <div
    className={`
      flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300
      ${
        active
          ? "bg-gray-600 text-white"
          : "text-gray-400 hover:bg-neutral-800 hover:text-gray-200"
      }
    `}
    onClick={onClick}
  >
    <Icon className="mr-3" />
    <span className="text-sm">{label}</span>
  </div>
);

const Sidebar: React.FC = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menuItems = [
    { icon: FaHome, label: "Dashboard" },
    { icon: FaBuilding, label: "Law Firms" },
    { icon: FaClipboardList, label: "Cases" },
    { icon: FaCog, label: "Settings" },
  ];

  const handleProfileClick = () => {
    setShowLogout(!showLogout);
  };

  return (
    <div className="w-64 h-screen bg-neutral-900 text-white flex flex-col justify-between p-5 border-r border-neutral-800">
      <div className="mb-8 flex items-center justify-center">
        <FaBuilding className="mr-2 text-blue-200" size={24} />
        <h1 className="text-xl font-bold text-white">Marai</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeMenu === item.label}
            onClick={() => setActiveMenu(item.label)}
          />
        ))}
      </nav>

      <div className="flex flex-col items-center relative">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mb-4"
        >
          <FaUserCircle
            size={40}
            onClick={handleProfileClick}
            className="cursor-pointer text-gray-400 hover:text-white transition-colors"
          />
        </motion.div>

        <AnimatePresence>
          {showLogout && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full mb-2 w-full"
            >
              <div
                className="
                  p-3 bg-neutral-800 rounded-lg 
                  flex items-center justify-center 
                  cursor-pointer hover:bg-red-600 
                  transition-colors text-sm
                "
                onClick={() => {
                  alert("Logging out...");
                }}
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;
