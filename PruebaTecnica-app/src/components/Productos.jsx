import React, {
  useState,
  useEffect,
} from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ProductoService from "../services/ProductoServices/ProductoService";
import Swal from 'sweetalert2';
import { USER_STORAGE_KEY } from "../utils/constantes";
import { Select, MenuItem } from '@mui/material';
import UnidadMedidaService from "../services/ProductoServices/UnidadMedidaService";
const Productos = () => {
  const [rows, setRows] = useState([]);

  const [unidades, setUnidades] = useState([]);


  const [title, setTitle] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    productoID: null,
    codigoProducto: '',
    nombreProducto: '',
    unidadMedidaID: '',
    precioCompra: '',
    precioVenta: '',
    stockMinimo: 0,
    stockMaximo: 0,
    usuario: '',
    estado: 0
  });



  const cargarData = async () => {
    try {
      const responseUnidadMedida = await UnidadMedidaService.fetchConsultarUnidadMedida();
      const unidadesMedidas = responseUnidadMedida.result.data;
      const unidadesformateada = unidadesMedidas.map(unidades => ({
        id: unidades.id,
        codigo: unidades.codigo,
        nombre: unidades.nombre,
        descripcion: unidades.descripcion,
       
      }));
      setUnidades(unidadesformateada);

      const response = await ProductoService.fetchConsultarProducto();
      const productos = response.result.data;
     
      const formateado = productos.map(producto => ({
        productoID: producto.productoID,
        codigoProducto: producto.codigoProducto,
        nombreProducto: producto.nombreProducto,
        unidadMedidaID: producto.unidadMedidaID.toString(),
        precioCompra: producto.precioCompra,
        precioVenta: producto.precioVenta,
        stockMinimo: producto.stockMinimo,
        stockMaximo: producto.stockMaximo,
        usuario: producto.usuario,
        estado: producto.estado,
      }));
      setRows(formateado);
    } catch (error) {
      console.error("Error al cargar producto:", error);
    }
  };

  useEffect(() => {
    cargarData();
  }, []);


  const handleEdit = (row) => {
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    setFormData({
      ...row,
      usuario: user?.Id || '',
      estado: row.estado ?? 1,
    });
    setTitle('Editar Producto');
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Desea eliminar el producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        
        const response = await ProductoService.fetchEliminarProducto(id, user.username);
        console.log(response);
        await cargarData();

        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el producto.',
          icon: 'error'
        });
      }
    };
  }


  const handleSave = async () => {

    if (title === 'Editar Producto') {
      // Edit
      const response = await ProductoService.fetchUpdateProducto(formData);
      console.log(response);
    } else {
      // Nuevo
      const response = await ProductoService.fetchCreateProducto(formData);
      console.log(response);
    }
    await cargarData();
    setOpenDialog(false);
    setFormData({ id: null, nombre: '', correo: '' });

  };

  const setOpenDialogNew = () => {
    setOpenDialog(true)
    setTitle('Nuevo Producto');
  }

  const columns = [
    { field: 'productoID', headerName: 'ID', width: 80 },
    { field: 'codigoProducto', headerName: 'Codigo Producto', width: 150 },
    { field: 'nombreProducto', headerName: 'Nombre Producto', width: 150 },
    {
      field: 'unidadMedidaID', headerName: 'unidadMedidaID', width: 150, renderEditCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => {
            
            params.api.setEditCellValue({ id: params.id, field: 'unidadMedidaID', value: e.target.value });
          }}
          fullWidth
        >
          {unidades.map((unidad) => (
            <MenuItem key={unidad.id} value={unidad.id}>
              {unidad.nombre}
            </MenuItem>
          ))}
        </Select>
      ),
      valueFormatter: (params) => {
        const unidad = unidades.find((u) => u.id == params);
        return unidad ? unidad.nombre : '';
      }
    },

    { field: 'precioCompra', headerName: 'precioCompra', width: 150 },
    { field: 'precioVenta', headerName: 'precioVenta', width: 150 },
    { field: 'stockMinimo', headerName: 'stockMinimo', width: 150 },
    { field: 'stockMaximo', headerName: 'stockMaximo', width: 150 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.productoID)}><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Productos</Typography>
      <Button variant="contained" onClick={() => setOpenDialogNew(true)} sx={{ mb: 2 }}>Nuevo Producto</Button>
      <Box sx={{ width: '93%', mx: 'auto' }}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.productoID} autoHeight />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent sx={{ maxWidth: '100%' }}>
            <TextField
              label="Código del Producto"
              fullWidth
              margin="normal"
              value={formData.codigoProducto}
              onChange={(e) => setFormData({ ...formData, codigoProducto: e.target.value })}
            />

            <TextField
              label="Nombre del Producto"
              fullWidth
              margin="normal"
              value={formData.nombreProducto}
              onChange={(e) => setFormData({ ...formData, nombreProducto: e.target.value })}
            />

            <Select
              fullWidth
              value={formData.unidadMedidaID}
              onChange={(e) => setFormData({ ...formData, unidadMedidaID: e.target.value })}
              
              sx={{ mt: 2 }}
            >
              {unidades.map(unidad => (
                <MenuItem key={unidad.id} value={unidad.id}>
                  {unidad.nombre}
                </MenuItem>
              ))}
            </Select>


            <TextField
              label="Precio de Compra"
              type="number"
              fullWidth
              margin="normal"
              value={formData.precioCompra}
              onChange={(e) => setFormData({ ...formData, precioCompra: e.target.value })}
            />

            <TextField
              label="Precio de Venta"
              type="number"
              fullWidth
              margin="normal"
              value={formData.precioVenta}
              onChange={(e) => setFormData({ ...formData, precioVenta: e.target.value })}
            />

            <TextField
              label="Stock Mínimo"
              type="number"
              fullWidth
              margin="normal"
              value={formData.stockMinimo}
              onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
            />

            <TextField
              label="Stock Máximo"
              type="number"
              fullWidth
              margin="normal"
              value={formData.stockMaximo}
              onChange={(e) => setFormData({ ...formData, stockMaximo: e.target.value })}
            />

            <input
              type="hidden"
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
            />

            <input
              type="hidden"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Productos;
