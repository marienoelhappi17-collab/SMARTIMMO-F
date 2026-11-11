import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { api } from "../api";
import Bouton from "../components/Bouton";
import Champ from "../components/Champ";
import { useAuth } from "../context/AuthContext";
import { lireErreur } from "../erreurs";
import { ROLE_LABELS } from "../types";

interface FormState {
  oldPassword: string;
  newPassword: string;
}

export default function Profil() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>({ oldPassword: "", newPassword: "" });
  const [champs, setChamps] = useState<Record<string, string>>({});
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [chargement, setChargement] = useState(false);

  if (!user) return null;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");
    setSucces("");
    setChamps({});
    setChargement(true);
    try {
      await api("/auth/password", { method: "PATCH", body: JSON.stringify(form) });
      setSucces("Mot de passe modifié.");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      const lu = lireErreur(err);
      setChamps(lu.champs);
      // « Ancien mot de passe incorrect » renvoyé par l'API
      if (Object.keys(lu.champs).length === 0) setErreur(lu.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-8">
      <section className="rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-3 text-xl font-bold text-gray-800">Mon profil</h1>
        <dl className="space-y-1 text-sm text-gray-700">
          <div><dt className="inline font-medium">Nom : </dt><dd className="inline">{user.nom}</dd></div>
          <div><dt className="inline font-medium">E-mail : </dt><dd className="inline">{user.email}</dd></div>
          <div><dt className="inline font-medium">Téléphone : </dt><dd className="inline">{user.telephone}</dd></div>
          <div><dt className="inline font-medium">Rôle : </dt><dd className="inline">{ROLE_LABELS[user.role]}</dd></div>
        </dl>
      </section>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800">Changer mon mot de passe</h2>

        <Champ label="Ancien mot de passe" name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange} erreur={champs.oldPassword} autoComplete="current-password" />
        <Champ label="Nouveau mot de passe" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} erreur={champs.newPassword} autoComplete="new-password" />

        {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}
        {succes && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{succes}</p>}

        <Bouton type="submit" disabled={chargement}>
          {chargement ? "Modification…" : "Modifier"}
        </Bouton>
      </form>
    </main>
  );
}