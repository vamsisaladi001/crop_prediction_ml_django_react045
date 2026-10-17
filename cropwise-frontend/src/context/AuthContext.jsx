import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const API = "http://127.0.0.1:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem("username");
    const access = localStorage.getItem("access");
    return username && access ? { username } : null;
  });

  // Register user in Django
  const register = useCallback(async ({ username, password }) => {
    const response = await fetch(`${API}/crop/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.username?.[0] ||
        data.password?.[0] ||
        data.detail ||
        "Registration failed."
      );
    }

    return data;
  }, []);

  // Login and receive JWT tokens
  const login = useCallback(async ({ username, password }) => {
    const response = await fetch(`${API}/crop/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Invalid username or password."
      );
    }

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("username", username);

    const session = { username };
    setUser(session);

    return session;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, register, login, logout }),
    [user, register, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
