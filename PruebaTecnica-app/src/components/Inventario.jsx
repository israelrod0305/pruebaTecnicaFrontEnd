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
import LoteService from "../services/InventarioServices/LoteService";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const Inventario = () => {
  const [rows, setRows] = useState([]);

  const [productos, setproductos] = useState([]);


  const [title, setTitle] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    loteID: 0,
    productoID: 0,
    producto: "",
    codigoLote: "",
    cantidad: 0,
    numeroLote: "",
    fechaFabricacion: "",
    fechaVencimiento: "",
    cantidadInicial: 0,
    usuario: "",
    estado: "",
  });



  const cargarData = async () => {
    try {
      const responseProducto = await ProductoService.fetchConsultarProducto();
      const prod = responseProducto.result.data;
      const productosformateada = prod.map(unidades => ({
        id: unidades.productoID,
        nombre: unidades.nombreProducto,
        descripcion: unidades.descripcion,
      }));
      setproductos(productosformateada);

      const response = await LoteService.fetchConsultarLote();
      const lotes = response.result.data;

      const formateado = lotes.map(lote => ({
        loteID: lote.loteID,
        productoID: lote.productoID,
        producto: lote.producto,
        codigoLote: lote.codigoLote,
        cantidad: lote.cantidad,
        numeroLote: lote.codigoLote,
        fechaFabricacion: lote.fechaFabricacion,
        fechaVencimiento: lote.fechaVencimiento,
        cantidadInicial: lote.cantidadInicial,
        usuario: lote.usuario,
        estado: lote.estado,
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
    setTitle('Editar Lote');
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
        const response = await LoteService.fetchEliminarLote(id, user.username);
        console.log(response);
        await cargarData();

        Swal.fire({
          title: '¡Eliminado!',
          text: 'El lote ha sido eliminado.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error al eliminar lote:", error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el lote.',
          icon: 'error'
        });
      }
    };
  }


  const handleSave = async () => {

    if (title === 'Editar Lote') {
      // Edit
      const response = await LoteService.fetchUpdateLote(formData);
      console.log(response);
    } else {
      // Nuevo
      const response = await LoteService.fetchCreateLote(formData);
      console.log(response);
    }
    await cargarData();
    setOpenDialog(false);
    setFormData({ id: null, nombre: '', correo: '' });

  };

  const setOpenDialogNew = () => {
    setOpenDialog(true)
    setTitle('Nuevo Lote');
  }


  const columns = [
    { field: 'loteID', headerName: 'ID', width: 70 },
    {
      field: 'productoID', headerName: 'Producto', width: 150, renderEditCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => {
            params.api.setEditCellValue({ id: params.id, field: 'productoID', value: e.target.value });
          }}
          fullWidth
        >
          {productos.map((unidad) => (
            <MenuItem key={unidad.id} value={unidad.id}>
              {unidad.nombre}
            </MenuItem>
          ))}
        </Select>
      ),
      valueFormatter: (params) => {
        
        const unidad = productos.find((u) => u.id == params);
        return unidad ? unidad.nombre : '';
      }
    },

    { field: 'codigoLote', headerName: 'Código Lote', width: 150 },
    { field: 'cantidadInicial', headerName: 'Cantidad Inicial' , width: 150 },
    { field: 'cantidad', headerName: 'Cantidad Disponible', width: 150 },
    { field: 'fechaFabricacion', headerName: 'F. Fabricación', width: 180 },
    { field: 'fechaVencimiento', headerName: 'F. Vencimiento', width: 180 },
    { field: 'estado', headerName: 'Estado', width: 100 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.loteID)}><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Lotes</Typography>
      <Button variant="contained" onClick={() => setOpenDialogNew(true)} sx={{ mb: 2 }}>Nuevo Lote</Button>
      <Box sx={{ width: '93%', mx: 'auto' }}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.loteID} autoHeight />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent sx={{ maxWidth: '100%' }}>
             <input
              type="hidden"
              value={formData.loteID}
              onChange={(e) => setFormData({ ...formData, loteID: e.target.value })}
            />

            <Select
              fullWidth
              value={formData.productoID}
              onChange={(e) => setFormData({ ...formData, productoID: e.target.value })}

              sx={{ mt: 2 }}
            >
              {productos.map(unidad => (
                <MenuItem key={unidad.id} value={unidad.id}>
                  {unidad.nombre}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Código de Lote"
              fullWidth
              margin="normal"
              value={formData.codigoLote}
              onChange={(e) => setFormData({ ...formData, codigoLote: e.target.value })}
            />

            <TextField
              label="Cantidad Inicial"
              type="number"
              fullWidth
              margin="normal"
              value={formData.cantidadInicial}
              onChange={(e) => setFormData({ ...formData, cantidadInicial: parseFloat(e.target.value) })}
            />

               <TextField
              label="Cantidad Disponible"
              type="number"
              fullWidth
              margin="normal"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: parseFloat(e.target.value) })}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Fabricación"
                format="YYYY-MM-DD"
               
                value={formData.fechaFabricacion ? dayjs(formData.fechaFabricacion) : null}
                onChange={(newValue) => {
                  setFormData({ ...formData, fechaFabricacion: newValue ? newValue.format('YYYY-MM-DD') : '' });
                }}
                // maxDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    // error: formData.fechaFabricacion && dayjs(formData.fechaFabricacion).isAfter(dayjs()),
                    // helperText:
                    //   formData.fechaFabricacion && dayjs(formData.fechaFabricacion).isAfter(dayjs())
                    //     ? 'La fecha de fabricación no puede ser mayor a hoy'
                    //     : '',
                  },
                }}
              />

              <DatePicker
                label="Fecha de Vencimiento"
                format="YYYY-MM-DD"
                margin="normal"
                value={formData.fechaVencimiento ? dayjs(formData.fechaVencimiento) : null}
                onChange={(newValue) => {
                  setFormData({ ...formData, fechaVencimiento: newValue ? newValue.format('YYYY-MM-DD') : '' });
                }}
                // minDate={dayjs()} // No se puede seleccionar una fecha pasada
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    // error: formData.fechaVencimiento && dayjs(formData.fechaVencimiento).isBefore(dayjs(), 'day'),
                    // helperText:
                    //   formData.fechaVencimiento && dayjs(formData.fechaVencimiento).isBefore(dayjs(), 'day')
                    //     ? 'La fecha de vencimiento no puede ser menor a hoy'
                    //     : '',
                  },
                }}
              />
            </LocalizationProvider>


         

            {/* Ocultos */}
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

export default Inventario;
