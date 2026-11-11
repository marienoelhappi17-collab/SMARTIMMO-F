export type Role = "BAILLEUR" | "LOCATAIRE";

export interface User {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: Role;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface FieldError {
  path: string;
  message: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  BAILLEUR: "Bailleur",
  LOCATAIRE: "Locataire",
};
