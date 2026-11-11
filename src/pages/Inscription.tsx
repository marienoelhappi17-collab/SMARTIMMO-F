import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import Bouton from "../components/Bouton";
import Champ from "../components/Champ";
import { useAuth } from "../context/AuthContext";
import { lireErreur } from "../erreurs";

interface FormState {
  nom: string;
  email: string;
  telephone: string;
  password: string;
}

export default function Inscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ nom: "", email: "", telephone: "", password: "" });
  const [champs, setChamps] = useState<Record<string, string>>({});
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");
    setChamps({});
    setChargement(true);
    try {
      // Le rôle n'est pas envoyé : l'API impose BAILLEUR à l'inscription publique
      await api("/auth/register", { method: "POST", body: JSON.stringify(form) });
      navigate("/login", { state: { inscrit: true } });
    } catch (err) {
      const lu = lireErreur(err);
      setChamps(lu.champs);
      if (Object.keys(lu.champs).length === 0) setErreur(lu.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="flex items-center justify-center px-4 py-8">
      {/* noValidate : on laisse l'API (Zod) valider et afficher les erreurs */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-md"
      >
        <h1 className="text-center text-2xl font-bold text-gray-800">Inscription bailleur</h1>

        <Champ label="Nom" name="nom" value={form.nom} onChange={handleChange} erreur={champs.nom} autoComplete="name" />
        <Champ label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} erreur={champs.email} autoComplete="email" />
        <Champ label="Téléphone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} erreur={champs.telephone} placeholder="690000000" autoComplete="tel" />
        <Champ label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} erreur={champs.password} autoComplete="new-password" />

        {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

        <Bouton type="submit" disabled={chargement}>
          {chargement ? "Création…" : "Créer mon compte"}
        </Bouton>

        <p className="text-sm text-gray-600">
          Déjà inscrit ?{" "}
          <Link to="/login" className="text-marque underline">
            Se connecter
          </Link>
        </p>
      </form>
    </main>
  );
}