import React from 'react'
import { Checkout } from '../features/checkout/components/Checkout'
import {Footer} from '../features/footer/Footer'
import { PayFastCheckout } from '../features/checkout/components/PayFastCheckout';


export const CheckoutPage = () => {
  return (
    <>
    <Checkout/>
   
    <Footer/>
    </>
  )
}
