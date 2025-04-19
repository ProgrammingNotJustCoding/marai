import { motion } from "framer-motion";
import {
  FiFileText,
  FiUsers,
  FiLayers,
  FiBriefcase,
  FiCpu,
  FiClock,
} from "react-icons/fi";

const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <FiFileText className="h-6 w-6" />,
      title: "Document Management",
      description:
        "Efficiently organize, store, and retrieve legal documents with advanced search capabilities.",
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: "Client Portal",
      description:
        "Secure client access portal for seamless communication and file sharing.",
    },
    {
      icon: <FiLayers className="h-6 w-6" />,
      title: "Case Management",
      description:
        "Comprehensive case tracking from intake to resolution with customizable workflows.",
    },
    {
      icon: <FiBriefcase className="h-6 w-6" />,
      title: "Legal Marketplace",
      description:
        "Access specialized services and resources through our integrated legal marketplace.",
    },
    {
      icon: <FiCpu className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description:
        "Leverage artificial intelligence to gain insights and streamline case preparation.",
    },
    {
      icon: <FiClock className="h-6 w-6" />,
      title: "Time & Billing",
      description:
        "Simplified time tracking and billing processes to maximize billable hours.",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Comprehensive Legal Practice Management
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Marai offers an all-in-one solution designed specifically for modern
            legal practices
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border-2 border-white dark:border-neutral-900 duration-200 ease-in-out hover:border-green-600 dark:hover:border-green-400"
            >
              <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
