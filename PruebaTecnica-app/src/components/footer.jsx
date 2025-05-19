import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import '../styles/footer.css';


const Footer = () => {
  return (
    <AppBar position="static" component="footer" className="appBar">
      <Toolbar sx={{ backgroundColor: '#00a99e', height: '75px', display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" color="inherit">
          © 2023 Seguros La Unión.
        </Typography>
        <Typography variant="body1" color="inherit" sx={{ textAlign: 'right' }}>
          Powered by AiSoftTech
        </Typography>
      </Toolbar>
    </AppBar>
  );
};



export default Footer;