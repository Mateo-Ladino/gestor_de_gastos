import { useMemo } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { InformesTemplate } from "../components/templates/InformesTemplate";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useMovimientosStore } from "../store/MovimientosStore";

export function Informes() {
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
    error: errorResumenDetail,
  } = useQuery(
    ["informes", "resumen", idusuario],
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
    error: errorMovimientosDetail,
  } = useQuery(
    ["informes", "movimientos", idusuario],
    () => cargarMovimientosInformes(idusuario),
    {
      enabled: !!idusuario,
      staleTime: 1000 * 60,
    }
  );

  const resumenMensual = useMemo(
    () => construirResumenMensual(movimientos),
    [movimientos]
  );

  const categoriasDestacadas = useMemo(
    () => construirCategoriasDestacadas(movimientos),
    [movimientos]
  );

  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return (valor = 0) => {
      const numero = Number(valor) || 0;
      return formatter.format(numero);
    };
  }, []);

  if (!idusuario) {
    return <SpinnerLoader />;
  }

  if (loadingResumen || loadingMovimientos) {
    return <SpinnerLoader />;
  }

  if (errorResumen || errorMovimientos) {
    return (
      <ErrorContainer>
        <h1>Ocurrió un problema al cargar los informes.</h1>
        {errorResumenDetail && <p>{errorResumenDetail.message}</p>}
        {errorMovimientosDetail && <p>{errorMovimientosDetail.message}</p>}
      </ErrorContainer>
    );
  }

  return (
    <InformesTemplate
      resumen={resumen}
      resumenMensual={resumenMensual}
      categoriasDestacadas={categoriasDestacadas}
      formatCurrency={formatCurrency}
    />
  );
}

function construirResumenMensual(movimientos = []) {
  const acumulado = movimientos.reduce((acc, movimiento) => {
    const clave = obtenerClavePeriodo(movimiento.fecha);
    if (!clave) {
      return acc;
    }

    if (!acc[clave]) {
      acc[clave] = { ingresos: 0, gastos: 0 };
    }

    const monto = parseFloat(movimiento.monto) || 0;
    if (movimiento.tipo === "i") {
      acc[clave].ingresos += monto;
    } else {
      acc[clave].gastos += monto;
    }

    return acc;
  }, {});

  return Object.entries(acumulado)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([periodo, valores]) => {
      const ingresos = Number(valores.ingresos.toFixed(2));
      const gastos = Number(valores.gastos.toFixed(2));
      const balance = Number((ingresos - gastos).toFixed(2));

      return {
        periodo: formatearPeriodo(periodo),
        ingresos,
        gastos,
        balance,
      };
    });
}

function construirCategoriasDestacadas(movimientos = []) {
  const totales = movimientos.reduce((acc, movimiento) => {
    const nombre = movimiento?.categorias?.descripcion || "Sin categoría";

    if (!acc[nombre]) {
      acc[nombre] = { nombre, ingresos: 0, gastos: 0, total: 0 };
    }

    const monto = parseFloat(movimiento.monto) || 0;

    if (movimiento.tipo === "i") {
      acc[nombre].ingresos += monto;
    } else {
      acc[nombre].gastos += monto;
    }

    acc[nombre].total = acc[nombre].ingresos + acc[nombre].gastos;

    return acc;
  }, {});

  const totalGeneral = Object.values(totales).reduce(
    (suma, item) => suma + item.total,
    0
  );

  return Object.values(totales)
    .map((item) => ({
      ...item,
      ingresos: Number(item.ingresos.toFixed(2)),
      gastos: Number(item.gastos.toFixed(2)),
      total: Number(item.total.toFixed(2)),
      porcentaje: totalGeneral
        ? (item.total / totalGeneral) * 100
        : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

function obtenerClavePeriodo(fecha) {
  if (!fecha) {
    return null;
  }

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatearPeriodo(periodo) {
  const [year, month] = periodo.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  const texto = date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 24px;
`;

