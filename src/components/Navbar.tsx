import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../types";
import Bouton from "./Bouton";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 bg-marque px-4 py-3 text-white">
      <Link to="/dashboard" className="text-lg font-bold">
        Gestion locative
      </Link>

      {user ? (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/profile" className="underline">
            {user.nom}
          </Link>
          <span className="rounded bg-white/20 px-2 py-1">{ROLE_LABELS[user.role]}</span>
          <Bouton variante="secondaire" onClick={handleLogout}>
            Déconnexion
          </Bouton>
        </div>
      ) : (
        <div className="flex gap-3 text-sm">
          <Link to="/login" className="underline">
            Connexion
          </Link>
          <Link to="/register" className="underline">
            Inscription
          </Link>
        </div>
      )}
    </nav>
  );
}