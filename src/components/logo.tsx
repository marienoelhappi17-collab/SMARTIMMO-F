import logoComplet from "../assets/logo-complet.png";
import logoIcone from "../assets/logo-icone.png";

interface LogoProps {
  complet?: boolean;
}

export default function Logo({ complet = false }: LogoProps) {
  if (complet) {
    return (
      <img
        src={logoComplet}
        alt="SmartImmo, la solution intelligente pour gérer votre patrimoine immobilier"
        className="mx-auto h-40 w-auto"
      />
    );
  }
  return (
    <span className="flex items-center gap-2">
      <img src={logoIcone} alt="" className="h-9 w-9 object-contain" />
      <span className="text-lg font-extrabold tracking-wide text-marque">SmartImmo</span>
    </span>
  );
}