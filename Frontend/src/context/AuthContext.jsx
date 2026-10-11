import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================
  // GET CURRENT USER
  // =====================================

  const getMe = async () => {
    try {
      const response = await api.get("/auth/me");

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CHECK LOGIN ON APP START
  // =====================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getMe();
    } else {
      setLoading(false);
    }
  }, []);

  // =====================================
  // LOGIN
  // =====================================

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem(
          "token",
          response.data.token
        );

        setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Login failed",
        }
      );
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // =====================================
  // CONTEXT VALUE
  // =====================================

  const value = {
    user,
    loading,
    login,
    logout,
    getMe,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =====================================
// CUSTOM HOOK
// =====================================

export const useAuth = () => {
  return useContext(AuthContext);
};