// src/features/checkout/components/SandboxPayment.jsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const SandboxPayment = () => {
  const merchantId = '10038879';
  const merchantKey = 'xp624m7lrmv82';
  const returnUrl = 'http://localhost:3000/success';
  const cancelUrl = 'http://localhost:3000/cancel';
  const notifyUrl = 'http://localhost:5000/payfast/notify';
  const amount = '150.00'; // You can pass this dynamically if needed
  const itemName = 'Premium Product';

  return (
    <Box border="1px dashed gray" p={2} borderRadius={2}>
      <Typography variant="body1" color="text.secondary">
        This is a sandbox/test payment method. No real money is involved.
      </Typography>
      <Typography variant="body2" mt={1} mb={2}>
        You can proceed with the order without entering actual payment details.
      </Typography>

      <form
        action="https://sandbox.payfast.co.za/eng/process"
        method="post"
      >
        <input type="hidden" name="merchant_id" value={merchantId} />
        <input type="hidden" name="merchant_key" value={merchantKey} />
        <input type="hidden" name="return_url" value={returnUrl} />
        <input type="hidden" name="cancel_url" value={cancelUrl} />
        <input type="hidden" name="notify_url" value={notifyUrl} />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="item_name" value={itemName} />

        <Button type="submit" variant="contained" color="primary">
          Pay with PayFast Sandbox
        </Button>
      </form>
    </Box>
  );
};

export default SandboxPayment;
