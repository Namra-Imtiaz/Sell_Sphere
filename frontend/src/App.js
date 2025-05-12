import { useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";
import { selectIsAuthChecked, selectLoggedInUser } from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";
import {
  AddProductPage,
  AdminOrdersPage,
  CartPage,
  CheckoutPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  OrderSuccessPage,
  OtpVerificationPage,
  ProductDetailsPage,
  ProductUpdatePage,
  ResetPasswordPage,
  SignupPage,
  UserOrdersPage,
  UserProfilePage,
  WishlistPage,
} from './pages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import {PaymentFormPage} from './pages/PaymentFormPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentPage } from './pages'


function App() {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);
  const stripePromise = loadStripe('pk_test_51RNbJdFvZZu1KdgJy5gJZhZcHy1hmwtiO52UsS3NDOBm2kJD0QtV8QGNklZiQLqieizZUGOKYK661O7UY7hXWMft00uvE33lYx');

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Auth Routes */}
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verify-otp' element={<OtpVerificationPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:userId/:passwordResetToken' element={<ResetPasswordPage />} />
        <Route path='/logout' element={<Protected><Logout /></Protected>} />
        <Route path='/product-details/:id' element={<Protected><ProductDetailsPage /></Protected>} />

        {loggedInUser?.isAdmin ? (
          <>
            {/* Admin Routes */}
            <Route path='/admin/dashboard' element={<Protected><AdminDashboardPage /></Protected>} />
            <Route path='/admin/product-update/:id' element={<Protected><ProductUpdatePage /></Protected>} />
            <Route path='/admin/add-product' element={<Protected><AddProductPage /></Protected>} />
            <Route path='/admin/orders' element={<Protected><AdminOrdersPage /></Protected>} />
            <Route path='*' element={<Navigate to={'/admin/dashboard'} />} />
          </>
        ) : (
          <>
            {/* User Routes */}
            <Route path='/' element={<Protected><HomePage /></Protected>} />
            <Route path='/cart' element={<Protected><CartPage /></Protected>} />
            <Route path='/profile' element={<Protected><UserProfilePage /></Protected>} />
            <Route path='/checkout' element={<Protected><CheckoutPage /></Protected>} />
            <Route path='/order-success/:id' element={<Protected><OrderSuccessPage /></Protected>} />
            <Route path='/orders' element={<Protected><UserOrdersPage /></Protected>} />
            <Route path='/wishlist' element={<Protected><WishlistPage /></Protected>} />
            <Route path='/payment' element={<Protected><PaymentFormPage /></Protected>} />
            <Route path="/payment-sandbox" element={<PaymentPage />} />

          </>
        )}

        {/* Catch-all route */}
        <Route path='*' element={<NotFoundPage />} />
      </>
    )
  );

  return isAuthChecked ? (
    <Elements stripe={stripePromise}>
      <RouterProvider router={routes} />
    </Elements>
  ) : null;
}

export default App;
