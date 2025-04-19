import Loader from "@/components/common/Loader";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Loader size="xl" />
      <p className="mt-6 text-neutral-700 dark:text-neutral-300 text-lg">
        Loading...
      </p>
    </div>
  );
};

export default Loading;
