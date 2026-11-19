import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import Connexion from "../pages/Connexion";
import Dashboard from "../pages/Dashboard";
import EspaceBailleur from "../pages/EspaceBailleur";
import EspaceLocataire from "../pages/EspaceLocataire";
import Inscription from "../pages/Inscription";
import MotDePasseOublie from "../pages/MotDePasseOublie";
import NonAutorise from "../pages/NonAutorise";
import NouveauMotDePasse from "../pages/NouveauMotDePasse";
import Profil from "../pages/Profil";
import VerifierEmail from "../pages/VerifierEmail";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/login" element={<Connexion />} />
      <Route path="/register" element={<Inscription />} />
      <Route path="/verify-email" element={<VerifierEmail />} />
      <Route path="/forgot-password" element={<MotDePasseOublie />} />
      <Route path="/reset-password" element={<NouveauMotDePasse />} />
      <Route path="/unauthorized" element={<NonAutorise />} />

      {/* Il faut être connecté */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profil />} />

        {/* Il faut avoir le bon rôle */}
        <Route element={<RoleRoute roles={["BAILLEUR"]} />}>
          <Route path="/espace-bailleur" element={<EspaceBailleur />} />
        </Route>
        <Route element={<RoleRoute roles={["LOCATAIRE"]} />}>
          <Route path="/espace-locataire" element={<EspaceLocataire />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}