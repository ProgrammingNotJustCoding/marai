import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full h-20 bg-black flex items-center justify-center px-4">
      <p className="text-white text-center text-sm md:text-base">
        © {new Date().getFullYear()} Marai
      </p>
    </footer>
  );
};

export default Footer;
