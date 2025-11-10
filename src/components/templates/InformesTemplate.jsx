import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Header, v } from "../../index";

const IconIngresos = v.flechaarribalarga;
const IconGastos = v.flechaabajolarga;
const IconBalance = v.balance;
const IconResumen = v.iconocalculadora;
const IconCategorias = v.iconopie;

/**
 * Template principal para el módulo de informes.
 */
export function InformesTemplate({
  resumen,
  resumenMensual = [],
  categoriasDestacadas = [],
  formatCurrency,
}) {
  const [stateUserMenu, setStateUserMenu] = useState(false);
  const format = formatCurrency
    ?? ((valor = 0) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(valor) || 0));

  const cards = [
    {
      label: "Ingresos",
      value: resumen?.ingresos ?? 0,
      icon: <IconIngresos />,
      accent: v.colorIngresos,
      background: v.colorbgingresos,
    },
    {
      label: "Gastos",
      value: resumen?.gastos ?? 0,
      icon: <IconGastos />,
      accent: v.colorGastos,
      background: v.colorbgGastos,
    },
    {
      label: "Balance",
      value: resumen?.balance ?? 0,
      icon: <IconBalance />,
      accent: resumen?.balance >= 0 ? v.colorIngresos : v.colorGastos,
      background: "rgba(210, 110, 249, 0.1)",
    },
  ];

  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{
            state: stateUserMenu,
            setState: () => setStateUserMenu((prev) => !prev),
          }}
        />
      </header>

      <section className="resumen">
        {cards.map((card) => (
          <Card
            key={card.label}
            $bg={card.background}
            $accent={card.accent}
          >
            <div className="icon">{card.icon}</div>
            <div className="info">
              <span className="label">{card.label}</span>
              <span className="value">{format(card.value)}</span>
            </div>
          </Card>
        ))}
      </section>

      <section className="mensual">
        <SectionTitle>
          <IconResumen />
          <span>Resumen mensual</span>
        </SectionTitle>
        {resumenMensual.length === 0 ? (
          <EmptyState>No hay movimientos suficientes para generar un historial.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Ingresos</th>
                <th>Gastos</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {resumenMensual.map((item) => (
                <tr key={item.periodo}>
                  <td>{item.periodo}</td>
                  <td className="ingreso">{format(item.ingresos)}</td>
                  <td className="gasto">{format(item.gastos)}</td>
                  <td className={item.balance >= 0 ? "ingreso" : "gasto"}>
                    {format(item.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className="categorias">
        <SectionTitle>
          <IconCategorias />
          <span>Categorías destacadas</span>
        </SectionTitle>
        {categoriasDestacadas.length === 0 ? (
          <EmptyState>No se encontraron categorías con movimientos.</EmptyState>
        ) : (
          <CategoryList>
            {categoriasDestacadas.map((categoria) => (
              <li key={categoria.nombre}>
                <div className="encabezado">
                  <span className="nombre">{categoria.nombre}</span>
                  <span className="total">{format(categoria.total)}</span>
                </div>
                <div className="detalle">
                  <span className="badge ingresos">
                    Ingresos: {format(categoria.ingresos)}
                  </span>
                  <span className="badge gastos">
                    Gastos: {format(categoria.gastos)}
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
    </Container>
  );
}

InformesTemplate.propTypes = {
  resumen: PropTypes.shape({
    ingresos: PropTypes.number,
    gastos: PropTypes.number,
    balance: PropTypes.number,
  }),
  resumenMensual: PropTypes.arrayOf(
    PropTypes.shape({
      periodo: PropTypes.string.isRequired,
      ingresos: PropTypes.number.isRequired,
      gastos: PropTypes.number.isRequired,
      balance: PropTypes.number.isRequired,
    })
  ),
  categoriasDestacadas: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      ingresos: PropTypes.number.isRequired,
      gastos: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      porcentaje: PropTypes.number.isRequired,
    })
  ),
  formatCurrency: PropTypes.func,
};

InformesTemplate.defaultProps = {
  resumen: {
    ingresos: 0,
    gastos: 0,
    balance: 0,
  },
  resumenMensual: [],
  categoriasDestacadas: [],
  formatCurrency: undefined,
};

const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "resumen" auto
    "mensual" auto
    "categorias" auto;
  gap: 24px;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }

  .resumen {
    grid-area: resumen;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .mensual {
    grid-area: mensual;
  }

  .categorias {
    grid-area: categorias;
  }
`;

const Card = styled.article`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
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
      font-size: 1.6rem;
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

const EmptyState = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bg3};
  text-align: center;
  opacity: 0.8;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${() => v.boxshadowGray};

  thead {
    background: ${({ theme }) => theme.bg3};
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  th,
  td {
    padding: 14px 16px;
    text-align: left;
  }

  tbody tr {
    background: ${({ theme }) => theme.bgtotal};
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

