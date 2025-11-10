import styled from "styled-components";
import PropTypes from "prop-types";
import { Header, v } from "../../index";

export function AcercaDeTemplate({ equipo, tecnologias, version }) {
  return (
    <Container>
      <header className="header">
        <Header stateConfig={{ state: false, setState: () => {} }} />
      </header>

      <section className="hero">
        <HeroCard>
          <div className="texto">
            <h1>Acerca de Cerdys</h1>
            <p>
              Cerdys nació para ayudarte a entender tus finanzas, tomar mejores
              decisiones y alcanzar tus metas sin complicaciones. Administra
              ingresos, gastos, categorías e informes en un mismo lugar.
            </p>
            <div className="version">
              <span>Versión actual</span>
              <strong>{version}</strong>
            </div>
          </div>
          <div className="ilustracion">
            <v.iconopie />
          </div>
        </HeroCard>
      </section>

      <section className="cards">
        <Card>
          <h2>
            <v.iconosupabase />
            Tecnologías
          </h2>
          <ul>
            {tecnologias.map((tecnologia) => (
              <li key={tecnologia}>{tecnologia}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2>
            <v.iconoUser />
            Equipo
          </h2>
          <ul>
            {equipo.map((miembro) => (
              <li key={miembro.nombre}>
                <span className="nombre">{miembro.nombre}</span>
                <small>{miembro.rol}</small>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </Container>
  );
}

AcercaDeTemplate.propTypes = {
  equipo: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      rol: PropTypes.string.isRequired,
    })
  ).isRequired,
  tecnologias: PropTypes.arrayOf(PropTypes.string).isRequired,
  version: PropTypes.string.isRequired,
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
    "cards" 1fr;
  gap: 24px;

  .header {
    grid-area: header;
  }
  .hero {
    grid-area: hero;
  }
  .cards {
    grid-area: cards;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
  }
`;

const HeroCard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  align-items: center;
  gap: 24px;
  background: ${({ theme }) => theme.bg};
  border-radius: 24px;
  padding: 32px;
  box-shadow: ${() => v.boxshadowGray};

  .texto {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h1 {
      font-size: 2rem;
      margin: 0;
    }
    p {
      opacity: 0.8;
      line-height: 1.5;
    }
    .version {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: ${({ theme }) => theme.bg3};
      border-radius: 999px;
      padding: 8px 16px;
      font-size: 0.9rem;
      strong {
        font-size: 1rem;
      }
    }
  }

  .ilustracion {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem;
    color: ${() => v.colorselector};
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 18px;
  padding: 24px;
  box-shadow: ${() => v.boxshadowGray};
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${({ theme }) => theme.bg3};
    padding: 10px 14px;
    border-radius: 12px;
    font-weight: 500;
  }

  .nombre {
    font-weight: 600;
  }

  small {
    opacity: 0.7;
  }
`;

