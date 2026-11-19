import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api, ApiError } from "../api";
import Bouton from "../components/Bouton";
import CarteAuth from "../components/CarteAuth";
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
  const [info, setInfo] = useState("");
  const [nonVerifie, setNonVerifie] = useState(false);
  const [chargement, setChargement] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");
    setInfo("");
    setChamps({});
    setNonVerifie(false);
    setChargement(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const lu = lireErreur(err);
      setChamps(lu.champs);
      if (Object.keys(lu.champs).length === 0) setErreur(lu.message);
      // 403 : identifiants corrects mais e-mail pas encore vérifié
      if (err instanceof ApiError && err.status === 403) setNonVerifie(true);
    } finally {
      setChargement(false);
    }
  }

  async function renvoyer() {
    try {
      const res = await api<null>("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
      });
      setInfo(res.message);
      setErreur("");
      setNonVerifie(false);
    } catch (err) {
      setErreur(lireErreur(err).message);
    }
  }

  return (
    <CarteAuth titre="Connexion">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {inscrit && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Compte créé. Un e-mail de vérification vous a été envoyé (lien valable 48 h).
          </p>
        )}
        {info && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{info}</p>}

        <Champ label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} erreur={champs.email} autoComplete="email" />
        <Champ label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} erreur={champs.password} autoComplete="current-password" />

        {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

        {nonVerifie && (
          <Bouton variante="secondaire" pleineLargeur onClick={renvoyer}>
            Renvoyer l'e-mail de vérification
          </Bouton>
        )}

        <Bouton type="submit" pleineLargeur disabled={chargement}>
          {chargement ? "Connexion…" : "Se connecter"}
        </Bouton>

        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="text-marque underline">
            Mot de passe oublié ?
          </Link>
          <Link to="/register" className="text-marque underline">
            Créer un compte
          </Link>
        </div>
      </form>
    </CarteAuth>
  );
}