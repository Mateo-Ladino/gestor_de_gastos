import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { MovimientosTemplate } from "../components/templates/MovimientosTemplate";
import { useMovimientosStore } from "../store/MovimientosStore";
import { useOperaciones } from "../store/OperacionesStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";

export function Movimientos() {
  const { tipo } = useOperaciones();
  const { datamovimientos, mostrarMovimientos } = useMovimientosStore();
  const { datausuarios } = useUsuariosStore();
  
  const { isLoading, error } = useQuery(
    ["mostrar movimientos", tipo, datausuarios?.id], 
    () => mostrarMovimientos({ idusuario: datausuarios.id, tipo: tipo }),
    {
      enabled: !!datausuarios?.id,
      retry: 1,
    }
  );

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (error) {
    return (
      <Container>
        <h1>Error al cargar movimientos: {error.message}</h1>
      </Container>
    );
  }

  return (
    <Container>
      <MovimientosTemplate data={datamovimientos} />
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
`;
