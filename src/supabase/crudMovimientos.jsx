/**
 * ARCHIVO: crudMovimientos.jsx
 * 
 * Este archivo contiene todas las funciones CRUD (Create, Read, Update, Delete)
 * para manejar los movimientos financieros en la base de datos de Supabase.
 * 
 * FUNCIONALIDADES:
 * - Insertar nuevos movimientos
 * - Obtener movimientos del usuario
 * - Actualizar movimientos existentes
 * - Eliminar movimientos
 * - Calcular resúmenes financieros
 * 
 * TECNOLOGÍAS:
 * - Supabase: Base de datos en la nube
 * - SweetAlert2: Para mostrar notificaciones al usuario
 * 
 * ESTRUCTURA DE DATOS:
 * Cada movimiento tiene los siguientes campos:
 * - id: ID único del movimiento
 * - descripcion: Descripción del movimiento
 * - monto: Cantidad de dinero (número decimal)
 * - fecha: Fecha del movimiento (YYYY-MM-DD)
 * - tipo: Tipo de movimiento ("Ingresos" o "Gastos")
 * - idcategoria: ID de la categoría asociada
 * - idusuario: ID del usuario propietario
 * - created_at: Fecha de creación automática
 * - updated_at: Fecha de última actualización automática
 */

import { supabase } from "../index";
import Swal from "sweetalert2";

/**
 * FUNCIÓN: InsertarMovimiento
 * 
 * Crea un nuevo movimiento en la base de datos.
 * 
 * @param {Object} datosMovimiento - Datos del movimiento a crear
 * @param {string} datosMovimiento.descripcion - Descripción del movimiento
 * @param {number} datosMovimiento.monto - Cantidad de dinero
 * @param {string} datosMovimiento.fecha - Fecha del movimiento
 * @param {number} datosMovimiento.idcategoria - ID de la categoría
 * @param {number} datosMovimiento.idusuario - ID del usuario
 * @param {string} datosMovimiento.tipo - Tipo: "Ingresos" o "Gastos"
 * @returns {Object|null} Datos del movimiento creado o null si hay error
 */
export async function InsertarMovimiento(datosMovimiento) {
  try {
    const { data, error } = await supabase
      .from("movimientos")
      .insert(datosMovimiento)
      .select(`
        *,
        categorias (
          descripcion,
          color,
          icono,
          tipo
        )
      `);
    
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar el movimiento: " + error.message,
      });
      return null;
    }
    
    if (data) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Movimiento guardado",
        showConfirmButton: false,
        timer: 1500,
      });
      return data[0];
    }
  } catch (error) {
    alert("Error al insertar movimiento: " + error.message);
    return null;
  }
}

/**
 * FUNCIÓN: MostrarMovimientos
 * 
 * Obtiene todos los movimientos del usuario desde la base de datos,
 * incluyendo información de las categorías asociadas.
 * 
 * @param {Object} parametros - Parámetros para la consulta
 * @param {number} parametros.idusuario - ID del usuario
 * @param {string} parametros.tipo - Tipo de movimiento ("Ingresos" o "Gastos")
 * @returns {Array} Lista de movimientos con información de categorías
 */
export async function MostrarMovimientos(parametros) {
  try {
    const { data, error } = await supabase
      .from("movimientos")
      .select(`
        *,
        categorias (
          descripcion,
          color,
          icono,
          tipo
        )
      `)
      .eq("idusuario", parametros.idusuario)
      .eq("tipo", parametros.tipo)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error al obtener movimientos:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error en MostrarMovimientos:", error);
    return [];
  }
}

/**
 * FUNCIÓN: EliminarMovimiento
 * 
 * Elimina un movimiento de la base de datos.
 * 
 * @param {Object} parametros - Parámetros para la eliminación
 * @param {number} parametros.id - ID del movimiento a eliminar
 * @param {number} parametros.idusuario - ID del usuario propietario
 * @returns {boolean} true si se eliminó correctamente, false si hay error
 */
export async function EliminarMovimiento(parametros) {
  try {
    const { error } = await supabase
      .from("movimientos")
      .delete()
      .eq("idusuario", parametros.idusuario)
      .eq("id", parametros.id);
    
    if (error) {
      alert("Error al eliminar movimiento: " + error.message);
      return false;
    }
    
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Movimiento eliminado",
      showConfirmButton: false,
      timer: 1500,
    });
    
    return true;
  } catch (error) {
    alert("Error al eliminar movimiento: " + error.message);
    return false;
  }
}

/**
 * FUNCIÓN: EditarMovimiento
 * 
 * Actualiza un movimiento existente en la base de datos.
 * 
 * @param {Object} datosMovimiento - Datos del movimiento a actualizar
 * @param {number} datosMovimiento.id - ID del movimiento a editar
 * @param {string} datosMovimiento.descripcion - Nueva descripción
 * @param {number} datosMovimiento.monto - Nuevo monto
 * @param {string} datosMovimiento.fecha - Nueva fecha
 * @param {number} datosMovimiento.idcategoria - Nueva categoría
 * @param {number} datosMovimiento.idusuario - ID del usuario propietario
 * @param {string} datosMovimiento.tipo - Tipo: "Ingresos" o "Gastos"
 * @returns {boolean} true si se actualizó correctamente, false si hay error
 */
export async function EditarMovimiento(datosMovimiento) {
  try {
    const { data, error } = await supabase
      .from("movimientos")
      .update(datosMovimiento)
      .eq("idusuario", datosMovimiento.idusuario)
      .eq("id", datosMovimiento.id)
      .select(`
        *,
        categorias (
          descripcion,
          color,
          icono,
          tipo
        )
      `);
    
    if (error) {
      alert("Error al editar movimiento: " + error.message);
      return false;
    }
    
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Movimiento actualizado",
      showConfirmButton: false,
      timer: 1500,
    });
    
    return data[0];
  } catch (error) {
    alert("Error al editar movimiento: " + error.message);
    return false;
  }
}

/**
 * FUNCIÓN: ObtenerResumenMovimientos
 * 
 * Calcula el resumen financiero del usuario basado en todos sus movimientos.
 * 
 * @param {number} idusuario - ID del usuario para calcular el resumen
 * @returns {Object} Resumen financiero con ingresos, gastos y balance
 */
export async function ObtenerResumenMovimientos(idusuario) {
  try {
    const { data, error } = await supabase
      .from("movimientos")
      .select("tipo, monto")
      .eq("idusuario", idusuario);
    
    if (error) {
      console.error("Error al obtener resumen:", error);
      return { ingresos: 0, gastos: 0, balance: 0 };
    }
    
    const ingresos = data
      .filter(movimiento => movimiento.tipo === 'i')
      .reduce((suma, movimiento) => suma + parseFloat(movimiento.monto), 0);
    
    const gastos = data
      .filter(movimiento => movimiento.tipo === 'g')
      .reduce((suma, movimiento) => suma + parseFloat(movimiento.monto), 0);
    
    return {
      ingresos: parseFloat(ingresos.toFixed(2)),
      gastos: parseFloat(gastos.toFixed(2)),
      balance: parseFloat((ingresos - gastos).toFixed(2))
    };
  } catch (error) {
    console.error("Error en ObtenerResumenMovimientos:", error);
    return { ingresos: 0, gastos: 0, balance: 0 };
  }
}

/**
 * FUNCIÓN: ObtenerMovimientosInformes
 *
 * Recupera todos los movimientos del usuario sin filtrar por tipo. Se utiliza
 * para construir reportes y métricas agregadas en el módulo de informes.
 *
 * @param {number} idusuario - ID del usuario propietario de los movimientos
 * @returns {Array} Lista de movimientos con la información de su categoría
 */
export async function ObtenerMovimientosInformes(idusuario) {
  try {
    const { data, error } = await supabase
      .from("movimientos")
      .select(`
        id,
        descripcion,
        monto,
        fecha,
        tipo,
        categorias (
          descripcion,
          color,
          icono,
          tipo
        )
      `)
      .eq("idusuario", idusuario)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener movimientos para informes:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error en ObtenerMovimientosInformes:", error);
    return [];
  }
}