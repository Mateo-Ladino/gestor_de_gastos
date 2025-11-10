import { useMemo } from "react";
import { AcercaDeTemplate } from "../components/templates/AcercaDeTemplate";

export function AcercaDe() {
  const tecnologias = useMemo(
    () => [
      "React 18",
      "Vite",
      "Styled Components",
      "Supabase",
      "Zustand",
      "React Query",
      "Recharts",
    ],
    []
  );

  const equipo = useMemo(
    () => [
      { nombre: "Mateo Ladino Muñoz", rol: "Product Owner & QA" },
      { nombre: "Santiago Arroyave", rol: "Líder técnico & Backend" },
      { nombre: "Gabriel Riera", rol: "Diseñador UX/UI & Frontend" },
      { nombre: "Santiago Cuervo", rol: "Especialista en datos & Integraciones" },
    ],
    []
  );

  return (
    <AcercaDeTemplate
      equipo={equipo}
      tecnologias={tecnologias}
      version="1.0.0"
    />
  );
}

