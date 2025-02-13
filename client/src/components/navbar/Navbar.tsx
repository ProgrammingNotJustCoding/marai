const Navbar = () => {
  return (
    <nav className="relative z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-white text-2xl font-bold">marai</span>
          <div className="hidden md:flex items-center gap-6 ">
            <a className="text-white/80 hover:text-white bg-white/10 px-3 py-1 rounded-full transition duration-300 ease-in-out hover:bg-white/30">
              About
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-white/90">Sign in</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
