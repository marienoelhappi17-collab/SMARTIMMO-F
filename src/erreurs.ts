import { ApiError } from "./api";

// Transforme une erreur de l'API en message général + messages par champ
export function lireErreur(err: unknown): {
  message: string;
  champs: Record<string, string>;
} {
  if (err instanceof ApiError) {
    const champs: Record<string, string> = {};
    for (const e of err.errors) {
      if (!champs[e.path]) champs[e.path] = e.message;
    }
    return { message: err.message, champs };
  }
  return {
    message: err instanceof Error ? err.message : "Erreur inconnue",
    champs: {},
  };
}