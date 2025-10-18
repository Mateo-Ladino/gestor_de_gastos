/**
 * COMPONENTE: RegistrarMovimiento
 * 
 * Este componente es un formulario modal que permite al usuario:
 * - Crear nuevos movimientos financieros (ingresos o gastos)
 * - Editar movimientos existentes
 * - Seleccionar categorías según el tipo de movimiento
 * 
 * PROPS:
 * - onClose: Función para cerrar el modal
 * - dataSelect: Datos del movimiento a editar (si es edición)
 * - accion: "Insertar" o "Editar" según la acción a realizar
 */

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { v } from "../../../styles/variables";
import { InputText } from "./InputText";
import { Spinner } from "../../moleculas/Spinner";
import { useOperaciones } from "../../../store/OperacionesStore";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { useMovimientosStore } from "../../../store/MovimientosStore";
import { useCategoriasStore } from "../../../store/CategoriasStore";

export function RegistrarMovimiento({ onClose, dataSelect, accion }) {
  // ===== HOOKS Y ESTADO =====
  
  // Hook para manejar el formulario con validaciones
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  // Estados locales del componente
  const [categorias, setCategorias] = useState([]); // Lista de categorías disponibles
  const [estadoProceso, setEstadoproceso] = useState(false); // Estado de carga al guardar

  // Stores globales para obtener datos y funciones
  const { insertarMovimiento, editarMovimiento } = useMovimientosStore(); // Funciones para guardar movimientos
  const { datausuarios } = useUsuariosStore(); // Datos del usuario actual
  const { mostrarCategorias } = useCategoriasStore(); // Función para obtener categorías
  const { tipo } = useOperaciones(); // Tipo actual: "Ingresos" o "Gastos"

  // ===== EFECTOS (useEffect) =====
  
  /**
   * EFECTO 1: Cargar categorías del tipo seleccionado
   * 
   * Este efecto se ejecuta cuando:
   * - El usuario cambia (datausuarios.id)
   * - El tipo de movimiento cambia (Ingresos/Gastos)
   * - La función mostrarCategorias cambia
   * 
   * Su función es obtener las categorías disponibles para el tipo actual
   * y mostrarlas en el dropdown del formulario.
   */
  useEffect(() => {
    const cargarCategorias = async () => {
      // Solo cargar si tenemos un usuario válido
      if (datausuarios?.id) {
        try {
          // Llamar a la función que obtiene categorías desde la base de datos
          const cats = await mostrarCategorias({ 
            idusuario: datausuarios.id, // ID del usuario actual
            tipo: tipo // Tipo: "Ingresos" o "Gastos"
          });
          // Guardar las categorías en el estado local
          setCategorias(cats || []);
        } catch (error) {
          // Si hay error, mostrar array vacío
          console.error("Error al cargar categorías:", error);
          setCategorias([]);
        }
      }
    };
    cargarCategorias();
  }, [datausuarios?.id, tipo, mostrarCategorias]);

  /**
   * EFECTO 2: Cargar datos del movimiento si es edición
   * 
   * Este efecto se ejecuta cuando:
   * - La acción cambia a "Editar"
   * - Los datos del movimiento a editar cambian (dataSelect)
   * 
   * Su función es pre-llenar el formulario con los datos del movimiento
   * que se quiere editar.
   */
  useEffect(() => {
    if (accion === "Editar" && dataSelect) {
      // Pre-llenar cada campo del formulario con los datos existentes
      setValue("descripcion", dataSelect.descripcion);
      setValue("monto", dataSelect.monto);
      setValue("fecha", dataSelect.fecha);
      setValue("idcategoria", dataSelect.idcategoria);
    }
  }, [accion, dataSelect, setValue]);

  // ===== FUNCIONES =====
  
  /**
   * FUNCIÓN: insertar
   * 
   * Esta función se ejecuta cuando el usuario envía el formulario.
   * Puede hacer dos cosas:
   * 1. EDITAR un movimiento existente
   * 2. CREAR un movimiento nuevo
   * 
   * @param {Object} data - Datos del formulario validados por react-hook-form
   */
  async function insertar(data) {
    // ===== CASO 1: EDITAR MOVIMIENTO EXISTENTE =====
    if (accion === "Editar") {
      // Preparar los datos para la edición
      const datosEdicion = {
        descripcion: data.descripcion, // Descripción del movimiento
        monto: parseFloat(data.monto), // Convertir monto a número decimal
        fecha: data.fecha, // Fecha del movimiento
        idcategoria: parseInt(data.idcategoria), // ID de la categoría seleccionada
        id: dataSelect.id, // ID del movimiento a editar
        idusuario: datausuarios.id, // ID del usuario propietario
        tipo: tipo, // Tipo: "Ingresos" o "Gastos"
      };
      
      try {
        setEstadoproceso(true); // Mostrar estado de carga
        await editarMovimiento(datosEdicion); // Llamar a la función de edición
        setEstadoproceso(false); // Ocultar estado de carga
        onClose(); // Cerrar el modal
      } catch (error) {
        setEstadoproceso(false); // Ocultar estado de carga en caso de error
        console.error("Error al editar movimiento:", error);
      }
    } 
    // ===== CASO 2: CREAR MOVIMIENTO NUEVO =====
    else {
      // Preparar los datos para la inserción
      const datosInsercion = {
        descripcion: data.descripcion, // Descripción del movimiento
        monto: parseFloat(data.monto), // Convertir monto a número decimal
        fecha: data.fecha, // Fecha del movimiento
        idcategoria: parseInt(data.idcategoria), // ID de la categoría seleccionada
        idusuario: datausuarios.id, // ID del usuario propietario
        tipo: tipo, // Tipo: "Ingresos" o "Gastos"
      };
      
      try {
        setEstadoproceso(true); // Mostrar estado de carga
        await insertarMovimiento(datosInsercion); // Llamar a la función de inserción
        setEstadoproceso(false); // Ocultar estado de carga
        onClose(); // Cerrar el modal
      } catch (error) {
        setEstadoproceso(false); // Ocultar estado de carga en caso de error
        console.error("Error al insertar movimiento:", error);
      }
    }
  }

  // ===== RENDERIZADO (JSX) =====
  
  return (
    <Container>
      <div className="sub-contenedor">
        {/* ===== CABECERA DEL MODAL ===== */}
        <div className="headers">
          {/* Título dinámico según la acción */}
          <h2>{accion === "Editar" ? "Editar Movimiento" : "Nuevo Movimiento"}</h2>
          {/* Botón X para cerrar el modal */}
          <span onClick={onClose}>×</span>
        </div>

        {/* ===== FORMULARIO ===== */}
        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          
          {/* ===== CAMPO: DESCRIPCIÓN ===== */}
          <InputText
            register={register("descripcion", {
              required: "La descripción es requerida",
              minLength: {
                value: 3,
                message: "Mínimo 3 caracteres",
              },
            })}
            errors={errors.descripcion}
            placeholder="Descripción del movimiento"
            defaultValue={dataSelect?.descripcion || ""}
          />

          {/* ===== CAMPO: MONTO ===== */}
          <InputText
            register={register("monto", {
              required: "El monto es requerido",
              min: {
                value: 0.01,
                message: "El monto debe ser mayor a 0",
              },
            })}
            errors={errors.monto}
            placeholder="Monto"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={dataSelect?.monto || ""}
          />

          {/* ===== CAMPO: FECHA ===== */}
          <InputText
            register={register("fecha", {
              required: "La fecha es requerida",
            })}
            errors={errors.fecha}
            type="date"
            defaultValue={dataSelect?.fecha || new Date().toISOString().split('T')[0]}
          />

          {/* ===== CAMPO: CATEGORÍA ===== */}
          <div className="select-container">
            <select
              {...register("idcategoria", {
                required: "La categoría es requerida",
              })}
              className={errors.idcategoria ? "error" : ""}
            >
              <option value="">Selecciona una categoría</option>
              {/* Mostrar categorías disponibles o mensaje si no hay */}
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.icono} {categoria.descripcion}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No hay categorías disponibles para este tipo
                </option>
              )}
            </select>
            {/* Mostrar error de validación si existe */}
            {errors.idcategoria && (
              <span className="error-message">{errors.idcategoria.message}</span>
            )}
          </div>

          {/* ===== BOTÓN DE GUARDAR ===== */}
          <div className="btnguardarContent">
            <button
              type="submit"
              disabled={estadoProceso}
              style={{
                padding: '12px 24px',
                background: estadoProceso ? '#6c757d' : v.colorSecundario,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: estadoProceso ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              {/* Mostrar spinner y texto según el estado */}
              {estadoProceso ? (
                <>
                  <Spinner />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}

// ===== ESTILOS CSS =====

/**
 * CONTAINER PRINCIPAL
 * 
 * Este es el fondo oscuro que cubre toda la pantalla cuando se abre el modal.
 * Usa position: fixed para mantenerse en su lugar mientras el usuario hace scroll.
 */
const Container = styled.div`
  position: fixed; /* Se mantiene fijo en la pantalla */
  top: 0;
  left: 0;
  width: 100%; /* Cubre toda la pantalla */
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente oscuro */
  display: flex;
  justify-content: center; /* Centra el modal horizontalmente */
  align-items: center; /* Centra el modal verticalmente */
  z-index: 1000; /* Se coloca por encima de otros elementos */

  /* ===== CONTENEDOR DEL MODAL ===== */
  .sub-contenedor {
    background: ${({ theme }) => theme.bgtotal}; /* Color de fondo del modal */
    border-radius: 15px; /* Esquinas redondeadas */
    padding: 25px; /* Espaciado interno */
    width: 90%; /* Ancho del modal */
    max-width: 500px; /* Ancho máximo */
    max-height: 90vh; /* Altura máxima */
    overflow-y: auto; /* Scroll vertical si el contenido es muy alto */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); /* Sombra para dar profundidad */

    /* ===== CABECERA DEL MODAL ===== */
    .headers {
      display: flex;
      justify-content: space-between; /* Título a la izquierda, X a la derecha */
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 2px solid ${({ theme }) => theme.bg3}; /* Línea separadora */
      padding-bottom: 15px;

      h2 {
        color: ${({ theme }) => theme.text}; /* Color del texto del título */
        font-size: 1.5rem;
        font-weight: 600;
      }

      span {
        font-size: 2rem; /* Tamaño grande para el botón X */
        color: ${({ theme }) => theme.textSecondary}; /* Color secundario */
        cursor: pointer; /* Cursor de mano al pasar por encima */
        transition: color 0.3s; /* Transición suave al cambiar color */

        &:hover {
          color: ${({ theme }) => theme.text}; /* Cambia color al hacer hover */
        }
      }
    }

    /* ===== FORMULARIO ===== */
    .formulario {
      display: flex;
      flex-direction: column; /* Campos apilados verticalmente */
      gap: 20px; /* Espacio entre campos */

      /* ===== CONTENEDOR DEL SELECT DE CATEGORÍAS ===== */
      .select-container {
        display: flex;
        flex-direction: column;
        gap: 5px;

        select {
          padding: 12px;
          border: 2px solid ${({ theme }) => theme.bg3}; /* Borde del select */
          border-radius: 8px; /* Esquinas redondeadas */
          background: ${({ theme }) => theme.bg}; /* Color de fondo */
          color: ${({ theme }) => theme.text}; /* Color del texto */
          font-size: 1rem;
          transition: border-color 0.3s; /* Transición suave del borde */

          &:focus {
            outline: none; /* Quita el outline por defecto */
            border-color: ${({ theme }) => theme.primary}; /* Borde azul al enfocar */
          }

          &.error {
            border-color: ${({ theme }) => theme.error}; /* Borde rojo si hay error */
          }
        }

        .error-message {
          color: ${({ theme }) => theme.error}; /* Color rojo para errores */
          font-size: 0.9rem;
          margin-top: 5px;
        }
      }

      /* ===== CONTENEDOR DEL BOTÓN GUARDAR ===== */
      .btnguardarContent {
        display: flex;
        justify-content: center; /* Centra el botón */
        margin-top: 20px;
      }
    }
  }

  /* ===== RESPONSIVE: PANTALLAS PEQUEÑAS ===== */
  @media (max-width: 768px) {
    .sub-contenedor {
      width: 95%; /* Más ancho en móviles */
      padding: 20px; /* Menos padding en móviles */
    }
  }
`;
