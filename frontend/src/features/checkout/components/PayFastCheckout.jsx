// src/features/checkout/components/PayFastCheckout.jsx

import React from "react";

export function PayFastCheckout() {
  const handleSubmit = (e) => {
    // Optional: e.preventDefault(); // But for PayFast, let it redirect normally
  };

  return (
    <form
      action="https://sandbox.payfast.co.za/eng/process"
      method="post"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="merchant_id" value="10038879" />
      <input type="hidden" name="merchant_key" value="xp624m7lrmv82" />
      <input type="hidden" name="return_url" value="http://localhost:3000/success" />
      <input type="hidden" name="cancel_url" value="http://localhost:3000/cancel" />
      <input type="hidden" name="notify_url" value="http://localhost:5000/payfast/notify" />
      <input type="hidden" name="amount" value="150.00" />
      <input type="hidden" name="item_name" value="Premium Product" />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded mt-4">
        Pay and Order
      </button>
    </form>
  );
}
