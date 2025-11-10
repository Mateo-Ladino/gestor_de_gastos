import { useMemo } from "react";
import { CentroAyudaTemplate } from "../components/templates/CentroAyudaTemplate";

export function CentroAyuda() {
  const faqs = useMemo(
    () => [
      {
        pregunta: "¿Cómo agrego un nuevo movimiento?",
        respuesta:
          "Ve a la sección Movimientos y haz clic en el botón 'Registrar movimiento'. Completa el formulario con la información requerida y guarda.",
        links: [
          { texto: "Ir a Movimientos", url: "/movimientos" },
        ],
      },
      {
        pregunta: "¿Puedo crear mis propias categorías?",
        respuesta:
          "Sí. En la sección Categorías puedes crear y editar categorías personalizadas para tus ingresos y gastos.",
        links: [
          { texto: "Administrar categorías", url: "/categorias" },
        ],
      },
      {
        pregunta: "¿Cómo veo mis informes?",
        respuesta:
          "La sección Informes muestra un resumen de tus ingresos y gastos con gráficos y métricas principales. Puedes filtrar por rango de fechas.",
        links: [
          { texto: "Ver informes", url: "/informes" },
        ],
      },
    ],
    []
  );

  const recursos = useMemo(
    () => [
      {
        titulo: "Guía rápida de uso",
        descripcion: "Documentación resumida con los pasos iniciales.",
        tipo: "Documento PDF",
        url: "https://example.com/guia-rapida",
      },
      {
        titulo: "Blog de finanzas personales",
        descripcion: "Artículos para mejorar tus hábitos financieros.",
        tipo: "Blog externo",
        url: "https://example.com/blog-finanzas",
      },
      {
        titulo: "Comunidad de usuarios",
        descripcion: "Comparte sugerencias y aprende de otros usuarios.",
        tipo: "Foro",
        url: "https://example.com/comunidad",
      },
    ],
    []
  );

  const soporte = useMemo(
    () => ({
      email: "soporte@cerdys.app",
      horario: "Lunes a viernes de 9:00 a 18:00 (GMT-5)",
      tiempoRespuesta: "24 horas hábiles",
      linkDocumentacion: "https://example.com/documentacion",
    }),
    []
  );

  return (
    <CentroAyudaTemplate
      faqs={faqs}
      recursos={recursos}
      soporte={soporte}
    />
  );
}

