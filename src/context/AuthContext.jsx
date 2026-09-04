import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token"),
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("user_role") || null,
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !userRole) {
      api
        .get("accounts/auth/me/")
        .then((res) => {
          setUserRole(res.data.role);
          localStorage.setItem("user_role", res.data.role);
        })
        .catch((error) => {
          console.error("Failed to fetch role on load:", error);
        });
    }
  }, [isAuthenticated, userRole]);

  const login = async (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    try {
      const res = await api.get("accounts/auth/me/");
      const role = res.data.role;

      localStorage.setItem("user_role", role);

      setUserRole(role);
      setIsAuthenticated(true);

      if (role === "hr") {
        navigate("/hr/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch role during login:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
