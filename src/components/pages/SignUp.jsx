import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 3 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        { name, email, password },
      );
      console.log("User registered");

      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        password: data.user.password,
        token: data.token,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      register(userData, userData.token);

      alert("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setErrors({
        general: err.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-fuchsia-400 mb-6 text-center">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`p-3 rounded-lg w-full bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                errors.name ? "focus:ring-red-500" : "focus:ring-fuchsia-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`p-3 rounded-lg w-full bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-fuchsia-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`p-3 rounded-lg w-full bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                errors.password
                  ? "focus:ring-red-500"
                  : "focus:ring-fuchsia-400"
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-400 text-sm text-center mt-1">
              {errors.general}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 px-4 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-2xl font-semibold transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
