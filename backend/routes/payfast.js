const express = require("express");
const router = express.Router();

// Replace with your own PayFast credentials and URLs
const PAYFAST_SANDBOX_URL = 'https://sandbox.payfast.co.za/eng/process';

router.post("/initialize-payment", async (req, res) => {
  try {
    const { total, cartItems, selectedAddress, userId } = req.body;

    // Prepare PayFast payment data
    const paymentData = {
      merchant_id: "10038879", // Replace with your PayFast Merchant ID
      merchant_key: "xp624m7lrmv82", // Replace with your PayFast Merchant Key
      amount: total,
      item_name: `Order: ${cartItems.map(item => item.name).join(', ')}`,
      item_description: `Items: ${cartItems.length} items`,
      return_url: "http://yourdomain.com/payment-success", // Change to your success URL
      cancel_url: "http://yourdomain.com/payment-cancel", // Change to your cancel URL
      notify_url: "http://yourdomain.com/payment-notify", // Change to your notify URL
      email: "user@example.com", // Can be dynamic based on logged-in user
    };

    const paymentUrl = `${PAYFAST_SANDBOX_URL}?${new URLSearchParams(paymentData).toString()}`;

    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error initializing payment" });
  }
});

module.exports = router;
