import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const register = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Fixed SignOut function that actually calls backend & removes user
  const signOut = async () => {
    if (!user || !token) {
      console.warn("No user or token found — skipping delete request");
      logout();
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("User deleted successfully.");
      logout(); // clear local session
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
