// Script para verificar la configuración de Supabase
// Ejecutar en la consola del navegador para verificar

console.log('🔍 Verificando configuración de Supabase...');

// Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('VITE_APP_SUPABASE_URL:', import.meta.env.VITE_APP_SUPABASE_URL);
console.log('VITE_APP_SUPABASE_ANON_KEY:', import.meta.env.VITE_APP_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada');

// Verificar conexión con Supabase
import { supabase } from './src/supabase/supabase.config.jsx';

supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('❌ Error de conexión:', error);
  } else {
    console.log('✅ Conexión exitosa con Supabase');
    console.log('📊 Sesión actual:', session ? 'Usuario logueado' : 'Sin sesión');
  }
});

// Verificar configuración de Google OAuth
console.log('🔑 Para verificar Google OAuth:');
console.log('1. Ve a Supabase Dashboard → Authentication → Providers');
console.log('2. Verifica que Google esté habilitado');
console.log('3. Confirma que las credenciales estén configuradas');
