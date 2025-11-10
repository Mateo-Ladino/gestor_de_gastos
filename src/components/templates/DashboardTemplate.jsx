import { useMemo } from "react";
import styled from "styled-components";
import { Header, SpinnerLoader, v } from "../../index";
import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend as PieLegend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as LineTooltip,
  Legend as LineLegend,
} from "recharts";

const IconIngresos = v.flechaarribalarga;
const IconGastos = v.flechaabajolarga;
const IconBalance = v.balance;
const IconPromedio = v.iconocalculadora;
const IconComparativa = v.iconolineal;
const IconCategorias = v.iconopie;

export function DashboardTemplate({
  cargando,
  filtros,
  onFiltroChange,
  opcionesCategorias,
  resumenActual,
  comparativas,
  categoriasDestacadas,
  movimientosFiltrados,
  datosGraficoCategorias,
  datosSerieTemporal,
}) {
  const cards = useMemo(
    () => [
      {
        label: "Ingresos",
        value: resumenActual.ingresos,
        icon: <IconIngresos />,
        accent: v.colorIngresos,
        background: v.colorbgingresos,
      },
      {
        label: "Gastos",
        value: resumenActual.gastos,
        icon: <IconGastos />,
        accent: v.colorGastos,
        background: v.colorbgGastos,
      },
      {
        label: "Balance",
        value: resumenActual.balance,
        icon: <IconBalance />,
        accent: resumenActual.balance >= 0 ? v.colorIngresos : v.colorGastos,
        background: "rgba(210, 110, 249, 0.15)",
      },
      {
        label: "Promedio mensual",
        value: resumenActual.promedioMensual,
        icon: <IconPromedio />,
        accent: v.colorselector,
        background: v.rgbafondos,
      },
    ],
    [resumenActual]
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    []
  );

  const palette = useMemo(
    () => [
      "#53B257",
      "#fe6156",
      "#F5A623",
      "#7B61FF",
      "#44A0D6",
      "#BF94FF",
      "#FF8CC6",
    ],
    []
  );

  if (cargando) {
    return <SpinnerLoader />;
  }

  return (
    <Container>
      <header className="header">
        <Header stateConfig={{ state: false, setState: () => {} }} />
      </header>

      <section className="filtros">
        <FiltersCard>
          <div className="titulo">
            <span>Filtros</span>
          </div>
          <div className="filtros-grid">
            <div className="campo">
              <label>Rango temporal</label>
              <select
                value={filtros.rango}
                onChange={(e) => onFiltroChange("rango", e.target.value)}
              >
                <option value="3m">Últimos 3 meses</option>
                <option value="6m">Últimos 6 meses</option>
                <option value="12m">Últimos 12 meses</option>
                <option value="all">Todo el historial</option>
              </select>
            </div>
            <div className="campo">
              <label>Tipo</label>
              <select
                value={filtros.tipo}
                onChange={(e) => onFiltroChange("tipo", e.target.value)}
              >
                <option value="todos">Ingresos y gastos</option>
                <option value="i">Solo ingresos</option>
                <option value="g">Solo gastos</option>
              </select>
            </div>
            <div className="campo">
              <label>Categoría</label>
              <select
                value={filtros.categoria}
                onChange={(e) => onFiltroChange("categoria", e.target.value)}
              >
                <option value="todas">Todas</option>
                {opcionesCategorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FiltersCard>
      </section>

      <section className="metricas">
        {cards.map((card) => (
          <Card key={card.label} $bg={card.background} $accent={card.accent}>
            <div className="icon">{card.icon}</div>
            <div className="info">
              <span className="label">{card.label}</span>
              <span className="value">
                {currencyFormatter.format(card.value)}
              </span>
            </div>
          </Card>
        ))}
      </section>

      <section className="graficos">
        <ChartCard>
          <h3>
            <v.iconopie /> Distribución por categoría
          </h3>
          {datosGraficoCategorias.length === 0 ? (
            <EmptyState>Sin datos para generar la gráfica.</EmptyState>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="valor"
                  data={datosGraficoCategorias}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ nombre }) => nombre}
                >
                  {datosGraficoCategorias.map((entry, index) => (
                    <Cell
                      key={entry.nombre}
                      fill={palette[index % palette.length]}
                    />
                  ))}
                </Pie>
                <PieTooltip
                  formatter={(value) => currencyFormatter.format(value)}
                />
                <PieLegend
                  formatter={(value) =>
                    datosGraficoCategorias.find((item) => item.nombre === value)
                      ?.nombre || value
                  }
                  payload={datosGraficoCategorias.map((item, index) => ({
                    id: item.nombre,
                    value: item.nombre,
                    type: "square",
                    color: palette[index % palette.length],
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard>
          <h3>
            <v.iconolineal /> Evolución mensual
          </h3>
          {datosSerieTemporal.length === 0 ? (
            <EmptyState>
              Sin datos suficientes para la serie temporal.
            </EmptyState>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosSerieTemporal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis
                  tickFormatter={(value) => currencyFormatter.format(value)}
                />
                <LineTooltip
                  formatter={(value) => currencyFormatter.format(value)}
                />
                <LineLegend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke={v.colorIngresos}
                  strokeWidth={2}
                  dot={false}
                  name="Ingresos"
                />
                <Line
                  type="monotone"
                  dataKey="gastos"
                  stroke={v.colorGastos}
                  strokeWidth={2}
                  dot={false}
                  name="Gastos"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </section>

      <section className="comparativas">
        <SectionTitle>
          <IconComparativa />
          <span>Comparativas</span>
        </SectionTitle>
        <ComparativaGrid>
          {comparativas.map((item) => (
            <ComparativaCard key={item.titulo}>
              <h3>{item.titulo}</h3>
              <div className="valores">
                <span className="actual">
                  Actual:{" "}
                  {currencyFormatter.format(item.actual)}
                </span>
                <span className="anterior">
                  Periodo anterior:{" "}
                  {currencyFormatter.format(item.anterior)}
                </span>
              </div>
              <p className={item.variacion >= 0 ? "positivo" : "negativo"}>
                {item.variacion >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(item.variacion).toFixed(1)}%
              </p>
              <small>{item.descripcion}</small>
            </ComparativaCard>
          ))}
        </ComparativaGrid>
      </section>

      <section className="categorias">
        <SectionTitle>
          <IconCategorias />
          <span>Categorías destacadas</span>
        </SectionTitle>
        {categoriasDestacadas.length === 0 ? (
          <EmptyState>
            Aún no hay datos suficientes para mostrar categorías.
          </EmptyState>
        ) : (
          <CategoryList>
            {categoriasDestacadas.map((categoria) => (
              <li key={categoria.nombre}>
                <div className="encabezado">
                  <span className="nombre">{categoria.nombre}</span>
                  <span className="total">
                    {currencyFormatter.format(categoria.total)}
                  </span>
                </div>
                <div className="detalle">
                  <span className="badge ingresos">
                    Ingresos:{" "}
                    {currencyFormatter.format(categoria.ingresos)}
                  </span>
                  <span className="badge gastos">
                    Gastos:{" "}
                    {currencyFormatter.format(categoria.gastos)}
                  </span>
                  <span className="badge porcentaje">
                    {categoria.porcentaje.toFixed(1)}% del total
                  </span>
                </div>
              </li>
            ))}
          </CategoryList>
        )}
      </section>

      <section className="movimientos">
        <SectionTitle>
          <v.iconotodos />
          <span>Movimientos recientes</span>
        </SectionTitle>
        <MovimientosTable>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.slice(0, 10).map((movimiento) => (
              <tr key={movimiento.id}>
                <td>
                  {new Date(movimiento.fecha).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>{movimiento.descripcion}</td>
                <td>{movimiento.categorias?.descripcion || "Sin categoría"}</td>
                <td
                  className={
                    movimiento.tipo === "i" ? "ingreso" : "gasto"
                  }
                >
                  {currencyFormatter.format(Number(movimiento.monto) || 0)}
                </td>
                <td>{movimiento.tipo === "i" ? "Ingreso" : "Gasto"}</td>
              </tr>
            ))}
            {movimientosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="sin-datos">
                  No hay movimientos que coincidan con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </MovimientosTable>
      </section>
    </Container>
  );
}

DashboardTemplate.propTypes = {
  cargando: PropTypes.bool.isRequired,
  filtros: PropTypes.shape({
    rango: PropTypes.oneOf(["3m", "6m", "12m", "all"]).isRequired,
    tipo: PropTypes.oneOf(["todos", "i", "g"]).isRequired,
    categoria: PropTypes.string.isRequired,
  }).isRequired,
  onFiltroChange: PropTypes.func.isRequired,
  opcionesCategorias: PropTypes.arrayOf(PropTypes.string).isRequired,
  resumenActual: PropTypes.shape({
    ingresos: PropTypes.number.isRequired,
    gastos: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
    promedioMensual: PropTypes.number.isRequired,
  }).isRequired,
  comparativas: PropTypes.arrayOf(
    PropTypes.shape({
      titulo: PropTypes.string.isRequired,
      actual: PropTypes.number.isRequired,
      anterior: PropTypes.number.isRequired,
      variacion: PropTypes.number.isRequired,
      descripcion: PropTypes.string.isRequired,
    })
  ).isRequired,
  categoriasDestacadas: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      ingresos: PropTypes.number.isRequired,
      gastos: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      porcentaje: PropTypes.number.isRequired,
    })
  ).isRequired,
  movimientosFiltrados: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      descripcion: PropTypes.string.isRequired,
      monto: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      fecha: PropTypes.string.isRequired,
      tipo: PropTypes.oneOf(["i", "g"]).isRequired,
      categorias: PropTypes.shape({
        descripcion: PropTypes.string,
        color: PropTypes.string,
      }),
    })
  ).isRequired,
  datosGraficoCategorias: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      valor: PropTypes.number.isRequired,
    })
  ).isRequired,
  datosSerieTemporal: PropTypes.arrayOf(
    PropTypes.shape({
      periodo: PropTypes.string.isRequired,
      ingresos: PropTypes.number.isRequired,
      gastos: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" auto
    "filtros" auto
    "metricas" auto
    "graficos" auto
    "comparativas" auto
    "categorias" auto
    "movimientos" auto;
  gap: 24px;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }

  .filtros {
    grid-area: filtros;
  }

  .metricas {
    grid-area: metricas;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
  }

  .comparativas {
    grid-area: comparativas;
  }

  .graficos {
    grid-area: graficos;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
  }

  .categorias {
    grid-area: categorias;
  }

  .movimientos {
    grid-area: movimientos;
  }
`;

const FiltersCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 18px;
  padding: 20px;
  box-shadow: ${() => v.boxshadowGray};
  display: flex;
  flex-direction: column;
  gap: 16px;

  .titulo {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .filtros-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .campo {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 0.85rem;
      opacity: 0.8;
    }

    select {
      background: ${({ theme }) => theme.bg3};
      color: ${({ theme }) => theme.text};
      border-radius: 10px;
      border: none;
      padding: 10px;
      font-size: 0.95rem;
      outline: none;
    }
  }
`;

const Card = styled.article`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border-radius: 18px;
  background: ${({ $bg }) => $bg};
  box-shadow: ${() => v.boxshadowGray};

  .icon {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: ${({ $accent }) => $accent};
    background: rgba(0, 0, 0, 0.05);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
      font-size: 0.9rem;
      font-weight: 500;
      opacity: 0.8;
    }

    .value {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
  margin-bottom: 16px;

  svg {
    font-size: 1.6rem;
  }
`;

const ComparativaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

const ComparativaCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 16px;
  padding: 18px;
  box-shadow: ${() => v.boxshadowGray};
  display: flex;
  flex-direction: column;
  gap: 10px;

  h3 {
    font-size: 1rem;
    font-weight: 600;
  }

  .valores {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.95rem;

    .actual {
      font-weight: 600;
    }

    .anterior {
      opacity: 0.75;
    }
  }

  p {
    font-weight: 600;
    font-size: 1.1rem;

    &.positivo {
      color: ${() => v.colorIngresos};
    }

    &.negativo {
      color: ${() => v.colorGastos};
    }
  }

  small {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bg3};
  text-align: center;
  opacity: 0.8;
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 18px;
  padding: 20px;
  box-shadow: ${() => v.boxshadowGray};
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.1rem;
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;

  li {
    border-radius: 14px;
    padding: 18px;
    background: ${({ theme }) => theme.bg};
    box-shadow: ${() => v.boxshadowGray};
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .encabezado {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 1rem;
  }

  .detalle {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.85rem;
  }

  .badge {
    padding: 6px 10px;
    border-radius: 999px;
    background: ${({ theme }) => theme.bg3};
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .ingresos {
    color: ${() => v.colorIngresos};
  }

  .gastos {
    color: ${() => v.colorGastos};
  }

  .porcentaje {
    color: ${({ theme }) => theme.text};
    opacity: 0.8;
  }
`;

const MovimientosTable = styled.table`
  width: 100%;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${() => v.boxshadowGray};
  background: ${({ theme }) => theme.bg};

  th,
  td {
    padding: 14px 16px;
    text-align: left;
  }

  thead {
    background: ${({ theme }) => theme.bg3};
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  tbody tr:nth-child(even) {
    background: ${({ theme }) => theme.bg3};
  }

  tbody tr:nth-child(odd) {
    background: ${({ theme }) => theme.bg};
  }

  .ingreso {
    color: ${() => v.colorIngresos};
    font-weight: 600;
  }

  .gasto {
    color: ${() => v.colorGastos};
    font-weight: 600;
  }

  .sin-datos {
    text-align: center;
    padding: 30px;
    opacity: 0.7;
  }
`;

