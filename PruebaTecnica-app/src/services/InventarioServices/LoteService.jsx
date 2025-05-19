import AuthService from "../AuthService";

const LoteService = {

    fetchCreateLote: async (formData) => {
        const endpoint = "api/Lote/crear";
        const method = "POST";
        const data = {
            loteID: formData.id,
            productoID: formData.productoID,
            producto: formData.producto,
            codigoLote: formData.codigoLote,
            cantidad: formData.cantidad,
            numeroLote: formData.codigoLote,
            fechaFabricacion: formData.fechaFabricacion,
            fechaVencimiento: formData.fechaVencimiento,
            cantidadInicial: formData.cantidadInicial,
            usuario: formData.usuario,
            estado: formData.estado,
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
    fetchUpdateLote: async (formData) => {
        const endpoint = "api/Lote/actualizar";
        const method = "PUT";
        const data = {
            loteID: formData.loteID,
            productoID: formData.productoID,
            producto: formData.producto,
            codigoLote: formData.codigoLote,
            cantidad: formData.cantidad,
            numeroLote: formData.numeroLote,
            fechaFabricacion: formData.fechaFabricacion,
            fechaVencimiento: formData.fechaVencimiento,
            cantidadInicial: formData.cantidadInicial,
            usuario: formData.usuario,
            estado: formData.estado,
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
        const method = "GET";
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
        const method = "DELETE";
        try {
            const response = await AuthService.fetchWithAuth(endpoint, method);
            return response;
        } catch (error) {
            console.error("Error fetching Vida Producto:", error);
            throw error;
        }
    }
}

export default LoteService;