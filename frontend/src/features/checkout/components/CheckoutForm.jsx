// src/components/CheckoutForm.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    // Call your server to create a payment intent
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: 1000 }), // Example total amount (change as needed)
    });

    const { clientSecret } = await response.json();

    // Confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      setError(result.error.message);
      setIsProcessing(false);
    } else if (result.paymentIntent.status === 'succeeded') {
      setSucceeded(true);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Complete Your Payment
      </Typography>

      {error && (
        <Typography color="error" variant="body2" paragraph>
          {error}
        </Typography>
      )}

      <CardElement />
      <div style={{ marginTop: '1rem' }}>
        <LoadingButton
          loading={isProcessing}
          type="submit"
          variant="contained"
          fullWidth
          disabled={!stripe}
        >
          {succeeded ? 'Payment Successful' : 'Pay Now'}
        </LoadingButton>
      </div>
    </form>
  );
};

export default CheckoutForm;
