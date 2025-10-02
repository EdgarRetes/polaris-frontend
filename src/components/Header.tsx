// src/components/Header.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import HeaderTile from '../assets/HeaderTile.png'; 
import BanorteNameWhite from '../assets/BanorteNameWhite.png';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <header
      className="h-17 w-full flex items-center justify-left text-white text-2xl"
      style={{
        backgroundImage: `url(${HeaderTile})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "contain",
        backgroundPosition: "top left",
      }}
    >
      <img src={BanorteNameWhite} alt="BanorteLogo" className="mr-4 ml-6" />

      {/* logout shown only when authenticated */}
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          style={{ marginLeft: "auto", marginRight: 24 }}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition"
        >
          Cerrar sesión
        </button>
      )}
    </header>
  );
};

export default Header;
