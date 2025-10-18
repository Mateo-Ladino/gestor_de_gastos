// Script de verificación para Google OAuth
// Ejecutar en la consola del navegador después de cargar la app

console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN GOOGLE OAUTH');
console.log('==============================================');

// 1. Verificar variables de entorno
console.log('\n📋 Variables de entorno:');
console.log('VITE_APP_SUPABASE_URL:', import.meta.env.VITE_APP_SUPABASE_URL);
console.log('VITE_APP_SUPABASE_ANON_KEY:', import.meta.env.VITE_APP_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada');

// 2. Verificar conexión con Supabase
console.log('\n🔗 Verificando conexión con Supabase...');
import { supabase } from './src/supabase/supabase.config.jsx';

supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('❌ Error de conexión:', error);
  } else {
    console.log('✅ Conexión exitosa con Supabase');
    console.log('📊 Sesión actual:', session ? 'Usuario logueado' : 'Sin sesión');
  }
});

// 3. Verificar configuración de Google OAuth
console.log('\n🔑 Configuración de Google OAuth:');
console.log('Client ID: 772342976403-b8m8at5ro0it09afbscrbjv66pqa3jqf.apps.googleusercontent.com');
console.log('Project ID: project-18755f04-e82c-4cac-a0d');
console.log('\n📝 Pasos para verificar en Supabase:');
console.log('1. Ve a Supabase Dashboard → Authentication → Providers');
console.log('2. Verifica que Google esté habilitado');
console.log('3. Confirma que las credenciales estén configuradas correctamente');
console.log('4. Verifica la URL de redirección');

// 4. Función para probar login
window.testGoogleLogin = async () => {
  console.log('\n🧪 Probando login con Google...');
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) {
      console.error('❌ Error en login:', error);
    } else {
      console.log('✅ Login iniciado correctamente:', data);
    }
  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
};

console.log('\n🧪 Para probar el login, ejecuta: testGoogleLogin()');
console.log('==============================================');
