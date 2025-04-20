"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiInfo,
} from "react-icons/fi";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = {
    success: <FiCheckCircle className="text-green-500 text-xl" />,
    error: <FiXCircle className="text-red-500 text-xl" />,
    warning: <FiAlertCircle className="text-yellow-500 text-xl" />,
    info: <FiInfo className="text-blue-500 text-xl" />,
  };

  const bgColors = {
    success:
      "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 right-4 z-50"
        >
          <div
            className={`border rounded-lg shadow-lg px-4 py-3 flex items-center ${bgColors[type]} max-w-sm`}
          >
            <div className="mr-3">{icons[type]}</div>
            <div className="text-neutral-800 dark:text-neutral-200 flex-1">
              {message}
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100"
            >
              <FiXCircle />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
