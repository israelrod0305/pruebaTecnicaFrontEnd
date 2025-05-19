// src/routes/HomeRoutes.js
import React, { lazy } from 'react';
import { Route, Routes  } from 'react-router-dom';
import NotFound from '../pages/NotFound';


const HomePage = lazy(() => import('../modules/Home/HomePage'));

const HomeRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
     
    </Routes>
  );
};

export default HomeRoutes;