type LoaderProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  centered?: boolean;
};

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className = "",
  centered = false,
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const loader = (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute h-full w-full rounded-full border-4 border-neutral-200 dark:border-neutral-800"></div>
      <div className="absolute h-full w-full rounded-full border-4 border-green-400 border-t-transparent animate-spin"></div>
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
