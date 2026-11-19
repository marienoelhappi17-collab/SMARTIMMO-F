import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../types";
import Bouton from "./Bouton";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <Link to={user ? "/dashboard" : "/login"} aria-label="SmartImmo, accueil">
        <Logo />
      </Link>

      {user ? (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/profile" className="text-gray-700 underline">
            {user.nom}
          </Link>
          <span className="rounded bg-marque/10 px-2 py-1 font-medium text-marque">
            {ROLE_LABELS[user.role]}
          </span>
          <Bouton variante="secondaire" onClick={handleLogout}>
            Déconnexion
          </Bouton>
        </div>
      ) : (
        <div className="flex gap-4 text-sm font-medium text-marque">
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </div>
      )}
    </nav>
  );
}