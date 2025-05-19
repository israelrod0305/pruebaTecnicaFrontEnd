import AuthService from "../AuthService";

const UserService = {

  fetchCreateUser: async (formData) => {
    const endpoint = "api/User/CreateUser";
    const method = "POST";
    const data = {
        id: 0,
        username: formData.username,
        nombre: formData.nombre,
        apellido: formData.apellido,
        password: formData.password,
        confirmPassword: formData.confirmPassword
    };

    try {
      const response = await AuthService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },
  fetchUpdateUser: async (formData) => {
    const endpoint = "api/User/Update";
    const method = "PUT";
    const data = {
        id: formData.id,
        username: formData.username,
        nombre: formData.nombre,
        apellido: formData.apellido,
        password: formData.password,
        confirmPassword: formData.confirmPassword
    };

    try {
      const response = await AuthService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },
  fetchDeleteUser: async (id) => {
    const endpoint = `api/User/Delete/${encodeURIComponent(id)}`;
    const method = "DELETE";
    try {
      const response = await AuthService.fetchWithAuth(endpoint, method);
      return response;
    } catch (error) {
      console.error("Error fetching Vida Producto:", error);
      throw error;
    }
  },
  fetchAllUser: async () => {
    const endpoint = "api/User/All";
    const method = "GET";
    const data = {
    };

    try {
      const response = await AuthService.fetchWithAuth(endpoint, method, data);
      return response;
    } catch (error) {
      console.error("Error fetching Users All:", error);
      throw error;
    }
  },
  fetchUserById: async (id) => {
   const endpoint = `api/User/ById?id=${encodeURIComponent(id)}`;
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

export default UserService;