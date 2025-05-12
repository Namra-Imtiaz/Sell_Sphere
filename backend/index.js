require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");
const cartRoutes = require("./routes/Cart");
const brandRoutes = require("./routes/Brand");
const categoryRoutes = require("./routes/Category");
const userRoutes = require("./routes/User");
const addressRoutes = require('./routes/Address');
const reviewRoutes = require("./routes/Review");
const wishlistRoutes = require("./routes/Wishlist");
const { connectToDB } = require("./database/db");

// Stripe setup (move secret key to .env)
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initialize server
const server = express();

// Connect to database
connectToDB();

// Middlewares
server.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  exposedHeaders: ['X-Total-Count'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
server.use(express.json());
server.use(cookieParser());
server.use(morgan("tiny"));

// API routes
server.use("/auth", authRoutes);
server.use("/users", userRoutes);
server.use("/products", productRoutes);
server.use("/orders", orderRoutes);
server.use("/cart", cartRoutes);
server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/address", addressRoutes);
server.use("/reviews", reviewRoutes);
server.use("/wishlist", wishlistRoutes);

// Health check
server.get("/", (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Stripe payment intent route
server.post("/create-payment-intent", async (req, res) => {
  const { total } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // convert dollars to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PayFast integration - redirect to PayFast payment page
server.post("/payfast/initiate", (req, res) => {
  const { total, user, cartItems } = req.body;
  
  const paymentDetails = {
    merchantId: process.env.PAYFAST_MERCHANT_ID,
    merchantKey: process.env.PAYFAST_MERCHANT_KEY,
    total: total,
    userId: user._id,
    cartItems: cartItems,
    returnUrl: "http://localhost:8000/payfast/return",
    notifyUrl: "http://localhost:8000/payfast/notify",
    cancelUrl: "http://localhost:8000/payfast/cancel",
  };
  
  // Here you would need to generate a PayFast signature
  // (Refer to PayFast's documentation to create this signature)
  
  const payfastUrl = "https://www.payfast.co.za/eng/process"; // PayFast payment URL
  res.redirect(payfastUrl);
});

server.post("/payfast/initiate", (req, res) => {
  const { total, user, cartItems } = req.body;
  
  const paymentDetails = {
    merchantId: process.env.PAYFAST_MERCHANT_ID,
    merchantKey: process.env.PAYFAST_MERCHANT_KEY,
    total: total,
    userId: user._id,
    cartItems: cartItems,
    returnUrl: "http://localhost:8000/payfast/return",
    notifyUrl: "http://localhost:8000/payfast/notify",
    cancelUrl: "http://localhost:8000/payfast/cancel",
  };
  
  // Generate PayFast signature (Refer to PayFast docs for signature generation)
  const payfastUrl = "https://www.payfast.co.za/eng/process"; // PayFast payment URL
  res.redirect(payfastUrl);
});

server.post('/payfast/notify', (req, res) => {
  // Handle IPN (Instant Payment Notification)
  console.log('PayFast Notification Received:', req.body);
  
  // Process the payment notification (e.g., mark the order as paid)
  
  res.status(200).send();
});

server.get('/payfast/return', (req, res) => {
  // Here, you can handle what happens after a successful payment, such as:
  // - Updating the order status to 'Paid'
  // - Navigating to the success page
  console.log("Payment success, updating order status...");
  
  res.redirect("/order-success");
});

server.get('/payfast/cancel', (req, res) => {
  // Handle payment cancellation (e.g., notify the user, retry, etc.)
  console.log("Payment cancelled, redirecting user...");
  res.redirect("/checkout");
});


// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server [STARTED] ~ http://localhost:${PORT}`);
});
