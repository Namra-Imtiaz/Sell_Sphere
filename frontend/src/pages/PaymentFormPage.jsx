// src/pages/PaymentFormPage.jsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../features/checkout/components/CheckoutForm';

const stripePromise = loadStripe("pk_test_51RNbJdFvZZu1KdgJy5gJZhZcHy1hmwtiO52UsS3NDOBm2kJD0QtV8QGNklZiQLqieizZUGOKYK661O7UY7hXWMft00uvE33lYx");

export const PaymentFormPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

