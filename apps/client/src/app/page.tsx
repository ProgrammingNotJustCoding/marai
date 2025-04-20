"use client";

import Navbar from "@/components/home/Navbar";
import Description from "@/components/home/Description";
import FeatureGrid from "@/components/home/FeatureGrid";
import CallToAction from "@/components/home/CallToAction";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="bg-neutral-50 dark:bg-neutral-950">
        <section className="pt-32 pb-16">
          <Description
            title="Streamline Your Legal Practice with Marai"
            content="Marai is a cloud-based architecture designed to streamline legal consultations and case file management for clients and law firms. It enables seamless communication between clients and legal consultants, allowing clients to request legal guidance, submit case files for review, and receive AI-powered insights. The system ensures secure storage, efficient case file compression, and retrieval through a distributed and scalable infrastructure."
            imageUrl="/images/legal-hero.jpg"
            orientation="right"
            isPrimary={true}
          />
        </section>

        <section id="features" className="py-16 flex flex-col gap-16">
          <Description
            title="Workflow Management for Law Firms"
            content="Optimize your firm's operations with customizable workflows that automate routine tasks, track case progress, and ensure nothing falls through the cracks. Our workflow management tools are designed specifically for legal professionals to increase efficiency and reduce administrative burden."
            imageUrl="/images/workflow.jpg"
            orientation="left"
          />

          <Description
            title="Contract Lifecycle Management"
            content="From drafting to execution and renewal, Marai provides comprehensive contract management capabilities. Utilize AI-powered contract analysis, automated approval workflows, and centralized repositories to ensure compliance and maximize the value of your agreements."
            imageUrl="/images/contract.jpg"
            orientation="right"
          />
        </section>

        <FeatureGrid />

        <section id="about" className="pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-neutral-600 dark:text-neutral-400 italic">
              We are currently developing the Marai platform.
            </p>
          </div>
        </section>

        <CallToAction />

        <footer
          id="contact"
          className="py-12 bg-neutral-100 dark:bg-neutral-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Marai
                </h3>
                <p className="text-neutral-700 dark:text-neutral-400">
                  A modern solution for legal practices
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Contact
                </h3>
                <p className="text-neutral-700 dark:text-neutral-400">
                  contact@marai.com
                  <br />
                  123 Legal Street
                  <br />
                  Suite 456
                  <br />
                  San Francisco, CA 94105
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Legal
                </h3>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-600 dark:hover:text-green-400"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-600 dark:hover:text-green-400"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-600 dark:hover:text-green-400"
                    >
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-neutral-600 dark:text-neutral-500">
              &copy; {new Date().getFullYear()} Marai. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
