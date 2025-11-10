/**
 * COMPONENTE: TablaMovimientos
 * 
 * Este componente muestra todos los movimientos del usuario en formato de tabla.
 * Incluye funcionalidades de paginación, acciones (editar/eliminar) y diseño responsive.
 * 
 * FUNCIONALIDADES:
 * - Mostrar movimientos en formato tabla
 * - Paginación automática cuando hay muchos registros
 * - Botones de acción para editar y eliminar
 * - Diseño responsive para móviles
 * - Estado vacío cuando no hay movimientos
 * - Confirmación antes de eliminar
 * 
 * PROPS:
 * - data: Array con los movimientos a mostrar
 * - SetopenRegistro: Función para abrir el modal de registro
 * - setdataSelect: Función para guardar datos del movimiento a editar
 * - setAccion: Función para establecer la acción ("Editar")
 * - funcionEditar: Función para editar un movimiento
 * - funcionEliminar: Función para eliminar un movimiento
 */

import styled from "styled-components";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { ContentAccionesTabla } from "./ContentAccionesTabla";
import { Paginacion } from "./Paginacion";
import { v } from "../../../styles/variables";

export function TablaMovimientos({
  data,
  SetopenRegistro,
  setdataSelect,
  setAccion,
  funcionEditar,
  funcionEliminar,
}) {
  // ===== ESTADOS LOCALES =====
  
  // Estado para controlar la página actual de la paginación
  const [pagina, setPagina] = useState(1);
  
  // Estado para controlar cuántos elementos mostrar por página
  const [porPagina, setPorPagina] = useState(10);
  
  // Calcular el número máximo de páginas
  const mx = data.length / porPagina;
  const maximo = mx < 1 ? 1 : mx;

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

  // ===== FUNCIONES =====
  
  /**
   * FUNCIÓN: eliminar
   * 
   * Muestra una confirmación antes de eliminar un movimiento.
   * Si el usuario confirma, llama a la función de eliminación.
   * 
   * @param {Object} movimiento - Datos del movimiento a eliminar
   */
  function eliminar(movimiento) {
    // Mostrar diálogo de confirmación usando SweetAlert2
    Swal.fire({
      title: "¿Estás seguro?", // Título del diálogo
      text: "Una vez eliminado, ¡no podrás recuperar este movimiento!", // Mensaje de advertencia
      icon: "warning", // Ícono de advertencia
      showCancelButton: true, // Mostrar botón de cancelar
      confirmButtonColor: "#3085d6", // Color del botón de confirmación
      cancelButtonColor: "#d33", // Color del botón de cancelar
      confirmButtonText: "Sí, eliminar", // Texto del botón de confirmación
    }).then(async (result) => {
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        await funcionEliminar(movimiento); // Llamar a la función de eliminación
      }
    });
  }

  /**
   * FUNCIÓN: editar
   * 
   * Abre el modal de registro en modo "Editar" con los datos del movimiento seleccionado.
   * 
   * @param {Object} movimiento - Datos del movimiento a editar
   */
  function editar(movimiento) {
    SetopenRegistro(true); // Abrir el modal
    setdataSelect(movimiento); // Guardar los datos del movimiento
    setAccion("Editar"); // Establecer la acción como "Editar"
  }

  // ===== CÁLCULOS DE PAGINACIÓN =====
  
  // Calcular el índice de inicio para la página actual
  const inicio = (pagina - 1) * porPagina;
  
  // Calcular el índice de fin para la página actual
  const fin = inicio + porPagina;
  
  // Obtener solo los datos de la página actual
  const datosPaginados = data.slice(inicio, fin);

  // ===== RENDERIZADO (JSX) =====
  
  return (
    <>
      <Container>
        {/* ===== TABLA DE MOVIMIENTOS ===== */}
        <table className="responsive-table">
          {/* ===== CABECERA DE LA TABLA ===== */}
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          
          {/* ===== CUERPO DE LA TABLA ===== */}
          <tbody>
            {datosPaginados.map((movimiento, index) => (
              <tr key={movimiento.id}>
                {/* ===== COLUMNA: DESCRIPCIÓN ===== */}
                <td data-title="Descripción">
                  <div className="descripcion-content">
                    {/* Mostrar ícono de la categoría o ícono por defecto */}
                    <span className="icono">{movimiento.categorias?.icono || "💰"}</span>
                    <span>{movimiento.descripcion}</span>
                  </div>
                </td>
                
                {/* ===== COLUMNA: CATEGORÍA ===== */}
                <td data-title="Categoría">
                  <div className="categoria-content">
                    {/* Indicador de color de la categoría */}
                    <div 
                      className="color-indicator"
                      style={{ backgroundColor: movimiento.categorias?.color || "#F44336" }}
                    ></div>
                    <span>{movimiento.categorias?.descripcion || "Sin categoría"}</span>
                  </div>
                </td>
                
                {/* ===== COLUMNA: MONTO ===== */}
                <td data-title="Monto">
                  <span className={`monto ${movimiento.tipo === 'i' ? 'ingreso' : 'gasto'}`}>
                    {movimiento.tipo === 'i' ? '+' : '-'}{" "}
                    {currencyFormatter.format(Number(movimiento.monto) || 0)}
                  </span>
                </td>
                
                {/* ===== COLUMNA: FECHA ===== */}
                <td data-title="Fecha">
                  {/* Formatear fecha en formato español */}
                  {new Date(movimiento.fecha).toLocaleDateString('es-ES')}
                </td>
                
                {/* ===== COLUMNA: ACCIONES ===== */}
                <td data-title="Acciones">
                  <ContentAccionesTabla
                    funcionEditar={() => editar(movimiento)} // Función para editar
                    funcionEliminar={() => eliminar(movimiento)} // Función para eliminar
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== PAGINACIÓN ===== */}
        {/* Solo mostrar paginación si hay más elementos que los que caben en una página */}
        {data.length > porPagina && (
          <Paginacion
            pagina={pagina} // Página actual
            setPagina={setPagina} // Función para cambiar página
            maximo={maximo} // Número máximo de páginas
          />
        )}

        {/* ===== ESTADO VACÍO ===== */}
        {/* Mostrar mensaje cuando no hay movimientos */}
        {data.length === 0 && (
          <div className="no-data">
            <div className="no-data-content">
              <span className="icono">{v.iconotodos}</span>
              <p>No hay movimientos registrados</p>
              <small>Agrega tu primer movimiento para comenzar</small>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

// ===== ESTILOS CSS =====

/**
 * CONTAINER PRINCIPAL DE LA TABLA
 * 
 * Contenedor que maneja el scroll horizontal y el diseño general de la tabla.
 */
const Container = styled.div`
  width: 100%; /* Ancho completo */
  overflow-x: auto; /* Scroll horizontal si la tabla es muy ancha */

  /* ===== TABLA RESPONSIVE ===== */
  .responsive-table {
    width: 100%; /* Ancho completo */
    border-collapse: collapse; /* Unir bordes de celdas */
    margin-bottom: 20px; /* Espacio inferior */
    background: ${({ theme }) => theme.bg}; /* Color de fondo según el tema */
    border-radius: 8px; /* Esquinas redondeadas */
    overflow: hidden; /* Ocultar contenido que se salga */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra sutil */

    /* ===== CABECERA DE LA TABLA ===== */
    th {
      background: ${({ theme }) => theme.bg2}; /* Color de fondo de cabecera */
      color: ${({ theme }) => theme.text}; /* Color del texto */
      padding: 15px; /* Espaciado interno */
      text-align: left; /* Alineación a la izquierda */
      font-weight: 600; /* Texto en negrita */
      border-bottom: 2px solid ${({ theme }) => theme.bg3}; /* Borde inferior */
    }

    /* ===== CELDAS DE LA TABLA ===== */
    td {
      padding: 15px; /* Espaciado interno */
      border-bottom: 1px solid ${({ theme }) => theme.bg3}; /* Borde inferior sutil */
      color: ${({ theme }) => theme.text}; /* Color del texto */
    }

    /* ===== EFECTO HOVER EN FILAS ===== */
    tr:hover {
      background: ${({ theme }) => theme.bg2}; /* Cambiar fondo al pasar el mouse */
    }

    /* ===== CONTENIDO DE DESCRIPCIÓN ===== */
    .descripcion-content {
      display: flex; /* Layout flexbox */
      align-items: center; /* Centrar verticalmente */
      gap: 10px; /* Espacio entre ícono y texto */

      .icono {
        font-size: 1.2rem; /* Tamaño del ícono */
      }
    }

    /* ===== CONTENIDO DE CATEGORÍA ===== */
    .categoria-content {
      display: flex; /* Layout flexbox */
      align-items: center; /* Centrar verticalmente */
      gap: 10px; /* Espacio entre indicador y texto */

      .color-indicator {
        width: 12px; /* Ancho del indicador */
        height: 12px; /* Alto del indicador */
        border-radius: 50%; /* Forma circular */
      }
    }

    /* ===== ESTILOS DE MONTO ===== */
    .monto {
      font-weight: 600; /* Texto en negrita */
      font-size: 1.1rem; /* Tamaño de fuente ligeramente mayor */

      /* ===== MONTO DE INGRESO ===== */
      &.ingreso {
        color: #53B257; /* Color verde para ingresos */
      }

      /* ===== MONTO DE GASTO ===== */
      &.gasto {
        color: #fe6156; /* Color rojo para gastos */
      }
    }
  }

  /* ===== ESTADO VACÍO ===== */
  .no-data {
    display: flex; /* Layout flexbox */
    justify-content: center; /* Centrar horizontalmente */
    align-items: center; /* Centrar verticalmente */
    min-height: 200px; /* Altura mínima */
    text-align: center; /* Centrar texto */

    .no-data-content {
      .icono {
        font-size: 3rem; /* Ícono grande */
        opacity: 0.5; /* Semi-transparente */
        margin-bottom: 15px; /* Espacio inferior */
        display: block; /* Mostrar como bloque */
      }

      p {
        font-size: 1.2rem; /* Tamaño de fuente */
        margin-bottom: 5px; /* Espacio inferior */
        color: ${({ theme }) => theme.text}; /* Color del texto */
      }

      small {
        color: ${({ theme }) => theme.textSecondary}; /* Color secundario */
      }
    }
  }

  /* ===== RESPONSIVE: PANTALLAS PEQUEÑAS ===== */
  @media (max-width: 768px) {
    .responsive-table {
      /* Reducir padding en móviles */
      th, td {
        padding: 10px 8px;
        font-size: 0.9rem; /* Texto más pequeño */
      }

      /* Ajustar tamaño de fuente del monto */
      .monto {
        font-size: 1rem;
      }
    }
  }
`;