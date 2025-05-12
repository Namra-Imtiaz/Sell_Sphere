## Sell-Sphere: 

**MERN Ecommerce** This full-stack application is built to support local artists and promote their businesses, while offering users the ability to shop for handcrafted materials. Developed with the MERN stack (MongoDB, Express.js, React, Node.js), it incorporates Redux Toolkit for efficient state management and Material UI for a modern, user-friendly interface. Designed for both users and administrators, the platform provides a robust and feature-rich environment, ensuring seamless and efficient interactions.


# **Features**

### **User:**
- **Product Reviews:**
  - Write, edit, and delete reviews.
  - Instant updates on ratings and star percentages.
  
- **Wishlist:**
  - Add, remove, and annotate products with personalized notes.
  
- **Order Management:**
  - Create new orders and view order history.
  
- **Profile Management:**
  - Manage email, username, and multiple addresses.
  
- **Shopping Cart:**
  - Add products, adjust quantities, and view subtotals.

 **Place order:**
  - Place order , Pay Amount 

### **Admin:**

--**Admin Dashboard:**
  - Sales, revenue And order details.

- **Product Management:**
  - Add, edit, delete, and soft-delete products.
  - Manage product attributes like name and stock.
  
- **Order Management:**
  - View and update order details and status.



# **Project Setup**

### Prerequisites
- Node.js ( version v21.1.0 or later )
- MongoDB installed and running locally

### Clone the project

```bash
  git clone https://github.com/Namra-Imtiaz/Sell_Sphere


### Install dependencies for frontend and backend separately
**Tip:** To efficiently install dependencies for both frontend and backend simultaneously, use split terminals.

Install frontend dependencies
```bash
cd frontend
npm install
```

Install backend dependencies

```bash
cd backend
npm install
```


### Environment Variables
**Backend**
- Create a `.env` file in the `backend` directory and add this script there.

```bash
# Database connection string
MONGO_URI=""

# Frontend URL (adjust if needed)
ORIGIN="http://localhost:3000"

# Token and cookie expiration settings
LOGIN_TOKEN_EXPIRATION="30d"  # Days
OTP_EXPIRATION_TIME="120000"  # Milliseconds
PASSWORD_RESET_TOKEN_EXPIRATION="2m"  # Minutes
COOKIE_EXPIRATION_DAYS="30"    # Days

# Secret key for jwt security
SECRET_KEY="your-secret-key"

# Environment (production/development)
PRODUCTION="false" # Initially set to false for development
```

**Frontend**
- Create a `.env` file in the `frontend` directory and add this Script.
```bash
# Backend URL (adjust if needed)
REACT_APP_BASE_URL="http://localhost:8000" 
```

### Running Development Servers

- **Separate terminals**: Run the commands in separate terminal windows or use `split terminal` to avoid conflicts.
- **Nodemon required**: Ensure you have `nodemon` installed globally to run the backend development servers using `npm run dev`. You can install it globally using `npm install -g nodemon`.

#### Start the backend server
- Navigate to the `backend` directory: `cd backend`
- Start the server: `npm run dev` (or npm start)
- You should see a message indicating the server is running, usually on port 8000.
     
#### Start the frontend server:
- Navigate to the `frontend` directory: `cd frontend`
- Start the server: `npm start`
- You should see a message indicating the server is running, usually on port 3000.

### Now Explore the application 

### To Explore Application From Perspective select Role as User and enter registered email.
- 
```bash
  email: "Your-email@gmail.com"
  pass: "Your-password"
```

### To Explore Applocation From Admin Perspective Select Role As a Admin and enter these credentials

```bash
  email: "admin@gmail.com"
  pass: "Admin123@"
```


### Accessing the Application
Once both servers are running, you can access them at the following URL's:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
