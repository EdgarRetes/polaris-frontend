import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import HeaderTile from '../assets/HeaderTile.png'; 
import BanorteNameWhite from '../assets/BanorteNameWhite.png';
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SecondaryColors } from "@/helpers/colors";

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

      {isAuthenticated && (
        <div style={{ marginLeft: "auto", marginRight: 24 }}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <User className="w-6 h-6 cursor-pointer text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-0" style={{ background: SecondaryColors.background_3 }}>
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default Header;
