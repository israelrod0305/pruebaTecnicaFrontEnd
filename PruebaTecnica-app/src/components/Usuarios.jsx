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
    IconButton, InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UserService from "../services/UserService/UserService";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';


const Usuarios = () => {
    const [rows, setRows] = useState([
        { id: 1, username: '', nombre: '', apellido: '' },
    ]);

    
    const [title, setTitle] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        username: '',
        nombre: '',
        apellido: '',
        password: '',
        confirmPassword: '',
        changePassword :false
    });

    const [values, setValues] = useState({
        showPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const [valuesConfirm, setValuesConfirm] = useState({
        showPassword: false,
    });

    const handleClickShowPasswordConfirm = () => {
        setValuesConfirm({ ...values, showPassword: !valuesConfirm.showPassword });
    };

    const handleChange = (e) => {

        if (e.target.name === 'password') {
            if (e.target.value.length < 6) {
                // setErrorPassword("La contraseña debe tener al menos 6 caracteres")
            } else {
                // setErrorPassword('');
            }
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const cargarData = async () => {
        try {
            const response = await UserService.fetchAllUser();
            const usuarios = response.result.data;

            const formateado = usuarios.map(user => ({
                id: user.id,
                username: user.username,
                nombre: user.nombre,
                apellido: user.apellido,
                password: '*******************',
            }));

            setRows(formateado);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    useEffect(() => {
        cargarData();
    }, []);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleEdit = (row) => {

        setFormData({
            ...row,
            password: '',
            confirmPassword: ''
        });
        setTitle('Editar Usuario');
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Desea eliminar el usuario?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            try {
                const response = await UserService.fetchDeleteUser(id);
                console.log(response);
                await cargarData();

                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El usuario ha sido eliminado.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el usuario.',
                    icon: 'error'
                });
            }
        };
    }


    const handleSave = async () => {

        if (title === 'Editar Usuario') {
            // Edit
            const response = await UserService.fetchUpdateUser(formData);
            console.log(response);
        } else {
            // Nuevo
            const response = await UserService.fetchCreateUser(formData);
            console.log(response);
        }
        await cargarData();
        setOpenDialog(false);
        setFormData({ id: null, nombre: '', correo: '' });

    };

    const setOpenDialogNew = () => {
        setOpenDialog(true)
        setTitle('Nuevo Usuario');
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'nombre', headerName: 'Nombre', width: 150 },
        { field: 'apellido', headerName: 'Apellido', width: 150 },
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
            <Typography variant="h5" gutterBottom>Gestión de Usuarios</Typography>
            <Button variant="contained" onClick={() => setOpenDialogNew(true)} sx={{ mb: 2 }}>Nuevo Usuario</Button>
            <Box sx={{ maxWidth: 900, width: '100%', mx: 'auto' }}>
                <DataGrid rows={rows} columns={columns} autoHeight />

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                        <TextField
                            label="Nombre"
                            fullWidth
                            margin="normal"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                        <TextField
                            label="Apellido"
                            fullWidth
                            margin="normal"
                            value={formData.apellido}
                            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.changePassword}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    changePassword: e.target.checked
                                })}
                            />
                            Cambiar contraseña
                        </label>
                        {formData.changePassword && (
                            <>
                                <TextField
                                    id="password"
                                    label="password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder='Contraseña'
                                    value={formData.password}
                                    margin="normal"
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    id="confirmPassword"
                                    label="Confirmar Password"
                                    type={valuesConfirm.showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    margin="normal"
                                    placeholder='Contraseña'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPasswordConfirm}
                                                    onMouseDown={handleClickShowPasswordConfirm}
                                                >
                                                    {valuesConfirm.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </>
                        )}
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

export default Usuarios;
