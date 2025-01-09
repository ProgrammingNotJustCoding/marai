import React from "react";
import Hero from "../components/home/Hero";
import Footer from "../components/common/Footer";

const Home: React.FC = () => {

  React.useEffect(() => {
    document.title = "Marai"
  }, [])

  return (
      <main className="w-screen h-screen flex flex-col">
        <Hero />
        <Footer />
      </main>
  );
};

export default Home;
