# 💰 Gestor de Gastos

Sistema de control de gastos desarrollado con React + Vite y Supabase.

## 🚀 Configuración del proyecto

### Prerrequisitos
- Node.js (versión 16 o superior)
- Git
- Cuenta en Supabase

### 1. Clonar el repositorio
```bash
git clone https://github.com/Mateo-Ladino/gestor_de_gastos.git
cd gestor_de_gastos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de Supabase
VITE_APP_SUPABASE_URL=tu_supabase_url_aqui
VITE_APP_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

**Para obtener estas variables:**
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a Settings > API
4. Copia la URL del proyecto y la clave anónima (anon/public)

### 4. Ejecutar el proyecto
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 📁 Estructura del proyecto

- `src/components/` - Componentes React organizados por átomos, moléculas y organismos
- `src/pages/` - Páginas principales de la aplicación
- `src/store/` - Estados globales con Zustand
- `src/supabase/` - Configuración y operaciones CRUD con Supabase
- `src/context/` - Contextos de React
- `src/hooks/` - Hooks personalizados

## 🛠️ Tecnologías utilizadas

- React 18
- Vite
- Supabase
- Zustand (gestión de estado)
- CSS Modules
- React Router
