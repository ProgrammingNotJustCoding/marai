const Layout = () => {
  return (
    <div>
      <nav className="bg-black shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <a className="text-3xl font-bold text-gray-300" href="/">
                Marai
              </a>
            </div>

            <div className="hidden md:flex">
              <a
                href="/about"
                className="text-gray-300 hover:text-white px-4 py-2 text-lg font-medium transition-all duration-300 ease-in-out hover:scale-105 border-b-2 border-transparent hover:border-gray-300"
              >
                About
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="bg-black text-white hover:bg-white hover:text-black px-4 py-2 rounded-md text-lg font-medium transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                Login
              </a>
              <a
                href="/sign_up"
                className="bg-black text-white hover:bg-white hover:text-black px-4 py-2 rounded-md text-lg font-medium transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
