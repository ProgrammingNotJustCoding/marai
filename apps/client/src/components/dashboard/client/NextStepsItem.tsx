"use client";

import React from "react";
import { FiCheck } from "react-icons/fi";

type NextStepItemProps = {
  step: {
    id: number;
    text: string;
    completed: boolean;
  };
  handleCompleteStep: (stepId: number) => void;
};

const NextStepsItem: React.FC<NextStepItemProps> = ({
  step,
  handleCompleteStep,
}) => {
  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-md">
      <div className="flex items-center">
        <div
          className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
            step.completed
              ? "bg-green-500"
              : "border border-gray-300 dark:border-neutral-600"
          }`}
        >
          {step.completed && <FiCheck className="text-white text-xs" />}
        </div>
        <span
          className={`${
            step.completed
              ? "text-gray-500 dark:text-gray-500 line-through"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {step.text}
        </span>
      </div>

      {!step.completed && (
        <button
          onClick={() => handleCompleteStep(step.id)}
          className="text-sm text-green-600 dark:text-green-400 hover:underline"
        >
          Mark as done
        </button>
      )}
    </li>
  );
};

export default NextStepsItem;
