import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../auth/AuthSlice';

export const AdminNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
    { text: 'Add Product', icon: <AddCircleOutlineIcon />, path: '/admin/add-product' },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="primary">
          Admin Panel
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin
          </Typography>

          {!isMobile && (
            <>
              {menuItems.map((item) => (
                <Button 
                  key={item.text} 
                  color="inherit" 
                  component={Link} 
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </>
          )}
          
          <Avatar sx={{ ml: 2, bgcolor: theme.palette.secondary.main }}>A</Avatar>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};