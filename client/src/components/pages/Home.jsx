import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import StatsDisplay from "./StatsDisplay";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white px-4 py-10 overflow-y-auto">
      {/* greeting the user when logged in */}
      {user && user.name && (
        <h2 className="text-2xl mb-4 text-fuchsia-400 font-semibold text-center">
          Hi, {user.name}!
        </h2>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-400">
        <span className="text-fuchsia-400">Nexus</span> — Create & Play Quizzes
      </h1>

      <p className="text-lg sm:text-xl font-semibold mb-4 text-center text-blue-400">
        Create and manage your Quizzes easily.
      </p>
      <p className="text-lg sm:text-xl font-semibold mb-8 text-center text-blue-400">
        Nexus gives you quick quiz making ability fitted for your dynamic
        workshops, events and many more!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md">
        <Link to="/create" className="w-full">
          <span
            className="px-8 py-3 w-full bg-gradient-to-r from-neutral-100 to-fuchsia-200 
             text-gray-900 font-extrabold rounded-lg shadow-md 
             hover:from-indigo-400 hover:to-purple-500 hover:text-white 
             hover:shadow-xl transform hover:-translate-y-1 
             transition-all duration-300 ease-in-out text-center block"
          >
            Create Quiz
          </span>
        </Link>
        <Link
          to={import.meta.env.VITE_CONNECT}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <span
            className="px-8 py-3 w-full bg-gradient-to-r from-neutral-100 to-fuchsia-200 
             text-gray-900 font-extrabold rounded-lg shadow-md 
             hover:from-indigo-400 hover:to-purple-500 hover:text-white 
             hover:shadow-xl transform hover:-translate-y-1 
             transition-all duration-300 ease-in-out text-center block text-lg"
          >
            &#9829; &nbsp; Connect
          </span>
        </Link>
      </div>
      <div className="bg-gray-800 backdrop-blur-md shadow-lg rounded-2xl p-4 mt-8">
        <StatsDisplay />
      </div>
    </div>
  );
}
