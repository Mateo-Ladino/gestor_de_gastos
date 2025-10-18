import { createContext, useContext, useEffect, useState } from "react";
import { supabase,InsertarUsuarios } from "../index";
const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session == null) {
          setUser(null);
        } else {
          setUser(session?.user.user_metadata);
          insertarUsuarios(session?.user.user_metadata,session?.user.id);
          console.log("event", event);
          console.log("session", session?.user.user_metadata);
        }
      }
    );
    return () => {
      authListener.subscription;
    };
  }, []);
  const insertarUsuarios = async (dataProvider, idAuthSupabase) => {
    try {
      // Usar upsert para manejar usuarios existentes
      const p = {
        nombres: dataProvider.name,
        foto: dataProvider.picture,
        idauth_supabase: idAuthSupabase,
      };
      
      const { data, error } = await supabase
        .from('usuarios')
        .upsert(p, { 
          onConflict: 'idauth_supabase',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error('Error al manejar usuario:', error);
      } else {
        console.log('Usuario procesado correctamente:', data);
      }
    } catch (error) {
      console.error('Error en insertarUsuarios:', error);
    }
  };
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
export const UserAuth = () => {
  return useContext(AuthContext);
};
