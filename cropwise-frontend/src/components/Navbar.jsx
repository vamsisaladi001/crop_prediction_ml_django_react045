import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <span className="brand">CropWise</span>
      <div className="navbar-user">
        <span className="navbar-name">{user?.name}</span>
        <button type="button" className="btn btn-quiet" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
