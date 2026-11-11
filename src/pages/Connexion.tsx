import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Bouton from "../components/Bouton";
import Champ from "../components/Champ";
import { useAuth } from "../context/AuthContext";
import { lireErreur } from "../erreurs";

interface FormState {
  email: string;
  password: string;
}

export default function Connexion() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const inscrit = (location.state as { inscrit?: boolean } | null)?.inscrit === true;

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
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
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const lu = lireErreur(err);
      setChamps(lu.champs);
      // « Identifiants incorrects » renvoyé par l'API
      if (Object.keys(lu.champs).length === 0) setErreur(lu.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-md"
      >
        <h1 className="text-center text-2xl font-bold text-gray-800">Connexion</h1>

        {inscrit && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Compte créé. Vous pouvez vous connecter.
          </p>
        )}

        <Champ label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} erreur={champs.email} autoComplete="email" />
        <Champ label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} erreur={champs.password} autoComplete="current-password" />

        {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

        <Bouton type="submit" disabled={chargement}>
          {chargement ? "Connexion…" : "Se connecter"}
        </Bouton>

        <p className="text-sm text-gray-600">
          Pas de compte bailleur ?{" "}
          <Link to="/register" className="text-marque underline">
            S'inscrire
          </Link>
        </p>
      </form>
    </main>
  );
}