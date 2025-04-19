import { motion } from "framer-motion";

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-green-600 dark:bg-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 lg:mb-0 lg:mr-8"
          >
            <h2 className="text-3xl font-bold text-white dark:text-neutral-900 mb-4">
              Ready to transform your legal practice?
            </h2>
            <p className="text-green-50 dark:text-neutral-800 text-lg max-w-2xl">
              Join thousands of legal professionals already using Marai to
              streamline workflows, enhance client communication, and leverage
              AI for better outcomes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="px-8 py-3 bg-white text-green-600 hover:bg-green-50 rounded-md font-medium transition-colors">
              Schedule a Demo
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 dark:bg-transparent dark:border-neutral-900 dark:text-neutral-900 dark:hover:bg-neutral-900/10 rounded-md font-medium transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
