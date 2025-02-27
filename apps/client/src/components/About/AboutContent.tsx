import FadeIn from "../common/FadeIn";
import Footer from "../common/Footer";

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

const AboutPage = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Section className="py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 text-center mb-8">
            About Our Platform
          </h1>
          <p className="text-gray-300 text-lg text-center max-w-3xl mx-auto">
            Our platform seamlessly connects clients with legal professionals,
            ensuring they receive expert assistance tailored to their needs.
            Leveraging AI-powered agents, we simplify the legal process,
            providing efficient support and intelligent recommendations.
          </p>
        </div>
      </Section>

      <Section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-100 mb-16">
              How It Works
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Describe Your Needs",
                text: "Tell us about your legal issue, and our AI will guide you to the best options.",
                delay: 200,
              },
              {
                title: "Get Matched Instantly",
                text: "Our AI-powered system connects you with law firms that specialize in your legal matter.",
                delay: 400,
              },
              {
                title: "AI-Driven Support",
                text: "Get real-time assistance from AI agents that help streamline communication and documentation.",
                delay: 600,
              },
            ].map((item, index) => (
              <FadeIn key={index} delay={item.delay}>
                <div className="bg-gray-200 hover:bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-black flex flex-col h-full">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-zinc-950 flex-grow">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-50 mb-16">
              Why Choose Us?
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "24/7", label: "AI-Powered Legal Assistance" },
              { number: "98%", label: "Client Satisfaction Rate" },
              { number: "1000+", label: "Trusted Law Firms" },
            ].map((stat, index) => (
              <FadeIn key={index} delay={300 + index * 150}>
                <div className="bg-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-black text-center">
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

      <Section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">
              Experience Smarter Legal Solutions
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              AI-driven legal support tailored for clients and law firms alike.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-gray-300 text-black hover:bg-white transition-all duration-300 px-8 py-4 rounded-md font-medium shadow-lg">
                Get Started
              </button>
              <button className="bg-transparent text-gray-300 border-2 border-gray-300 hover:bg-gray-300 hover:text-black transition-all duration-300 px-8 py-4 rounded-md font-medium">
                Learn More
              </button>
            </div>
          </FadeIn>
        </div>
      </Section>
      <Footer />
    </div>
  );
};

export default AboutPage;
