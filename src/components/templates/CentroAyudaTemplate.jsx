import styled from "styled-components";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { Header, v } from "../../index";

export function CentroAyudaTemplate({
  faqs,
  recursos,
  soporte,
}) {
  return (
    <Container>
      <header className="header">
        <Header stateConfig={{ state: false, setState: () => {} }} />
      </header>

      <section className="hero">
        <HeroCard>
          <div className="texto">
            <h1>Centro de Ayuda</h1>
            <p>
              Encuentra respuestas rápidas, aprende a sacarle el máximo provecho
              a Cerdys y contáctanos si necesitas soporte personalizado.
            </p>
            <div className="contacto">
              <span><v.iconocheck /> Horario de atención: {soporte.horario}</span>
              <span><v.iconoayuda /> Respuesta estimada: {soporte.tiempoRespuesta}</span>
            </div>
          </div>
          <div className="cta">
            <button type="button" onClick={() => window.open(`mailto:${soporte.email}`)}>
              Escribir al soporte
              <v.iconoflechaderecha />
            </button>
            <a href={soporte.linkDocumentacion} target="_blank" rel="noreferrer">
              Ir a la documentación
            </a>
          </div>
        </HeroCard>
      </section>

      <section className="contenido">
        <Card>
          <h2>
            <v.iconoayuda />
            Preguntas frecuentes
          </h2>
          <FAQList>
            {faqs.map((faq) => (
              <li key={faq.pregunta}>
                <details>
                  <summary>{faq.pregunta}</summary>
                  <p>{faq.respuesta}</p>
                  {faq.links && faq.links.length > 0 && (
                    <ul className="links">
                      {faq.links.map((link) => (
                        <li key={link.url}>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            {link.texto}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </details>
              </li>
            ))}
          </FAQList>
        </Card>

        <Card>
          <h2>
            <v.iconolineal />
            Recursos recomendados
          </h2>
          <ul className="recursos">
            {recursos.map((recurso) => (
              <li key={recurso.titulo}>
                <div className="contenido">
                  <h3>{recurso.titulo}</h3>
                  <p>{recurso.descripcion}</p>
                  <span className="tipo">{recurso.tipo}</span>
                </div>
                <a href={recurso.url} target="_blank" rel="noreferrer">
                  Ver recurso
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </Container>
  );
}

CentroAyudaTemplate.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      pregunta: PropTypes.string.isRequired,
      respuesta: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          texto: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  recursos: PropTypes.arrayOf(
    PropTypes.shape({
      titulo: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      tipo: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  soporte: PropTypes.shape({
    email: PropTypes.string.isRequired,
    horario: PropTypes.string.isRequired,
    tiempoRespuesta: PropTypes.string.isRequired,
    linkDocumentacion: PropTypes.string.isRequired,
  }).isRequired,
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
    "contenido" 1fr;
  gap: 24px;

  .header {
    grid-area: header;
  }

  .hero {
    grid-area: hero;
  }

  .contenido {
    grid-area: contenido;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 18px;
  }
`;

const HeroCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 24px;
  padding: 32px;
  box-shadow: ${() => v.boxshadowGray};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  align-items: center;

  .texto {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h1 {
      font-size: 2rem;
      margin: 0;
    }
    p {
      opacity: 0.75;
    }
    .contacto {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.9rem;
      opacity: 0.8;
      span {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
    }
  }

  .cta {
    display: flex;
    flex-direction: column;
    gap: 12px;

    button {
      border: none;
      border-radius: 999px;
      padding: 12px 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: ${() => v.colorselector};
      color: #fff;
      font-weight: 600;
      cursor: pointer;
    }

    a {
      color: ${({ theme }) => theme.text};
      opacity: 0.8;
      text-decoration: none;
      &:hover {
        opacity: 1;
      }
    }
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 18px;
  padding: 24px;
  box-shadow: ${() => v.boxshadowGray};
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
  }

  .recursos {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;

    li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      background: ${({ theme }) => theme.bg3};
      padding: 14px 18px;
      border-radius: 14px;

      .contenido {
        display: flex;
        flex-direction: column;
        gap: 6px;

        h3 {
          margin: 0;
        }

        p {
          margin: 0;
          opacity: 0.75;
        }

        .tipo {
          font-size: 0.8rem;
          opacity: 0.7;
        }
      }

      a {
        align-self: center;
        font-weight: 600;
        color: ${() => v.colorselector};
        text-decoration: none;
      }
    }
  }
`;

const FAQList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  details {
    background: ${({ theme }) => theme.bg3};
    border-radius: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s ease;

    summary {
      font-weight: 600;
      outline: none;
    }

    p {
      margin: 10px 0 0;
      opacity: 0.8;
      line-height: 1.4;
    }

    .links {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      list-style: none;
      padding: 0;

      li {
        background: ${({ theme }) => theme.bg};
        padding: 6px 10px;
        border-radius: 8px;
      }

      a {
        color: ${() => v.colorselector};
        text-decoration: none;
        font-size: 0.85rem;
      }
    }

    &:hover {
      background: ${({ theme }) => theme.bg};
    }
  }
`;

