import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import Bouton from "../components/Bouton";
import CarteAuth from "../components/CarteAuth";
import Champ from "../components/Champ";
import { lireErreur } from "../erreurs";

export default function NouveauMotDePasse() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
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
      const res = await api<null>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
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
    <CarteAuth titre="Nouveau mot de passe">
      {!token ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Lien invalide.</p>
      ) : succes ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{succes}</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Champ
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            erreur={champs.newPassword}
            autoComplete="new-password"
          />
          {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}
          <Bouton type="submit" pleineLargeur disabled={chargement}>
            {chargement ? "Enregistrement…" : "Enregistrer"}
          </Bouton>
        </form>
      )}
      <p className="text-center text-sm">
        <Link to="/login" className="text-marque underline">
          Aller à la connexion
        </Link>
      </p>
    </CarteAuth>
  );
}