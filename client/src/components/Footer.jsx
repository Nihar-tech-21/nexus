import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  // 👩‍💻 console message easter egg
  useEffect(() => {
    console.log("👋 Hi, I’m Niharika — Creator of Nexus!");
  }, []);

  return (
    <footer className="w-full bg-gray-950/90 backdrop-blur-sm text-gray-300 py-6 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
        {/* Left Section */}
        <p className="text-sm text-center md:text-left text-gray-400">
          Made with <span className="text-fuchsia-400">❤️</span> by{" "}
          <span className="text-blue-400 font-semibold">Niharika</span>
        </p>

        {/* Center Links (optional professional touch) */}
        <div className="flex space-x-4 text-sm">
          <Link
            to="/"
            className="hover:text-fuchsia-300 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/create"
            className="hover:text-fuchsia-300 transition-colors duration-200"
          >
            Create Quiz
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-fuchsia-300 transition-colors duration-200"
          >
            Dashboard
          </Link>
        </div>

        {/* Right Section */}
        <p className="text-sm text-center md:text-right text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-fuchsia-400 font-semibold">Nexus</span>. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
