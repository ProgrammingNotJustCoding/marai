"use client";

import { useTheme } from "next-themes";
import { LuSun } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";

const Theme: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="text-2xl hover:cursor-pointer "
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <IoMoonOutline color="white" />
        ) : (
          <LuSun color="black" />
        )}
      </button>
    </div>
  );
};

export default Theme;
