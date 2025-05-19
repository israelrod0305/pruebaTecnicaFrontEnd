import AuthService from "../AuthService";

const ProductoService = {

    fetchCreateProducto: async (formData) => {
        const endpoint = "api/Producto/crear";
        const method = "POST";
        const data = {
            productoID: formData.productoID,                  
            codigoProducto: formData.codigoProducto,          
            nombreProducto: formData.nombreProducto,          
            descripcion: formData.descripcion,                
            unidadMedidaID: formData.unidadMedidaID,          
            precioCompra: formData.precioCompra,              
            precioVenta: formData.precioVenta,                
            stockMinimo: formData.stockMinimo,                
            stockMaximo: formData.stockMaximo,                
            usuario: formData.usuario,                        
            estado: formData.estado                           
        };
        try {
            const response = await AuthService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error("Error fetching Vida Producto:", error);
            throw error;
        }
    },
    fetchUpdateProducto: async (formData) => {
        const endpoint = "api/Producto/actualizar";
        const method = "PUT";
        const data = {
            productoID: formData.productoID,                  
            codigoProducto: formData.codigoProducto,          
            nombreProducto: formData.nombreProducto,          
            descripcion: formData.descripcion,                
            unidadMedidaID: formData.unidadMedidaID,          
            precioCompra: formData.precioCompra,              
            precioVenta: formData.precioVenta,                
            stockMinimo: formData.stockMinimo,                
            stockMaximo: formData.stockMaximo,                
            usuario: formData.usuario,                        
            estado: formData.estado                           
        };

        try {
            const response = await AuthService.fetchWithAuth(endpoint, method, data);
            return response;
        } catch (error) {
            console.error("Error fetching Vida Producto:", error);
            throw error;
        }
    },
    fetchConsultarProducto: async (Id, codigo, nombre) => {
        const params = new URLSearchParams();

        if (Id) params.append('productoId', Id);
        if (codigo) params.append('id', codigo);
        if (nombre) params.append('codigoLote', nombre);

        const endpoint = `api/Producto/consultar${params.toString() ? '?' + params.toString() : ''}`;
        const method = "GET";
        try {
            const response = await AuthService.fetchWithAuth(endpoint, method);
            return response;
        } catch (error) {
            console.error("Error fetching Vida Producto:", error);
            throw error;
        }
    },
    fetchEliminarProducto: async (id, usuario) => {
        
        if (!id) throw new Error("El id es requerido");
        const params = new URLSearchParams();
        if (usuario) params.append('usuario', usuario);

        const endpoint = `api/Producto/eliminar/${id}` + (usuario ? `?${params.toString()}` : '');
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

export default ProductoService;