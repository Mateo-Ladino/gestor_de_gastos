/**
 * COMPONENTE: MovimientosTemplate
 * 
 * Este es el template principal del módulo de movimientos. Es como el "esqueleto"
 * que organiza todos los elementos de la página de movimientos:
 * 
 * FUNCIONALIDADES:
 * - Mostrar el título de la página
 * - Permitir cambiar entre tipos de movimientos (Ingresos/Gastos)
 * - Mostrar filtros (aunque aún no implementados)
 * - Botón para agregar nuevos movimientos
 * - Tabla que muestra todos los movimientos
 * - Modal para crear/editar movimientos
 * 
 * PROPS:
 * - data: Array con todos los movimientos del usuario
 */

import styled from "styled-components";
import { useState } from "react";
import { useOperaciones } from "../../store/OperacionesStore";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { useMovimientosStore } from "../../store/MovimientosStore";
import { v } from "../../styles/variables";
import { DataDesplegableTipo } from "../../utils/dataEstatica";
import { Btndesplegable } from "../moleculas/Btndesplegable";
import { Btnfiltro } from "../moleculas/Btnfiltro";
import { BtnCircular } from "../moleculas/BtnCircular";
import { ListaMenuDesplegable } from "../moleculas/ListaMenuDesplegable";
import { TablaMovimientos } from "../organismos/tablas/TablaMovimientos";
import { RegistrarMovimiento } from "../organismos/formularios/RegistrarMovimiento";

export function MovimientosTemplate({ data }) {
  // ===== ESTADOS LOCALES =====
  
  // Estado para controlar si el modal de registro está abierto
  const [openRegistro, SetopenRegistro] = useState(false);
  
  // Estado para saber qué acción realizar: "Insertar" o "Editar"
  const [accion, setAccion] = useState("");
  
  // Estado para guardar los datos del movimiento a editar
  const [dataSelect, setdataSelect] = useState([]);
  
  // Estado para controlar si el menú de filtros está abierto
  const [state, setState] = useState(false);
  
  // Estado para controlar si el menú de tipos está abierto
  const [stateTipo, setStateTipo] = useState(false);

  // ===== STORES GLOBALES =====
  
  // Store de operaciones: contiene el tipo actual (Ingresos/Gastos) y colores
  const { tipo, tituloBtnDes, colorCategoria, bgCategoria, setTipo } = useOperaciones();
  
  // Store de movimientos: funciones para insertar, editar y eliminar
  const { insertarMovimiento, eliminarMovimiento, editarMovimiento } = useMovimientosStore();
  
  // Store de usuarios: datos del usuario actual
  const { datausuarios } = useUsuariosStore();

  // ===== FUNCIONES =====
  
  /**
   * FUNCIÓN: cerrarDesplegables
   * 
   * Esta función se ejecuta cuando el usuario hace click en cualquier parte del template.
   * Su propósito es cerrar los menús desplegables (filtros y tipos) cuando el usuario
   * hace click fuera de ellos.
   * 
   * @param {Event} e - Evento de click del mouse
   */
  const cerrarDesplegables = (e) => {
    // Solo cerrar si el click NO es en un botón
    // Esto evita que se cierren los menús cuando el usuario hace click en los botones
    if (e.target.closest('button') || e.target.closest('[role="button"]')) {
      return; // No hacer nada si el click es en un botón
    }
    // Cerrar ambos menús desplegables
    setState(false); // Cerrar menú de filtros
    setStateTipo(false); // Cerrar menú de tipos
  };

  /**
   * FUNCIÓN: funcionInsertar
   * 
   * Esta función se ejecuta cuando el usuario hace click en el botón "+" para agregar
   * un nuevo movimiento. Abre el modal de registro en modo "Insertar".
   */
  const funcionInsertar = () => {
    SetopenRegistro(true); // Abrir el modal
    setAccion("Insertar"); // Indicar que es una inserción
    setdataSelect([]); // Limpiar datos de selección
  };

  /**
   * FUNCIÓN: funcionEditar
   * 
   * Esta función se ejecuta cuando el usuario hace click en el botón "Editar" de la tabla.
   * Abre el modal de registro en modo "Editar" con los datos del movimiento seleccionado.
   * 
   * @param {Object} data - Datos del movimiento a editar
   */
  const funcionEditar = (data) => {
    SetopenRegistro(true); // Abrir el modal
    setAccion("Editar"); // Indicar que es una edición
    setdataSelect(data); // Guardar los datos del movimiento a editar
  };

  /**
   * FUNCIÓN: funcionEliminar
   * 
   * Esta función se ejecuta cuando el usuario hace click en el botón "Eliminar" de la tabla.
   * Elimina el movimiento de la base de datos.
   * 
   * @param {Object} data - Datos del movimiento a eliminar
   */
  const funcionEliminar = async (data) => {
    await eliminarMovimiento({ 
      id: data.id, // ID del movimiento a eliminar
      idusuario: datausuarios.id // ID del usuario propietario
    });
  };

  // ===== RENDERIZADO (JSX) =====
  
  return (
    <Container onClick={cerrarDesplegables}>
      
      {/* ===== CABECERA DE LA PÁGINA ===== */}
      <header className="header">
        <h1>Movimientos</h1>
      </header>

      {/* ===== SECCIÓN DE TIPO DE MOVIMIENTO ===== */}
      <section className="tipo">
        {/* Botón desplegable para cambiar entre Ingresos y Gastos */}
        <Btndesplegable
          textcolor={colorCategoria} // Color del texto del botón
          bgcolor={bgCategoria} // Color de fondo del botón
          funcion={(e) => {
            e?.stopPropagation?.(); // Evitar que se cierre el menú al hacer click
            setStateTipo(!stateTipo); // Abrir/cerrar el menú de tipos
          }}
          text={tituloBtnDes} // Texto que muestra el tipo actual
        />
        
        {/* Menú desplegable con las opciones de tipo */}
        {stateTipo && (
          <ListaMenuDesplegable
            data={DataDesplegableTipo} // Datos con las opciones: Ingresos y Gastos
            top="60px" // Posición desde arriba
            funcion={(item) => {
              setTipo(item); // Cambiar el tipo seleccionado
              setStateTipo(false); // Cerrar el menú
            }}
          />
        )}
      </section>

      {/* ===== SECCIÓN DE FILTROS Y BOTÓN AGREGAR ===== */}
      <section className="area2">
        {/* Botón de filtros (aún no implementado) */}
        <Btnfiltro
          textcolor={colorCategoria}
          bgcolor={bgCategoria}
          funcion={(e) => {
            e?.stopPropagation?.(); // Evitar que se cierre el menú al hacer click
            setState(!state); // Abrir/cerrar el menú de filtros
          }}
          text="Filtros"
        />
        
        {/* Botón circular para agregar nuevo movimiento */}
        <BtnCircular
          funcion={(e) => {
            e?.stopPropagation?.(); // Evitar que se cierre el menú al hacer click
            funcionInsertar(); // Abrir modal para crear movimiento
          }}
          icono="+" // Ícono del botón
          bgcolor={colorCategoria} // Color de fondo
          textcolor="white" // Color del texto
          width="50px" // Ancho del botón
          height="50px" // Alto del botón
          fontsize="20px" // Tamaño de la fuente
        />
      </section>

      {/* ===== SECCIÓN PRINCIPAL: TABLA DE MOVIMIENTOS ===== */}
      <section className="main">
        <TablaMovimientos
          data={data} // Datos de los movimientos a mostrar
          SetopenRegistro={SetopenRegistro} // Función para abrir el modal
          setdataSelect={setdataSelect} // Función para guardar datos de edición
          setAccion={setAccion} // Función para establecer la acción
          funcionEditar={funcionEditar} // Función para editar movimiento
          funcionEliminar={funcionEliminar} // Función para eliminar movimiento
        />
      </section>

      {/* ===== MODAL DE REGISTRO/EDICIÓN ===== */}
      {openRegistro && (
        <RegistrarMovimiento
          onClose={() => SetopenRegistro(false)} // Función para cerrar el modal
          dataSelect={dataSelect} // Datos del movimiento a editar (si aplica)
          accion={accion} // Acción: "Insertar" o "Editar"
        />
      )}
    </Container>
  );
}

// ===== ESTILOS CSS =====

/**
 * CONTAINER PRINCIPAL DEL TEMPLATE
 * 
 * Este es el contenedor principal que organiza toda la página de movimientos
 * usando CSS Grid para crear un layout estructurado.
 */
const Container = styled.div`
  min-height: 100vh; /* Altura mínima de toda la pantalla */
  padding: 15px; /* Espaciado interno */
  width: 100%; /* Ancho completo */
  background: ${({ theme }) => theme.bgtotal}; /* Color de fondo según el tema */
  color: ${({ theme }) => theme.text}; /* Color del texto según el tema */
  
  /* ===== LAYOUT CON CSS GRID ===== */
  display: grid;
  grid-template:
    "header header" 80px     /* Fila 1: Cabecera (80px de alto) */
    "tipo area2" 60px        /* Fila 2: Tipo y área de botones (60px de alto) */
    "main main" 1fr          /* Fila 3: Contenido principal (resto del espacio) */
    / 1fr 1fr;              /* Columnas: 2 columnas iguales */

  /* ===== CABECERA DE LA PÁGINA ===== */
  .header {
    grid-area: header; /* Ocupa toda la primera fila */
    display: flex;
    align-items: center; /* Centra verticalmente el contenido */
    
    h1 {
      font-size: 2rem; /* Tamaño grande para el título */
      font-weight: 700; /* Texto en negrita */
    }
  }

  /* ===== SECCIÓN DE TIPO DE MOVIMIENTO ===== */
  .tipo {
    grid-area: tipo; /* Ocupa la primera columna de la segunda fila */
    display: flex;
    align-items: center;
    position: relative; /* Para posicionar el menú desplegable */
  }

  /* ===== SECCIÓN DE FILTROS Y BOTÓN AGREGAR ===== */
  .area2 {
    grid-area: area2; /* Ocupa la segunda columna de la segunda fila */
    display: flex;
    align-items: center;
    justify-content: space-between; /* Distribuye los elementos con espacio entre ellos */
  }

  /* ===== SECCIÓN PRINCIPAL: TABLA ===== */
  .main {
    grid-area: main; /* Ocupa toda la tercera fila */
    overflow-y: auto; /* Scroll vertical si el contenido es muy alto */
  }
`;
