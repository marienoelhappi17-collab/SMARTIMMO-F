import type { ReactNode } from "react";

type Variante = "primaire" | "danger" | "secondaire";

const styles: Record<Variante, string> = {
  primaire: "bg-marque text-white hover:opacity-90",
  danger: "bg-red-600 text-white hover:bg-red-700",
  secondaire: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
};

interface BoutonProps {
  children: ReactNode;
  variante?: Variante;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export default function Bouton({
  children,
  variante = "primaire",
  type = "button",
  disabled,
  onClick,
}: BoutonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 font-medium disabled:opacity-50 ${styles[variante]}`}
    >
      {children}
    </button>
  );
}