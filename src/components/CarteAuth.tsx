import type { ReactNode } from "react";
import Logo from "./Logo";

interface CarteAuthProps {
    titre: string;
    children: ReactNode;
}

export default function CarteAuth ({ titre, children }: CarteAuthpropos){
    return (
        <main className="flex justify-center px-4 py=6">
         <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-md">
        <Logo complet />
        <h1 className="text-center text-2xl font-bold text-gray-800">{titre}</h1>
        {children}
      </div>
    </main>
    );
}