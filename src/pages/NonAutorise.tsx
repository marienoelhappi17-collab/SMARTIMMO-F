import { Link } from "react-router-dom";

export default function NonAutorise() {
  return (
    <main className="mx-auto max-w-md px-4 py-12 text-center">
      <h1 className="text-5xl font-bold text-red-600">403</h1>
      <p className="mt-4 text-gray-700">Vous n'avez pas le droit d'accéder à cette page.</p>
      <Link to="/dashboard" className="mt-4 inline-block text-marque underline">
        Retour au tableau de bord
      </Link>
    </main>
  );
}