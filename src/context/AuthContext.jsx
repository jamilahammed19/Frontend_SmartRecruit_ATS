import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("user_role") || null
  );
  
  const navigate = useNavigate();

  // 1. Fetch role on page reload
  useEffect(() => {
    if (isAuthenticated && !userRole) {
      // FIXED: Added 'accounts/' to match your Django URL perfectly
      api.get('accounts/auth/me/')
        .then(res => {
          setUserRole(res.data.role);
          localStorage.setItem('user_role', res.data.role);
        })
        .catch(error => {
          console.error("Failed to fetch role on load:", error);
        });
    }
  }, [isAuthenticated, userRole]);

  // 2. Updated Login Function: No more infinite loops!
  const login = async (accessToken, refreshToken) => {
    // Save tokens silently first
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    try {
      // FIXED: Added 'accounts/' to the fetch URL
      const res = await api.get('accounts/auth/me/');
      const role = res.data.role;
      
      // Save role to storage
      localStorage.setItem('user_role', role);

      // FIXED: Update both React states AT THE EXACT SAME TIME
      setUserRole(role);
      setIsAuthenticated(true);

      // Smart Redirect based on role
      if (role === 'hr') {
        navigate("/hr/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch role during login:", error);
      // Clean up if it fails so the user isn't stuck
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