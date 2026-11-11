import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Bonjour {user.nom} ({ROLE_LABELS[user.role]})
      </h1>

      {user.role === "BAILLEUR" ? (
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Tableau de bord bailleur</h2>
          <p className="mb-4 text-gray-600">Vos biens, vos locataires et vos loyers apparaîtront ici.</p>
          <Link to="/espace-bailleur" className="text-marque underline">
            Ouvrir l'espace bailleur
          </Link>
        </section>
      ) : (
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Tableau de bord locataire</h2>
          <p className="mb-4 text-gray-600">Votre logement et vos quittances apparaîtront ici.</p>
          <Link to="/espace-locataire" className="text-marque underline">
            Ouvrir l'espace locataire
          </Link>
        </section>
      )}
    </main>
  );
}