import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { Button, Chip, Paper, Stack, Typography, useMediaQuery, useTheme, Box, Divider } from '@mui/material'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { SHIPPING, TAXES } from '../../../constants'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems)
    const subtotal = items.reduce((acc, item) => item.product.price * item.quantity + acc, 0)
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const navigate = useNavigate()
    const theme = useTheme()
    const is900 = useMediaQuery(theme.breakpoints.down(900))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    // Custom sage green color palette
    const sageGreen = {
        light: '#E8F1E8',
        main: '#8BAF8B',
        dark: '#5A775A',
        contrastText: '#FFFFFF'
    }

    const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (items.length === 0) {
            navigate("/")
        }
    }, [items])

    useEffect(() => {
        if (cartItemRemoveStatus === 'fulfilled') {
            toast.success("Product removed from cart")
        }
        else if (cartItemRemoveStatus === 'rejected') {
            toast.error("Error removing product from cart, please try again later")
        }
    }, [cartItemRemoveStatus])

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus())
        }
    }, [])

    return (
        <Box 
            sx={{
                backgroundColor: sageGreen.light,
                minHeight: 'calc(100vh - 4rem)',
                padding: is480 ? 2 : 3,
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Stack 
                component={Paper} 
                elevation={2}
                width={is900 ? '100%' : '50rem'} 
                p={is480 ? 2 : 3} 
                mt={2} 
                mb={5} 
                borderRadius={2}
                sx={{
                    boxShadow: '0 4px 20px rgba(138, 175, 139, 0.15)'
                }}
            >
                {/* Cart header */}
                <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1}
                    mb={3}
                    pb={2}
                    sx={{ borderBottom: `1px solid ${sageGreen.light}` }}
                >
                    <ShoppingCartIcon sx={{ color: sageGreen.main }} />
                    <Typography variant="h5" fontWeight={500} color={sageGreen.dark}>
                        {checkout ? 'Order Summary' : 'Your Cart'}
                    </Typography>
                    <Chip 
                        label={`${totalItems} ${totalItems === 1 ? 'item' : 'items'}`} 
                        size="small"
                        sx={{ 
                            bgcolor: sageGreen.light,
                            color: sageGreen.dark,
                            ml: 1
                        }}
                    />
                </Stack>

                {/* Cart items section */}
                {items.length > 0 ? (
                    <Stack 
                        spacing={2} 
                        mb={4}
                        sx={{
                            maxHeight: '50vh',
                            overflowY: 'auto',
                            pr: 1,
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: sageGreen.light,
                                borderRadius: '10px',
                                '&:hover': {
                                    backgroundColor: sageGreen.main,
                                },
                            },
                        }}
                    >
                        {items.map((item) => (
                            <CartItem 
                                key={item._id} 
                                id={item._id} 
                                title={item.product.title} 
                                brand={item.product.brand.name} 
                                category={item.product.category.name} 
                                price={item.product.price} 
                                quantity={item.quantity} 
                                thumbnail={item.product.thumbnail} 
                                stockQuantity={item.product.stockQuantity} 
                                productId={item.product._id}
                                themeColors={sageGreen}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Box 
                        sx={{ 
                            p: 4, 
                            textAlign: 'center',
                            mb: 3
                        }}
                    >
                        <Typography variant="body1">Your cart is empty</Typography>
                    </Box>
                )}

                {/* Price Summary */}
                <Box 
                    component={Paper} 
                    elevation={checkout ? 0 : 1}
                    sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        bgcolor: checkout ? 'transparent' : sageGreen.light,
                        border: checkout ? 'none' : `1px solid ${sageGreen.main}`,
                    }}
                >
                    {checkout ? (
                        <Stack spacing={2} width="100%">
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body1">Subtotal</Typography>
                                <Typography variant="body1" fontWeight={500}>${subtotal.toFixed(2)}</Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body1">Shipping</Typography>
                                <Typography variant="body1" fontWeight={500}>${SHIPPING.toFixed(2)}</Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body1">Taxes</Typography>
                                <Typography variant="body1" fontWeight={500}>${TAXES.toFixed(2)}</Typography>
                            </Stack>

                            <Divider sx={{ borderColor: sageGreen.light, my: 1 }} />

                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight={600} color={sageGreen.dark}>Total</Typography>
                                <Typography variant="h6" fontWeight={600} color={sageGreen.dark}>
                                    ${(subtotal + SHIPPING + TAXES).toFixed(2)}
                                </Typography>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack direction={is480 ? "column" : "row"} justifyContent="space-between" alignItems={is480 ? "flex-start" : "center"} spacing={2}>
                            <Stack>
                                <Typography variant="h6" fontWeight={500} color={sageGreen.dark}>Subtotal: ${subtotal.toFixed(2)}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Shipping and taxes will be calculated at checkout
                                </Typography>
                            </Stack>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" fontWeight={500} color={sageGreen.dark}>
                                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                </Typography>
                            </Box>
                        </Stack>
                    )}
                </Box>
                
                {/* Action buttons */}
                {!checkout && (
                    <Stack spacing={2} mt={3}>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/checkout"
                            size={is480 ? "medium" : "large"}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                bgcolor: sageGreen.main,
                                '&:hover': {
                                    bgcolor: sageGreen.dark,
                                },
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 500,
                                py: 1.5
                            }}
                        >
                            Proceed to Checkout
                        </Button>
                        
                        <motion.div 
                            style={{ alignSelf: 'center' }} 
                            whileHover={{ y: 2 }}
                        >
                            <Button
                                component={Link}
                                to="/"
                                startIcon={<KeyboardBackspaceIcon />}
                                sx={{
                                    color: sageGreen.dark,
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                        color: sageGreen.main,
                                    },
                                    textTransform: 'none'
                                }}
                            >
                                Continue Shopping
                            </Button>
                        </motion.div>
                    </Stack>
                )}
            </Stack>
        </Box>
    )
}