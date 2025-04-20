import Image from "next/image";
import { motion } from "framer-motion";

type DescriptionProps = {
  title: string;
  content: string;
  imageUrl: string;
  orientation: "left" | "right";
  isPrimary?: boolean;
};

const Description: React.FC<DescriptionProps> = ({
  title,
  content,
  imageUrl,
  orientation,
  isPrimary = false,
}) => {
  return (
    <div
      className={`flex flex-col ${
        isPrimary ? "lg:min-h-[500px]" : "lg:min-h-[400px]"
      } ${orientation === "left" ? "lg:flex-row" : "lg:flex-row-reverse"}`}
    >
      <motion.div
        initial={{ opacity: 0, x: orientation === "left" ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center p-6 lg:p-12"
      >
        <h2
          className={`${
            isPrimary ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl"
          } font-bold mb-4 text-neutral-900 dark:text-white`}
        >
          {title}
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed">
          {content}
        </p>
        {isPrimary && (
          <div className="mt-8">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 text-white dark:text-neutral-900 rounded-md font-medium transition-colors">
              Get Started
            </button>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: orientation === "left" ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 z-10 opacity-50 light:opacity-60 dark:opacity-0"
          style={{
            background: `linear-gradient(to ${
              orientation === "left" ? "right" : "left"
            }, rgba(255,255,255,0), rgba(245,245,245,0.7))`,
          }}
        />

        <div
          className="absolute inset-0 z-10 opacity-0 dark:opacity-60"
          style={{
            background: `linear-gradient(to ${
              orientation === "left" ? "right" : "left"
            }, rgba(0,0,0,0), rgba(10,10,10,0.7))`,
          }}
        />

        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={isPrimary}
        />
      </motion.div>
    </div>
  );
};

export default Description;
