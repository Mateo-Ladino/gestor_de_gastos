import Swal from "sweetalert2";
import { supabase, ObtenerIdAuthSupabase } from "../index";
export const InsertarUsuarios = async (p) => {
  try {
    const { data, error } = await supabase.from("usuarios").insert(p).select();
    
    if (error) {
      // Si es error de clave duplicada, no mostrar error
      if (error.code === '23505') {
        console.log('Usuario ya existe, continuando...');
        return null;
      }
      console.error('Error al insertar usuario:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error en InsertarUsuarios:', error);
    return null;
  }
};
export const MostrarUsuarios = async () => {
  try {
    const idAuthSupabase = await ObtenerIdAuthSupabase();
    const { error, data } = await supabase
      .from("usuarios")
      .select()
      .eq("idauth_supabase", idAuthSupabase)
      .maybeSingle();
    // if (error) {
    //   alert("MostrarUsuarios", error);
    // }
    if (data) {
      return data;
    }
  } catch (error) {
    // alert(error.error_description || error.message + "MostrarUsuarios");
  }
};
export async function EditarTemaMonedaUser(p) {
  try {
    const { error } = await supabase.from("usuarios").update(p).eq("id", p.id);
    if (error) {
      alert("Error al editar usuarios", error);
    }
    Swal.fire({
     
      icon: "success",
      title: "Datos modificados",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    alert(error.error_description || error.message + "EditarTemaMonedaUser");
  }
}
