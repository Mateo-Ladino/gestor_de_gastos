import styled from "styled-components";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header, v } from "../../index";

export function HomeTemplate({
  user,
  resumen,
  enlacesRapidos,
  movimientosRecientes,
}) {
  const navigate = useNavigate();

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

  return (
    <Container>
      <header className="header">
        <Header stateConfig={{ state: false, setState: () => {} }} />
      </header>

      <section className="hero">
        <HeroCard>
          <div className="texto">
            <span className="hola">¡Hola, {user?.name || "cerdy" }!</span>
            <h1>Tus finanzas al día</h1>
            <p>
              Revisa el resumen de tus movimientos, crea nuevas operaciones y
              controla tus categorías desde un solo lugar.
            </p>
            <button type="button" onClick={() => navigate("/movimientos")}>
              Registrar movimiento
              <v.flechaarribalarga />
            </button>
          </div>
        </HeroCard>
      </section>

      <section className="metricas">
        <MetricCard $variant="ingresos">
          <div className="icono">
            <v.flechaarribalarga />
          </div>
          <div className="contenido">
            <span className="titulo">Ingresos del periodo</span>
            <span className="valor">{currencyFormatter.format(resumen.ingresos)}</span>
          </div>
        </MetricCard>

        <MetricCard $variant="gastos">
          <div className="icono">
            <v.flechaabajolarga />
          </div>
          <div className="contenido">
            <span className="titulo">Gastos del periodo</span>
            <span className="valor">{currencyFormatter.format(resumen.gastos)}</span>
          </div>
        </MetricCard>

        <MetricCard $variant="balance">
          <div className="icono">
            <v.balance />
          </div>
          <div className="contenido">
            <span className="titulo">Balance</span>
            <span className="valor">{currencyFormatter.format(resumen.balance)}</span>
          </div>
        </MetricCard>
      </section>

      <section className="enlaces">
        <SectionTitle>
          <v.iconotodos />
          <span>Accesos rápidos</span>
        </SectionTitle>
        <CardsGrid>
          {enlacesRapidos.map((enlace) => (
            <AccionCard
              key={enlace.titulo}
              $color={enlace.color}
              onClick={() => navigate(enlace.url)}
            >
              <div className="icono">{enlace.icono}</div>
              <div className="contenido">
                <h3>{enlace.titulo}</h3>
                <p>{enlace.descripcion}</p>
              </div>
              <v.iconoflechaderecha className="flecha" />
            </AccionCard>
          ))}
        </CardsGrid>
      </section>

      <section className="recientes">
        <SectionTitle>
          <v.iconolineal />
          <span>Movimientos recientes</span>
        </SectionTitle>
        <RecientesCard>
          {movimientosRecientes.length === 0 ? (
            <div className="sin-datos">
              <v.iconopie />
              <p>Todavía no tienes movimientos registrados.</p>
              <button type="button" onClick={() => navigate("/movimientos")}>
                Crear primer movimiento
              </button>
            </div>
          ) : (
            <ul>
              {movimientosRecientes.map((movimiento) => (
                <li key={movimiento.id}>
                  <div className="descripcion">
                    <span className="categoria">
                      {movimiento.categorias?.descripcion || "Sin categoría"}
                    </span>
                    <span className="titulo">{movimiento.descripcion}</span>
                    <small>
                      {new Date(movimiento.fecha).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </small>
                  </div>
                  <div
                    className={`monto ${
                      movimiento.tipo === "i" ? "ingreso" : "gasto"
                    }`}
                  >
                    {movimiento.tipo === "i" ? "+" : "-"}{" "}
                    {currencyFormatter.format(Number(movimiento.monto) || 0)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </RecientesCard>
      </section>
    </Container>
  );
}

HomeTemplate.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  resumen: PropTypes.shape({
    ingresos: PropTypes.number.isRequired,
    gastos: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  enlacesRapidos: PropTypes.arrayOf(
    PropTypes.shape({
      titulo: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      icono: PropTypes.node.isRequired,
    })
  ).isRequired,
  movimientosRecientes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      descripcion: PropTypes.string.isRequired,
      monto: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      fecha: PropTypes.string.isRequired,
      tipo: PropTypes.oneOf(["i", "g"]).isRequired,
      categorias: PropTypes.shape({
        descripcion: PropTypes.string,
      }),
    })
  ).isRequired,
};

HomeTemplate.defaultProps = {
  user: null,
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
    "hero" auto
    "metricas" auto
    "enlaces" auto
    "recientes" 1fr;
  gap: 24px;

  .header {
    grid-area: header;
  }

  .hero {
    grid-area: hero;
  }

  .metricas {
    grid-area: metricas;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
  }

  .enlaces {
    grid-area: enlaces;
  }

  .recientes {
    grid-area: recientes;
  }
`;

const HeroCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  background: linear-gradient(135deg, #bf94ff 0%, #7b61ff 100%);
  color: #fff;
  border-radius: 24px;
  padding: 32px;
  position: relative;
  overflow: hidden;

  .texto {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .hola {
      font-size: 1rem;
      font-weight: 500;
      opacity: 0.9;
    }

    h1 {
      font-size: 2.4rem;
      font-weight: 700;
      margin: 0;
    }

    p {
      max-width: 420px;
      line-height: 1.4;
      opacity: 0.95;
    }

    button {
      margin-top: 10px;
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #fff;
      color: #4c1d95;
      font-weight: 600;
      border: none;
      border-radius: 999px;
      padding: 10px 18px;
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 18px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: ${() => v.boxshadowGray};
  border-left: 4px solid
    ${({ $variant }) =>
      $variant === "ingresos"
        ? v.colorIngresos
        : $variant === "gastos"
        ? v.colorGastos
        : v.colorselector};

  .icono {
    width: 50px;
    height: 50px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: ${({ $variant }) =>
      $variant === "ingresos"
        ? v.colorIngresos
        : $variant === "gastos"
        ? v.colorGastos
        : v.colorselector};
    background: ${({ theme }) => theme.bg3};
  }

  .contenido {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .titulo {
      font-size: 0.9rem;
      opacity: 0.75;
    }

    .valor {
      font-size: 1.6rem;
      font-weight: 700;
    }
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3rem;
  margin-bottom: 16px;

  svg {
    font-size: 1.6rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
`;

const AccionCard = styled.button`
  border: none;
  text-align: left;
  background: ${({ theme }) => theme.bg};
  border-radius: 18px;
  padding: 20px;
  box-shadow: ${() => v.boxshadowGray};
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.12);
  }

  .icono {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $color }) => `${$color}22`};
    color: ${({ $color }) => $color};
    font-size: 24px;
  }

  .contenido {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;

    h3 {
      font-size: 1.1rem;
      margin: 0;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }

  .flecha {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.text};
    opacity: 0.6;
  }
`;

const RecientesCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 18px;
  padding: 20px;
  box-shadow: ${() => v.boxshadowGray};

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid ${({ theme }) => theme.bg3};

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  .descripcion {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .categoria {
      font-size: 0.85rem;
      opacity: 0.7;
    }

    .titulo {
      font-weight: 600;
      font-size: 1rem;
    }

    small {
      opacity: 0.65;
    }
  }

  .monto {
    font-weight: 600;
    font-size: 1.1rem;

    &.ingreso {
      color: ${() => v.colorIngresos};
    }

    &.gasto {
      color: ${() => v.colorGastos};
    }
  }

  .sin-datos {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 30px 0;
    text-align: center;

    svg {
      font-size: 2.2rem;
      opacity: 0.6;
    }

    button {
      border: none;
      border-radius: 999px;
      background: ${() => v.colorselector};
      color: #fff;
      padding: 10px 18px;
      font-weight: 600;
      cursor: pointer;
    }
  }
`;