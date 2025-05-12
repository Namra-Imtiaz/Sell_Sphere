import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from '../features/auth/AuthSlice';
import { createOrderAsync, selectOrderStatus, selectCurrentOrder } from '../features/order/OrderSlice';
import { resetCartByUserIdAsync } from '../features/cart/CartSlice';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

export const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const orderStatus = useSelector(selectOrderStatus);
  const currentOrder = useSelector(selectCurrentOrder);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { selectedAddress, selectedPaymentMethod, cartItems, total } = location.state || {};

  useEffect(() => {
    if (!selectedAddress || !selectedPaymentMethod || !cartItems) {
      navigate('/checkout');
    }
  }, [selectedAddress, selectedPaymentMethod, cartItems, navigate]);

  useEffect(() => {
    if (currentOrder && currentOrder._id) {
      dispatch(resetCartByUserIdAsync(user?._id));
      navigate(`/order-success/${currentOrder._id}`);
    }
  }, [currentOrder, dispatch, navigate, user]);

  const handlePayment = async () => {
    if (!user) return alert('User not found.');

    setLoading(true);
    setError(null);

    if (selectedPaymentMethod === 'SANDBOX') {
      // Assuming you've set up your PayFast integration on the backend
      try {
        const response = await fetch('/api/payfast/initialize-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total,
            cartItems,
            selectedAddress,
            userId: user._id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize payment with PayFast');
        }

        const { paymentUrl } = await response.json();

        if (paymentUrl) {
          window.location.href = paymentUrl; // Redirect to PayFast
        } else {
          throw new Error('Payment initialization failed. Please try again later.');
        }
      } catch (error) {
        setError('Payment initialization failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (selectedPaymentMethod === 'CARD') {
      // Handle Stripe or other card payment methods here
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>Confirm Your Payment</Typography>

      {selectedPaymentMethod === 'CARD' && (
        <Box border="1px solid #ccc" borderRadius="5px" p={2} mb={2}>
          <Typography variant="body1">Enter Card Details</Typography>
          {/* CardElement for Stripe */}
        </Box>
      )}

      {selectedPaymentMethod === 'SANDBOX' && (
        <Box>
          <Typography variant="body1">You will be redirected to PayFast for payment processing.</Typography>
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handlePayment}
        disabled={loading || orderStatus === 'pending'}
      >
        {loading ? <CircularProgress size={24} /> : 'Confirm and Pay'}
      </Button>

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};
