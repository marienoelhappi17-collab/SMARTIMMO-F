import type { ChangeEvent } from "react";

interface ChampProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "tel";
  erreur?: string;
  autoComplete?: string;
  placeholder?: string;
}

export default function Champ({
  label,
  name,
  value,
  onChange,
  type = "text",
  erreur,
  autoComplete,
  placeholder,
}: ChampProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marque ${
          erreur ? "border-red-500" : "border-gray-300"
        }`}
      />
      {erreur && <p className="mt-1 text-sm text-red-600">{erreur}</p>}
    </div>
  );
}