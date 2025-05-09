// Create a new component: AdminBreadcrumbs.jsx
import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

export const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Map of path segments to readable names
  const pathMap = {
    admin: 'Admin',
    dashboard: 'Dashboard',
    'add-product': 'Add Product',
    'product-update': 'Update Product',
    orders: 'Orders'
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Skip ID segments in breadcrumbs
          if (value.length > 20) {
            return null;
          }

          return last ? (
            <Typography color="text.primary" key={to}>
              {pathMap[value] || value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={to}
              underline="hover"
              key={to}
              color="inherit"
            >
              {pathMap[value] || value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};