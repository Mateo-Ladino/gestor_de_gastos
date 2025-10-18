// Script de verificación para el módulo de categorías
// Ejecutar en la consola del navegador después de cargar la app

console.log('🔍 VERIFICACIÓN DEL MÓDULO DE CATEGORÍAS');
console.log('==========================================');

// Importar dependencias necesarias
import { supabase } from './src/supabase/supabase.config.jsx';

// Función para verificar conexión
async function verificarConexion() {
  console.log('\n🔗 Verificando conexión con Supabase...');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
    console.log('✅ Conexión exitosa con Supabase');
    console.log('📊 Sesión:', session ? 'Usuario logueado' : 'Sin sesión');
    return true;
  } catch (err) {
    console.error('❌ Error inesperado:', err);
    return false;
  }
}

// Función para verificar tablas
async function verificarTablas() {
  console.log('\n📊 Verificando tablas...');
  try {
    // Verificar tabla usuarios
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (errorUsuarios) {
      console.error('❌ Error en tabla usuarios:', errorUsuarios);
    } else {
      console.log('✅ Tabla usuarios: OK');
    }

    // Verificar tabla categorias
    const { data: categorias, error: errorCategorias } = await supabase
      .from('categorias')
      .select('count')
      .limit(1);
    
    if (errorCategorias) {
      console.error('❌ Error en tabla categorias:', errorCategorias);
    } else {
      console.log('✅ Tabla categorias: OK');
    }

    return !errorUsuarios && !errorCategorias;
  } catch (err) {
    console.error('❌ Error verificando tablas:', err);
    return false;
  }
}

// Función para probar operaciones CRUD
async function probarCRUD() {
  console.log('\n🧪 Probando operaciones CRUD...');
  
  try {
    // Obtener sesión actual
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('⚠️ No hay sesión activa. Inicia sesión primero.');
      return false;
    }

    // Obtener usuario actual
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id')
      .eq('idauth_supabase', session.user.id)
      .single();

    if (!usuario) {
      console.log('⚠️ Usuario no encontrado en la base de datos.');
      return false;
    }

    console.log('👤 Usuario ID:', usuario.id);

    // Probar INSERT
    const nuevaCategoria = {
      descripcion: 'Categoría de Prueba',
      color: '#FF5722',
      icono: '🧪',
      tipo: 'i',
      idusuario: usuario.id
    };

    const { data: insertData, error: insertError } = await supabase
      .from('categorias')
      .insert(nuevaCategoria)
      .select();

    if (insertError) {
      console.error('❌ Error INSERT:', insertError);
      return false;
    }
    console.log('✅ INSERT: OK');

    const categoriaId = insertData[0].id;

    // Probar SELECT
    const { data: selectData, error: selectError } = await supabase
      .from('categorias')
      .select('*')
      .eq('idusuario', usuario.id)
      .eq('tipo', 'i');

    if (selectError) {
      console.error('❌ Error SELECT:', selectError);
      return false;
    }
    console.log('✅ SELECT: OK');

    // Probar UPDATE
    const { error: updateError } = await supabase
      .from('categorias')
      .update({ descripcion: 'Categoría Actualizada' })
      .eq('id', categoriaId);

    if (updateError) {
      console.error('❌ Error UPDATE:', updateError);
      return false;
    }
    console.log('✅ UPDATE: OK');

    // Probar DELETE
    const { error: deleteError } = await supabase
      .from('categorias')
      .delete()
      .eq('id', categoriaId);

    if (deleteError) {
      console.error('❌ Error DELETE:', deleteError);
      return false;
    }
    console.log('✅ DELETE: OK');

    return true;
  } catch (err) {
    console.error('❌ Error en pruebas CRUD:', err);
    return false;
  }
}

// Función principal de verificación
async function verificarModuloCategorias() {
  console.log('🚀 Iniciando verificación completa...');
  
  const conexionOK = await verificarConexion();
  if (!conexionOK) {
    console.log('❌ Verificación fallida: Error de conexión');
    return;
  }

  const tablasOK = await verificarTablas();
  if (!tablasOK) {
    console.log('❌ Verificación fallida: Error en tablas');
    return;
  }

  const crudOK = await probarCRUD();
  if (!crudOK) {
    console.log('❌ Verificación fallida: Error en operaciones CRUD');
    return;
  }

  console.log('\n🎉 ¡VERIFICACIÓN COMPLETA EXITOSA!');
  console.log('✅ El módulo de categorías está funcionando correctamente');
  console.log('==========================================');
}

// Ejecutar verificación
verificarModuloCategorias();

// Exportar función para uso manual
window.verificarModuloCategorias = verificarModuloCategorias;
