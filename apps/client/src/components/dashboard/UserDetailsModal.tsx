import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEdit2, FiSave } from "react-icons/fi";

type UserDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPasswordUpdateMode, setIsPasswordUpdateMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    mobile: "+1 (123) 456-7890",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordUpdateMode(false);
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-xs">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black dark:bg-black"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xl max-w-md w-full z-10"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Details
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6">
                {!isPasswordUpdateMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={() => setIsPasswordUpdateMode(true)}
                        className="w-full py-2 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded-md text-gray-800 dark:text-white flex items-center justify-center gap-2 transition-colors"
                      >
                        <FiEdit2 />
                        Update Password
                      </button>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white flex items-center gap-2 transition-colors">
                        <FiSave />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPasswordUpdateMode(false)}
                        className="flex-1 py-2 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded-md text-gray-800 dark:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsModal;
