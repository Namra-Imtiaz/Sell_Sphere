import {
  Stack,
  TextField,
  Typography,
  Button,
  Grid,
  FormControl,
  Radio,
  Paper,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  RadioGroup
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  addAddressAsync,
  selectAddressStatus,
  selectAddresses,
} from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import {
  createOrderAsync,
  selectCurrentOrder,
  selectOrderStatus,
} from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SHIPPING, TAXES } from '../../../constants'
import { motion } from 'framer-motion'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import SandboxPayment from './SandboxPayment'

export const Checkout = () => {
  const addresses = useSelector(selectAddresses)
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()
  const loggedInUser = useSelector(selectLoggedInUser)
  const addressStatus = useSelector(selectAddressStatus)
  const navigate = useNavigate()
  const cartItems = useSelector(selectCartItems)
  const orderStatus = useSelector(selectOrderStatus)
  const currentOrder = useSelector(selectCurrentOrder)
  const orderTotal = cartItems.reduce(
    (acc, item) => item.product.price * item.quantity + acc,
    0
  )
  const theme = useTheme()
  const is900 = useMediaQuery(theme.breakpoints.down(900))
  const is480 = useMediaQuery(theme.breakpoints.down(480))
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    if (addressStatus === 'fulfilled') {
      reset()
    } else if (addressStatus === 'rejected') {
      alert('Error adding your address')
    }
  }, [addressStatus, reset])

  useEffect(() => {
    if (currentOrder && currentOrder?._id) {
      dispatch(resetCartByUserIdAsync(loggedInUser?._id))
      navigate(`/order-success/${currentOrder?._id}`)
    }
  }, [currentOrder, dispatch, navigate, loggedInUser])

  const handleAddAddress = (data) => {
    const address = { ...data, user: loggedInUser._id }
    dispatch(addAddressAsync(address))
  }

  const handleCreateOrder = async () => {
    if (selectedPaymentMethod === 'CARD') {
      if (!stripe || !elements) return

      const res = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: orderTotal + SHIPPING + TAXES }),
      })

      const { clientSecret } = await res.json()

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (result.error) {
        alert(result.error.message)
      } else if (result.paymentIntent.status === 'succeeded') {
        const order = {
          user: loggedInUser._id,
          item: cartItems,
          address: selectedAddress,
          paymentMode: 'CARD',
          total: orderTotal + SHIPPING + TAXES,
          paymentId: result.paymentIntent.id,
        }
        dispatch(createOrderAsync(order))
      }
    } else if (selectedPaymentMethod === 'SANDBOX') {
      const order = {
        user: loggedInUser._id,
        item: cartItems,
        address: selectedAddress,
        paymentMode: 'SANDBOX',
        total: orderTotal + SHIPPING + TAXES,
        paymentId: 'sandbox-test-id',
      }
      dispatch(createOrderAsync(order))
    } else {
      const order = {
        user: loggedInUser._id,
        item: cartItems,
        address: selectedAddress,
        paymentMode: 'COD',
        total: orderTotal + SHIPPING + TAXES,
      }
      dispatch(createOrderAsync(order))
    }
  }

  const handleProceedToPayment = () => {
    if (!selectedAddress || !selectedPaymentMethod || cartItems.length === 0) {
      alert('Please select address and payment method before proceeding.')
      return
    }

    handleCreateOrder()
  }

  return (
    <Stack
      flexDirection="row"
      p={2}
      rowGap={10}
      justifyContent="center"
      flexWrap="wrap"
      mb="5rem"
      mt={2}
      columnGap={4}
      alignItems="flex-start"
    >
      {/* left section */}
      <Stack rowGap={4}>
        <Stack flexDirection="row" columnGap={is480 ? 0.3 : 1} alignItems="center">
          <motion.div whileHover={{ x: -5 }}>
            <IconButton component={Link} to="/cart">
              <ArrowBackIcon fontSize={is480 ? 'medium' : 'large'} />
            </IconButton>
          </motion.div>
          <Typography variant="h4">Shipping Information</Typography>
        </Stack>

        <Stack component="form" noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
          <TextField label="Type" {...register('type', { required: true })} />
          <TextField label="Street" {...register('street', { required: true })} />
          <TextField label="Country" {...register('country', { required: true })} />
          <TextField label="Phone Number" type="number" {...register('phoneNumber', { required: true })} />
          <Stack flexDirection="row" gap={2}>
            <TextField fullWidth label="City" {...register('city', { required: true })} />
            <TextField fullWidth label="State" {...register('state', { required: true })} />
            <TextField fullWidth label="Postal Code" type="number" {...register('postalCode', { required: true })} />
          </Stack>
          <Stack flexDirection="row" alignSelf="flex-end" columnGap={1}>
            <LoadingButton loading={addressStatus === 'pending'} type="submit" variant="contained">
              Add
            </LoadingButton>
            <Button color="error" variant="outlined" onClick={() => reset()}>
              Reset
            </Button>
          </Stack>
        </Stack>

        {/* Address selection */}
        <Stack rowGap={3}>
          <Stack>
            <Typography variant="h6">Address</Typography>
            <Typography variant="body2" color="text.secondary">
              Choose from existing Addresses
            </Typography>
          </Stack>

          <Grid container gap={2} width={is900 ? 'auto' : '50rem'}>
            {addresses.map((address) => (
              <Grid item key={address._id}>
                <Paper elevation={1} sx={{ p: 2, width: '20rem' }}>
                  <Stack>
                    <Stack flexDirection="row" alignItems="center">
                      <Radio
                        checked={selectedAddress?._id === address._id}
                        onChange={() => setSelectedAddress(address)}
                      />
                      <Typography>{address.type}</Typography>
                    </Stack>
                    <Typography>{address.street}</Typography>
                    <Typography>
                      {address.state}, {address.city}, {address.country}, {address.postalCode}
                    </Typography>
                    <Typography>{address.phoneNumber}</Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* Payment Methods */}
        <Stack rowGap={3}>
          <Stack>
            <Typography variant="h6">Payment Methods</Typography>
            <Typography variant="body2" color="text.secondary">
              Please select a payment method
            </Typography>
          </Stack>

          <RadioGroup value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
            <FormControlLabel value="COD" control={<Radio />} label="Cash" />
            <FormControlLabel value="CARD" control={<Radio />} label="Card" />
            <FormControlLabel value="SANDBOX" control={<Radio />} label="PayFast (Sandbox)" />
          </RadioGroup>
        </Stack>

        {selectedPaymentMethod === 'CARD' && (
          <Box border="1px solid #ccc" borderRadius="5px" p={2}>
            <Typography variant="body1">Enter Card Details</Typography>
            <CardElement />
          </Box>
        )}

        {selectedPaymentMethod === 'SANDBOX' && <SandboxPayment />}
      </Stack>

      {/* right section */}
      <Stack width={is900 ? '100%' : 'auto'} alignItems={is900 ? 'flex-start' : ''}>
        <Typography variant="h4">Order Summary</Typography>
        <Cart checkout={true} />
        <LoadingButton
          fullWidth
          loading={orderStatus === 'pending'}
          variant="contained"
          onClick={handleProceedToPayment}
          size="large"
        >
          Pay and Order
        </LoadingButton>
      </Stack>
    </Stack>
  )
}
