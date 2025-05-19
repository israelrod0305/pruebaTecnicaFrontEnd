import AuthService from "../AuthService";

const InventarioService = {

  fetchCreateLote: async (id, productoID, producto, cantidad, numeroLote, fechaFabricacion, fechaVencimiento, cantidadInicial, usuario, estado) => {
    const endpoint = "api/Lote/crear";
    const method = "POST";
    const data = {
      loteID: id,
      productoID: productoID,
      producto: producto,
      codigoLote: "",
      cantidad: cantidad,
      numeroLote: numeroLote,
      fechaFabricacion: fechaFabricacion,
      fechaVencimiento: fechaVencimiento,
      cantidadInicial: cantidadInicial,
      usuario: usuario,
      estado: estado,
      accion: "INS"
    };
    try {
      const response = await AuthService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },
  fetchUpdateLote: async (id, productoID, producto, cantidad, numeroLote, fechaFabricacion, fechaVencimiento, cantidadInicial, usuario, estado) => {
    const endpoint = "api/Lote/actualizar";
    const method = "POST";
    const data = {
      loteID: id,
      productoID: productoID,
      producto: producto,
      codigoLote: "",
      cantidad: cantidad,
      numeroLote: numeroLote,
      fechaFabricacion: fechaFabricacion,
      fechaVencimiento: fechaVencimiento,
      cantidadInicial: cantidadInicial,
      usuario: usuario,
      estado: estado,
      accion: "UP"
    };

    try {
      const response = await AuthService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },
  fetchConsultarLote: async (productoId, id, codigoLote) => {
    const params = new URLSearchParams();

    if (productoId) params.append('productoId', productoId);
    if (id) params.append('id', id);
    if (codigoLote) params.append('codigoLote', codigoLote);

    const endpoint = `api/Lote/consultar${params.toString() ? '?' + params.toString() : ''}`;
    const method = "POST";
    try {
      const response = await AuthService.fetchWithAuth(endpoint, method);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },
  fetchEliminarLote: async (id, usuario) => {
    if (!id) throw new Error("El id es requerido");
    const params = new URLSearchParams();
    if (usuario) params.append('usuario', usuario);
    
    const endpoint = `api/Lote/eliminar/${id}` + (usuario ? `?${params.toString()}` : '');
    const method = "POST";
    try {
      const response = await AuthService.fetchWithAuth(endpoint, method);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  }
}

export default InventarioService;