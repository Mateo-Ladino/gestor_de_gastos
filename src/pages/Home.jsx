import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { HomeTemplate } from "../components/templates/HomeTemplate";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useMovimientosStore } from "../store/MovimientosStore";
import { UserAuth, v } from "../index";

export function Home() {
  const { user } = UserAuth();
  const { datausuarios } = useUsuariosStore();
  const cargarResumen = useMovimientosStore((state) => state.cargarResumen);
  const cargarMovimientosInformes = useMovimientosStore(
    (state) => state.cargarMovimientosInformes
  );

  const idusuario = datausuarios?.id;

  const {
    data: resumen = { ingresos: 0, gastos: 0, balance: 0 },
    isLoading: loadingResumen,
    isError: errorResumen,
  } = useQuery(
    ["home", "resumen", idusuario],
    () => cargarResumen(idusuario),
    {
      enabled: !!idusuario,
      staleTime: 1000 * 60,
    }
  );

  const {
    data: movimientos = [],
    isLoading: loadingMovimientos,
    isError: errorMovimientos,
  } = useQuery(
    ["home", "movimientos", idusuario],
    () => cargarMovimientosInformes(idusuario),
    {
      enabled: !!idusuario,
      staleTime: 1000 * 60,
    }
  );

  const enlacesRapidos = useMemo(
    () => [
      {
        titulo: "Registrar movimiento",
        descripcion: "Agrega tus ingresos o gastos en segundos.",
        url: "/movimientos",
        color: v.colorIngresos,
        icono: <v.flechaarribalarga />,
      },
      {
        titulo: "Categorías",
        descripcion: "Organiza tus categorías de ingresos y gastos.",
        url: "/categorias",
        color: v.colorGastos,
        icono: <v.iconotodos />,
      },
      {
        titulo: "Informes",
        descripcion: "Visualiza métricas y resúmenes detallados.",
        url: "/informes",
        color: v.colorselector,
        icono: <v.iconopie />,
      },
      {
        titulo: "Dashboard",
        descripcion: "Comparativas y tendencias de tu dinero.",
        url: "/dashboard",
        color: "#44A0D6",
        icono: <v.iconolineal />,
      },
    ],
    []
  );

  const movimientosRecientes = useMemo(
    () =>
      movimientos
        .slice()
        .sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
        .slice(0, 5),
    [movimientos]
  );

  if (!idusuario) {
    return <SpinnerLoader />;
  }

  if (loadingResumen || loadingMovimientos) {
    return <SpinnerLoader />;
  }

  if (errorResumen || errorMovimientos) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Ocurrió un problema al cargar el inicio.</h1>
        <p>Intenta recargar la página en unos momentos.</p>
      </div>
    );
  }

  return (
    <HomeTemplate
      user={user}
      resumen={resumen}
      enlacesRapidos={enlacesRapidos}
      movimientosRecientes={movimientosRecientes}
    />
  );
}
