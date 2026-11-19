import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import CarteAuth from "../components/CarteAuth";
import { lireErreur } from "../erreurs";

type Etat = "chargement" | "ok" | "erreur";

export default function VerifierEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [etat, setEtat] = useState<Etat>("chargement");
  const [message, setMessage] = useState("");
  // Le jeton est à usage unique : on n'appelle l'API qu'une fois (React StrictMode monte deux fois en dev)
  const lance = useRef(false);

  useEffect(() => {
    if (!token) {
      setEtat("erreur");
      setMessage("Lien invalide.");
      return;
    }
    if (lance.current) return;
    lance.current = true;

    api<null>("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) })
      .then((res) => {
        setMessage(res.message);
        setEtat("ok");
      })
      .catch((err) => {
        setMessage(lireErreur(err).message);
        setEtat("erreur");
      });
  }, [token]);

  return (
    <CarteAuth titre="Vérification de l'e-mail">
      {etat === "chargement" && <p className="text-center text-gray-600">Vérification en cours…</p>}
      {etat === "ok" && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}
      {etat === "erreur" && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
      <p className="text-center text-sm">
        <Link to="/login" className="text-marque underline">
          Aller à la connexion
        </Link>
      </p>
    </CarteAuth>
  );
}