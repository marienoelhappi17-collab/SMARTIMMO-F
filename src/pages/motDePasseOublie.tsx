import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Bouton from "../components/Bouton";
import CarteAuth from "../components/CarteAuth";
import Champ from "../components/Champ";
import { lireErreur } from "../erreurs";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [champs, setChamps] = useState<Record<string, string>>({});
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");
    setChamps({});
    setChargement(true);
    try {
      const res = await api<null>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSucces(res.message);
    } catch (err) {
      const lu = lireErreur(err);
      setChamps(lu.champs);
      if (Object.keys(lu.champs).length === 0) setErreur(lu.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <CarteAuth titre="Mot de passe oublié">
      {succes ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{succes}</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <p className="text-sm text-gray-600">
            Saisissez votre e-mail : nous vous enverrons un lien valable 30 minutes.
          </p>
          <Champ
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            erreur={champs.email}
            autoComplete="email"
          />
          {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}
          <Bouton type="submit" pleineLargeur disabled={chargement}>
            {chargement ? "Envoi…" : "Envoyer le lien"}
          </Bouton>
        </form>
      )}
      <p className="text-center text-sm">
        <Link to="/login" className="text-marque underline">
          Retour à la connexion
        </Link>
      </p>
    </CarteAuth>
  );
}