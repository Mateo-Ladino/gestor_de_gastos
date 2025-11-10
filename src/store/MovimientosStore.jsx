/**
 * STORE: MovimientosStore
 * 
 * Este es el store de Zustand que maneja todo el estado relacionado con los movimientos
 * financieros (ingresos y gastos) del usuario.
 * 
 * FUNCIONALIDADES:
 * - Almacenar la lista de movimientos del usuario
 * - Calcular resúmenes financieros (ingresos, gastos, balance)
 * - Proporcionar funciones para operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * - Sincronizar datos con la base de datos de Supabase
 * 
 * TECNOLOGÍAS:
 * - Zustand: Para el manejo de estado global
 * - Supabase: Para las operaciones de base de datos
 */

import { create } from "zustand";
import {
  EditarMovimiento,
  EliminarMovimiento,
  InsertarMovimiento,
  MostrarMovimientos,
  ObtenerResumenMovimientos,
  ObtenerMovimientosInformes,
} from "../supabase/crudMovimientos";

/**
 * HOOK: useMovimientosStore
 * 
 * Este hook proporciona acceso al estado y funciones de movimientos.
 * Se puede usar en cualquier componente de React para:
 * - Obtener la lista de movimientos
 * - Calcular resúmenes financieros
 * - Realizar operaciones CRUD
 */
export const useMovimientosStore = create((set, get) => ({
  
  // ===== ESTADO =====
  
  /**
   * ARRAY: datamovimientos
   * 
   * Contiene la lista completa de movimientos del usuario actual.
   * Cada movimiento tiene la siguiente estructura:
   * {
   *   id: number,           // ID único del movimiento
   *   descripcion: string,   // Descripción del movimiento
   *   monto: number,        // Cantidad de dinero
   *   fecha: string,        // Fecha del movimiento (YYYY-MM-DD)
   *   tipo: string,         // "Ingresos" o "Gastos"
   *   idcategoria: number,   // ID de la categoría
   *   idusuario: number,    // ID del usuario propietario
   *   categoria: {          // Datos de la categoría (join)
   *     descripcion: string,
   *     icono: string
   *   }
   * }
   */
  datamovimientos: [],
  movimientosInformes: [],
  
  /**
   * OBJETO: resumen
   * 
   * Contiene los cálculos financieros del usuario:
   * - ingresos: Suma total de todos los ingresos
   * - gastos: Suma total de todos los gastos
   * - balance: Diferencia entre ingresos y gastos (ingresos - gastos)
   */
  resumen: { 
    ingresos: 0, 
    gastos: 0, 
    balance: 0 
  },

  // ===== FUNCIONES =====
  
  /**
   * FUNCIÓN: mostrarMovimientos
   * 
   * Obtiene todos los movimientos del usuario desde la base de datos
   * y los guarda en el estado local.
   * 
   * @param {Object} parametros - Parámetros para la consulta
   * @param {number} parametros.idusuario - ID del usuario
   * @param {string} parametros.tipo - Tipo de movimiento ("Ingresos" o "Gastos")
   * @returns {Array} Lista de movimientos
   */
  mostrarMovimientos: async (parametros) => {
    try {
      // Llamar a la función CRUD que consulta la base de datos
      const response = await MostrarMovimientos(parametros);
      
      // Actualizar el estado con los movimientos obtenidos
      set({ datamovimientos: response });
      
      // Devolver los movimientos para uso inmediato
      return response;
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
      return [];
    }
  },

  /**
   * FUNCIÓN: insertarMovimiento
   * 
   * Crea un nuevo movimiento en la base de datos y actualiza el estado local.
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
  insertarMovimiento: async (datosMovimiento) => {
    try {
      // Llamar a la función CRUD que inserta en la base de datos
      const result = await InsertarMovimiento(datosMovimiento);
      
      if (result) {
        // Obtener el estado actual
        const { datamovimientos } = get();
        
        // Agregar el nuevo movimiento al estado local
        set({ 
          datamovimientos: [...datamovimientos, result] 
        });
        
        // Actualizar el resumen financiero
        get().actualizarResumen();
      }
      
      return result;
    } catch (error) {
      console.error("Error al insertar movimiento:", error);
      return null;
    }
  },

  /**
   * FUNCIÓN: editarMovimiento
   * 
   * Actualiza un movimiento existente en la base de datos y actualiza el estado local.
   * 
   * @param {Object} datosMovimiento - Datos del movimiento a actualizar
   * @param {number} datosMovimiento.id - ID del movimiento a editar
   * @param {string} datosMovimiento.descripcion - Nueva descripción
   * @param {number} datosMovimiento.monto - Nuevo monto
   * @param {string} datosMovimiento.fecha - Nueva fecha
   * @param {number} datosMovimiento.idcategoria - Nueva categoría
   * @param {number} datosMovimiento.idusuario - ID del usuario
   * @param {string} datosMovimiento.tipo - Tipo: "Ingresos" o "Gastos"
   * @returns {Object|null} Datos del movimiento actualizado o null si hay error
   */
  editarMovimiento: async (datosMovimiento) => {
    try {
      // Llamar a la función CRUD que actualiza en la base de datos
      const result = await EditarMovimiento(datosMovimiento);
      
      if (result) {
        // Obtener el estado actual
        const { datamovimientos } = get();
        
        // Actualizar el movimiento en el estado local
        const movimientosActualizados = datamovimientos.map(movimiento => 
          movimiento.id === datosMovimiento.id ? result : movimiento
        );
        
        set({ 
          datamovimientos: movimientosActualizados 
        });
        
        // Actualizar el resumen financiero
        get().actualizarResumen();
      }
      
      return result;
    } catch (error) {
      console.error("Error al editar movimiento:", error);
      return null;
    }
  },

  /**
   * FUNCIÓN: eliminarMovimiento
   * 
   * Elimina un movimiento de la base de datos y actualiza el estado local.
   * 
   * @param {Object} parametros - Parámetros para la eliminación
   * @param {number} parametros.id - ID del movimiento a eliminar
   * @param {number} parametros.idusuario - ID del usuario propietario
   * @param {string} parametros.tipo - Tipo de movimiento para recargar
   * @returns {boolean} true si se eliminó correctamente, false si hay error
   */
  eliminarMovimiento: async (parametros) => {
    try {
      // Llamar a la función CRUD que elimina de la base de datos
      const result = await EliminarMovimiento(parametros);
      
      if (result) {
        // Obtener el estado actual
        const { datamovimientos } = get();
        
        // Remover el movimiento del estado local
        const movimientosActualizados = datamovimientos.filter(
          movimiento => movimiento.id !== parametros.id
        );
        
        set({ 
          datamovimientos: movimientosActualizados 
        });
        
        // Actualizar el resumen financiero
        get().actualizarResumen();
      }
      
      return result;
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
      return false;
    }
  },

  /**
   * FUNCIÓN: actualizarResumen
   * 
   * Calcula y actualiza el resumen financiero basado en los movimientos actuales.
   * Esta función obtiene los datos directamente desde la base de datos para
   * asegurar cálculos precisos y actualizados.
   * 
   * @param {number} idusuario - ID del usuario para calcular el resumen
   * @returns {Object} Resumen financiero actualizado
   */
  actualizarResumen: () => {
    const { datamovimientos } = get();
    
    // Calcular ingresos totales
    const ingresos = datamovimientos
      .filter(movimiento => movimiento.tipo === "i")
      .reduce((total, movimiento) => total + parseFloat(movimiento.monto), 0);
    
    // Calcular gastos totales
    const gastos = datamovimientos
      .filter(movimiento => movimiento.tipo === "g")
      .reduce((total, movimiento) => total + parseFloat(movimiento.monto), 0);
    
    // Calcular balance (ingresos - gastos)
    const balance = ingresos - gastos;
    
    // Actualizar el estado con los nuevos cálculos
    set({ 
      resumen: { 
        ingresos: parseFloat(ingresos.toFixed(2)), 
        gastos: parseFloat(gastos.toFixed(2)), 
        balance: parseFloat(balance.toFixed(2)) 
      } 
    });
  },

  /**
   * FUNCIÓN: cargarResumen
   *
   * Obtiene el resumen financiero directamente desde Supabase. Se utiliza en
   * el módulo de informes para mostrar datos consolidados sin depender del
   * estado local.
   *
   * @param {number} idusuario - ID del usuario para calcular el resumen
   * @returns {Object} Resumen financiero actualizado
   */
  cargarResumen: async (idusuario) => {
    if (!idusuario) {
      return { ingresos: 0, gastos: 0, balance: 0 };
    }

    const resumen = await ObtenerResumenMovimientos(idusuario);
    set({ resumen });
    return resumen;
  },

  /**
   * FUNCIÓN: cargarMovimientosInformes
   *
   * Obtiene todos los movimientos del usuario para construir los reportes del
   * módulo de informes.
   *
   * @param {number} idusuario - ID del usuario
   * @returns {Array} Lista de movimientos
   */
  cargarMovimientosInformes: async (idusuario) => {
    if (!idusuario) {
      return [];
    }

    const movimientos = await ObtenerMovimientosInformes(idusuario);
    set({ movimientosInformes: movimientos });
    return movimientos;
  },
}));