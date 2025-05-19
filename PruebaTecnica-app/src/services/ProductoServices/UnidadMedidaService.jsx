import AuthService from "../AuthService";

const UnidadMedidaService = {

    fetchConsultarUnidadMedida: async (Id, codigo, nombre) => {
        const params = new URLSearchParams();

        if (Id) params.append('productoId', Id);
        if (codigo) params.append('id', codigo);
        if (nombre) params.append('codigoLote', nombre);

        const endpoint = `api//UnidadMedida/consultar${params.toString() ? '?' + params.toString() : ''}`;
        const method = "GET";
        try {
            const response = await AuthService.fetchWithAuth(endpoint, method);
            return response;
        } catch (error) {
            console.error("Error fetching Vida Producto:", error);
            throw error;
        }
    },
   
}

export default UnidadMedidaService;