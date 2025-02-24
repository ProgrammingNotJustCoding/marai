import React, { useEffect, useState, useRef } from "react";

const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};

const FadeIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.15 }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, [delay]);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

const Section = ({
  children,
  className = "",
  id = "",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section id={id} className={`relative ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-600 to-transparent opacity-20"></div>
      {children}
    </section>
  );
};

const HomePage = () => {
  const heroTitle = useTypewriter(
    "Connect with the right legal expertise for your needs"
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x:hidden">
      {!isLoaded && (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}

      <Section className="py-20 bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6 h-32">
                {heroTitle}
                <span className="animate-pulse">|</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Our platform bridges the gap between clients seeking legal
                assistance and law firms offering specialized expertise.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-gray-300 text-black hover:bg-white transition-all duration-300 px-8 py-3 rounded-md font-medium shadow-md hover:shadow-lg">
                  Find Legal Help
                </button>
                <button className="bg-transparent text-gray-300 border-2 border-gray-300 hover:bg-gray-300 hover:text-black transition-all duration-300 px-8 py-3 rounded-md font-medium shadow-md hover:shadow-lg">
                  For Law Firms
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Dheekshi add image here */}
              <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Hero Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-16 bg-neutral-950" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-100 mb-16">
              How It Works
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={200}>
              <div className="bg-gray-200 hover:bg-slate-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-black rounded-full text-white flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Describe Your Legal Needs
                </h3>
                <p className="text-zinc-950">
                  Tell us about your situation and what kind of legal assistance
                  you're looking for.
                </p>
                {/* Dheekshi image here */}
                <div className="w-24 h-24 bg-gray-200 mx-auto mt-4 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Icon 1</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="bg-gray-200 hover:bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-black rounded-full text-white flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Get Matched With Law Firms
                </h3>
                <p className="text-zinc-950">
                  Our algorithm matches you with law firms specializing in your
                  specific legal matter.
                </p>
                {/* Dheekshi Image */}
                <div className="w-24 h-24 bg-gray-200 mx-auto mt-4 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Icon 2</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={600}>
              <div className="bg-gray-200 hover:bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-black rounded-full text-white flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Connect & Resolve
                </h3>
                <p className="text-zinc-950">
                  Communicate directly with selected law firm and get the legal
                  support you need.
                </p>
                {/* Dheekshi image */}
                <div className="w-24 h-24 bg-gray-200 mx-auto mt-4 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Icon 3</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      <Section className="py-16 bg-neutral-950" id="success-stories">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-50 mb-16">
              Success Stories
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={300}>
              <div className="bg-gray-200 hover:bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-2 duration-300">
                <div className="flex items-center mb-6">
                  {/* Add random face pics */}
                  <div className="w-16 h-16 bg-gray-400 rounded-full mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-black">
                      Sarah Johnson
                    </h4>
                    <p className="text-gray-600">Small Business Owner</p>
                  </div>
                </div>
                <p className="text-zinc-950 italic">
                  "Finding the right legal counsel for my startup was
                  overwhelming until I used Marai. Within days, I was connected
                  with a law firm that specialized in exactly what I needed."
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="bg-gray-200 p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  {/* Add random face pics*/}
                  <div className="w-16 h-16 bg-gray-400 rounded-full mr-4"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-black">
                      Robert Chen
                    </h4>
                    <p className="text-gray-600">
                      Partner at Chen & Associates
                    </p>
                  </div>
                </div>
                <p className="text-zinc-950 italic">
                  "As a specialized law firm, connecting with the right clients
                  was always a challenge. Through Marai, we've been able to help
                  clients who truly need our specific expertise."
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      <Section className="py-16 bg-neutral-950" id="practice-areas">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">
              Practice Areas
            </h2>
            <p className="text-center text-gray-300 mb-12">
              Connect with firms specializing in these and many other legal
              areas
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "Family Law",
              "Business Law",
              "Criminal Defense",
              "Immigration",
              "Personal Injury",
              "Real Estate",
              "Intellectual Property",
              "Estate Planning",
            ].map((area, index) => (
              <FadeIn key={area} delay={200 + index * 100}>
                <div className="bg-gray-200 rounded-lg p-5 text-center hover:bg-gray-50 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  {/* icons */}
                  <div className="w-10 h-10 bg-black rounded mx-auto mb-3"></div>
                  <h3 className="font-medium text-zinc-950">{area}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-20 bg-neutral-950 text-white" id="cta">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">
              Ready to find your legal match?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of clients and law firms already using our
              platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-gray-300 text-black hover:bg-white transition-all duration-300 px-8 py-4 rounded-md font-medium shadow-lg">
                Get Started Now
              </button>
              <button className="bg-transparent text-gray-300 border-2 border-gray-300 hover:bg-gray-300 hover:text-black transition-all duration-300 px-8 py-4 rounded-md font-medium">
                Learn More
              </button>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section className="py-16 bg-neutral-950" id="stats">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5,000+", label: "Clients Served" },
              { number: "750+", label: "Law Firms" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <FadeIn key={stat.label} delay={300 + index * 150}>
                <div className="bg-gray-200 hover:bg-gray-50 p-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-zinc-950">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
