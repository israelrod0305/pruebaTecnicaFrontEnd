import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const UnidadMedida = () => {
  const [rows, setRows] = useState([
    { id: 1, nombre: 'Kilogramo', abreviatura: 'kg' },
    { id: 2, nombre: 'Litro', abreviatura: 'L' },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ id: null, nombre: '', abreviatura: '' });

  const handleEdit = (row) => {
    setFormData(row);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    if (formData.id) {
      setRows(rows.map((r) => (r.id === formData.id ? formData : r)));
    } else {
      setRows([...rows, { ...formData, id: Date.now() }]);
    }
    setOpenDialog(false);
    setFormData({ id: null, nombre: '', abreviatura: '' });
  };

  const columns = [
    { field: 'nombre', headerName: 'Nombre', width: 200 },
    { field: 'abreviatura', headerName: 'Abreviatura', width: 150 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Unidad de Medida</Typography>
      <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>Nueva Unidad</Button>
      <DataGrid rows={rows} columns={columns} autoHeight />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{formData.id ? 'Editar Unidad' : 'Nueva Unidad'}</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" fullWidth margin="normal" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
          <TextField label="Abreviatura" fullWidth margin="normal" value={formData.abreviatura} onChange={(e) => setFormData({ ...formData, abreviatura: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UnidadMedida;
