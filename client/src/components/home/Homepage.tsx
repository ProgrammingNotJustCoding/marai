import { ArrowRight, FileText, MessageCircle, Calendar } from "lucide-react";
import Navbar from "../navbar/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 animate-gradient-xy" />
      <Navbar />
      <main className="relative z-10 px-6 pt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Legal infrastructure for seamless client collaboration
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-md">
              Join the leading law firms that use Marai to streamline client
              communications, automate document workflows, and build more
              efficient practices.
            </p>
            <button className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-800 flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-bl-full opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-gray-800">
                  Legal Document Review
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="h-2 w-24 bg-purple-200 rounded mb-2" />
                  <div className="h-2 w-48 bg-gray-200 rounded" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <MessageCircle className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="h-2 w-20 bg-blue-200 rounded" />
                  </div>

                  <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <Calendar className="w-5 h-5 text-purple-600 mb-2" />
                    <div className="h-2 w-20 bg-purple-200 rounded" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-gray-500">
                  Client reviewing...
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes gradient-xy {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
