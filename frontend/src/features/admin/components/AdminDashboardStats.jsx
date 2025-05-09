// Create a new component: AdminDashboardStats.jsx
import React from 'react';
import { Grid, Paper, Typography, Box, Stack } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const AdminDashboardStats = ({ stats }) => {
  const { totalOrders, pendingOrders, totalRevenue } = stats;
  
  // Calculate average order value
  const avgOrderValue = totalOrders > 0 
    ? Math.round(totalRevenue / totalOrders) 
    : 0;

  return (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ bgcolor: 'primary.light', p: 1, borderRadius: 1 }}>
              <ShoppingCartIcon color="primary" />
            </Box>
            <Stack>
              <Typography variant="h5">{totalOrders}</Typography>
              <Typography variant="body2" color="text.secondary">Total Orders</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ bgcolor: 'success.light', p: 1, borderRadius: 1 }}>
              <TimelineIcon color="success" />
            </Box>
            <Stack>
              <Typography variant="h5">${avgOrderValue}</Typography>
              <Typography variant="body2" color="text.secondary">Avg. Order Value</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ bgcolor: 'warning.light', p: 1, borderRadius: 1 }}>
              <LocalShippingIcon color="warning" />
            </Box>
            <Stack>
              <Typography variant="h5">{pendingOrders}</Typography>
              <Typography variant="body2" color="text.secondary">Pending Orders</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ bgcolor: 'info.light', p: 1, borderRadius: 1 }}>
              <AttachMoneyIcon color="info" />
            </Box>
            <Stack>
              <Typography variant="h5">${totalRevenue}</Typography>
              <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};