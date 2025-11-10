import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardTemplate } from "../components/templates/DashboardTemplate";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useMovimientosStore } from "../store/MovimientosStore";

const FILTROS_INICIALES = {
  rango: "6m",
  tipo: "todos",
  categoria: "todas",
};

export function Dashboard() {
  const { datausuarios } = useUsuariosStore();
  const cargarMovimientosInformes = useMovimientosStore(
    (state) => state.cargarMovimientosInformes
  );
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const idusuario = datausuarios?.id;

  const {
    data: movimientos = [],
    isLoading,
    isError,
  } = useQuery(
    ["dashboard", "movimientos", idusuario],
    () => cargarMovimientosInformes(idusuario),
    {
      enabled: !!idusuario,
      staleTime: 1000 * 60,
    }
  );

  const movimientosFiltrados = useMemo(() => {
    if (!movimientos.length) {
      return [];
    }

    const fechaDesde = obtenerFechaDesde(filtros.rango);

    return movimientos.filter((movimiento) => {
      const fechaMovimiento = new Date(movimiento.fecha);

      const pasaFecha =
        filtros.rango === "all" || fechaMovimiento >= fechaDesde;

      const pasaTipo =
        filtros.tipo === "todos" || movimiento.tipo === filtros.tipo;

      const nombreCategoria =
        movimiento.categorias?.descripcion || "Sin categoría";
      const pasaCategoria =
        filtros.categoria === "todas" || filtros.categoria === nombreCategoria;

      return pasaFecha && pasaTipo && pasaCategoria;
    });
  }, [movimientos, filtros]);

  const opcionesCategorias = useMemo(() => {
    const setCategorias = new Set();
    movimientos.forEach((movimiento) => {
      const nombre = movimiento.categorias?.descripcion;
      if (nombre) {
        setCategorias.add(nombre);
      }
    });
    return Array.from(setCategorias).sort();
  }, [movimientos]);

  const resumenActual = useMemo(
    () => calcularResumenMovimiento(movimientosFiltrados, filtros.rango),
    [movimientosFiltrados, filtros.rango]
  );

  const comparativas = useMemo(
    () => construirComparativas(movimientosFiltrados),
    [movimientosFiltrados]
  );

  const categoriasDestacadas = useMemo(
    () => construirCategoriasDestacadas(movimientosFiltrados),
    [movimientosFiltrados]
  );

  const datosGraficoCategorias = useMemo(
    () => construirDatosGraficoCategorias(movimientosFiltrados),
    [movimientosFiltrados]
  );

  const datosSerieTemporal = useMemo(
    () => construirSerieTemporal(movimientosFiltrados),
    [movimientosFiltrados]
  );

  const onFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  if (!idusuario) {
    return <SpinnerLoader />;
  }

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (isError) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Ocurrió un problema al cargar el dashboard.</h1>
        <p>Intenta recargar la página en unos momentos.</p>
      </div>
    );
  }

  return (
    <DashboardTemplate
      cargando={isLoading}
      filtros={filtros}
      onFiltroChange={onFiltroChange}
      opcionesCategorias={opcionesCategorias}
      resumenActual={resumenActual}
      comparativas={comparativas}
      categoriasDestacadas={categoriasDestacadas}
      movimientosFiltrados={movimientosFiltrados}
      datosGraficoCategorias={datosGraficoCategorias}
      datosSerieTemporal={datosSerieTemporal}
    />
  );
}

function obtenerFechaDesde(rango) {
  const ahora = new Date();
  switch (rango) {
    case "3m":
      return new Date(ahora.getFullYear(), ahora.getMonth() - 3, ahora.getDate());
    case "6m":
      return new Date(ahora.getFullYear(), ahora.getMonth() - 6, ahora.getDate());
    case "12m":
      return new Date(ahora.getFullYear(), ahora.getMonth() - 12, ahora.getDate());
    default:
      return new Date(0);
  }
}

function calcularResumenMovimiento(movimientos, rango) {
  if (!movimientos.length) {
    return {
      ingresos: 0,
      gastos: 0,
      balance: 0,
      promedioMensual: 0,
    };
  }

  const totales = movimientos.reduce(
    (acc, movimiento) => {
      const monto = Number(movimiento.monto) || 0;
      if (movimiento.tipo === "i") {
        acc.ingresos += monto;
      } else {
        acc.gastos += monto;
      }
      return acc;
    },
    { ingresos: 0, gastos: 0 }
  );

  const balance = totales.ingresos - totales.gastos;

  const mesesConsiderados = rango === "all" ? obtenerMesesEntre(movimientos) : rangoToMeses(rango);

  const promedioMensual =
    mesesConsiderados > 0
      ? (totales.ingresos + totales.gastos) / mesesConsiderados
      : 0;

  return {
    ingresos: totales.ingresos,
    gastos: totales.gastos,
    balance,
    promedioMensual,
  };
}

function construirComparativas(movimientos) {
  const agrupadoPorMes = agruparPorPeriodo(movimientos);

  if (agrupadoPorMes.meses.length < 2) {
    return [
      {
        titulo: "Variación de ingresos",
        actual: agrupadoPorMes.ingresos[0] || 0,
        anterior: 0,
        variacion: 0,
        descripcion: "Se necesitan al menos dos meses para generar la comparación.",
      },
      {
        titulo: "Variación de gastos",
        actual: agrupadoPorMes.gastos[0] || 0,
        anterior: 0,
        variacion: 0,
        descripcion: "Se necesitan al menos dos meses para generar la comparación.",
      },
    ];
  }

  const ultimoIndex = agrupadoPorMes.meses.length - 1;
  const penultimoIndex = ultimoIndex - 1;

  const ingresosActual = agrupadoPorMes.ingresos[ultimoIndex];
  const ingresosAnterior = agrupadoPorMes.ingresos[penultimoIndex];
  const gastosActual = agrupadoPorMes.gastos[ultimoIndex];
  const gastosAnterior = agrupadoPorMes.gastos[penultimoIndex];

  return [
    {
      titulo: `Ingresos ${agrupadoPorMes.meses[ultimoIndex]}`,
      actual: ingresosActual,
      anterior: ingresosAnterior,
      variacion: calcularVariacion(ingresosAnterior, ingresosActual),
      descripcion: `Comparativa frente a ${agrupadoPorMes.meses[penultimoIndex]}.`,
    },
    {
      titulo: `Gastos ${agrupadoPorMes.meses[ultimoIndex]}`,
      actual: gastosActual,
      anterior: gastosAnterior,
      variacion: calcularVariacion(gastosAnterior, gastosActual),
      descripcion: `Comparativa frente a ${agrupadoPorMes.meses[penultimoIndex]}.`,
    },
  ];
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
      porcentaje: totalGeneral ? (item.total / totalGeneral) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

function agruparPorPeriodo(movimientos = []) {
  const mapa = new Map();

  movimientos.forEach((movimiento) => {
    const fecha = new Date(movimiento.fecha);
    if (Number.isNaN(fecha.getTime())) return;

    const clave = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!mapa.has(clave)) {
      mapa.set(clave, { ingresos: 0, gastos: 0 });
    }

    const monto = Number(movimiento.monto) || 0;
    const dato = mapa.get(clave);
    if (movimiento.tipo === "i") {
      dato.ingresos += monto;
    } else {
      dato.gastos += monto;
    }
  });

  const meses = Array.from(mapa.keys()).sort();
  const ingresos = meses.map((mes) => mapa.get(mes).ingresos);
  const gastos = meses.map((mes) => mapa.get(mes).gastos);

  return { meses, ingresos, gastos };
}

function construirDatosGraficoCategorias(movimientos = []) {
  const totales = movimientos.reduce((acc, movimiento) => {
    const nombre = movimiento?.categorias?.descripcion || "Sin categoría";
    const monto = Number(movimiento.monto) || 0;
    const valor = Math.abs(monto);

    if (!acc[nombre]) {
      acc[nombre] = 0;
    }
    acc[nombre] += valor;
    return acc;
  }, {});

  return Object.entries(totales)
    .map(([nombre, valor]) => ({ nombre, valor }))
    .sort((a, b) => b.valor - a.valor);
}

function construirSerieTemporal(movimientos = []) {
  const { meses, ingresos, gastos } = agruparPorPeriodo(movimientos);

  return meses.map((periodo, index) => ({
    periodo: formatearMes(periodo),
    ingresos: ingresos[index] || 0,
    gastos: gastos[index] || 0,
  }));
}

function calcularVariacion(valorAnterior, valorActual) {
  if (valorAnterior === 0) {
    return valorActual === 0 ? 0 : 100;
  }
  return ((valorActual - valorAnterior) / Math.abs(valorAnterior)) * 100;
}

function obtenerMesesEntre(movimientos = []) {
  if (!movimientos.length) return 0;

  const fechas = movimientos
    .map((movimiento) => new Date(movimiento.fecha))
    .filter((fecha) => !Number.isNaN(fecha.getTime()))
    .sort((a, b) => a - b);

  if (!fechas.length) return 0;

  const primera = fechas[0];
  const ultima = fechas[fechas.length - 1];

  return (
    (ultima.getFullYear() - primera.getFullYear()) * 12 +
    (ultima.getMonth() - primera.getMonth()) +
    1
  );
}

function rangoToMeses(rango) {
  switch (rango) {
    case "3m":
      return 3;
    case "6m":
      return 6;
    case "12m":
      return 12;
    case "all":
    default:
      return 0;
  }
}

function formatearMes(periodo) {
  const [year, month] = periodo.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("es-CO", {
    month: "short",
    year: "numeric",
  });
}

