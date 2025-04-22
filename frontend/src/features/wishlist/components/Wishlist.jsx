import { Box, Button, Grid, IconButton, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistFetchStatus, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, resetWishlistItemUpdateStatus, selectWishlistFetchStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItemUpdateStatus, selectWishlistItems, updateWishlistItemByIdAsync } from '../WishlistSlice'
import { ProductCard } from '../../products/components/ProductCard'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { emptyWishlistAnimation, loadingAnimation } from '../../../assets';
import Lottie from 'lottie-react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useForm } from "react-hook-form"
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice'
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

export const Wishlist = () => {
  const dispatch = useDispatch()
  const wishlistItems = useSelector(selectWishlistItems)
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)
  const wishlistItemUpdateStatus = useSelector(selectWishlistItemUpdateStatus)
  const loggedInUser = useSelector(selectLoggedInUser)
  const cartItems = useSelector(selectCartItems)
  const cartItemAddStatus = useSelector(selectCartItemAddStatus)
  const wishlistFetchStatus = useSelector(selectWishlistFetchStatus)

  const [editIndex, setEditIndex] = useState(-1)
  const [editValue, setEditValue] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const theme = useTheme()
  const is1130 = useMediaQuery(theme.breakpoints.down(1130))
  const is642 = useMediaQuery(theme.breakpoints.down(642))
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  // Custom sage green color palette
  const sageGreen = {
    light: '#E8F1E8',
    main: '#8BAF8B',
    dark: '#5A775A',
    contrastText: '#FFFFFF'
  }

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: productId }
      dispatch(createWishlistItemAsync(data))
    }
    else if (!e.target.checked) {
      const index = wishlistItems.findIndex((item) => item.product._id === productId)
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    })
  }, [])

  useEffect(() => {
    if (wishlistItemAddStatus === 'fulfilled') {
      toast.success("Product added to wishlist")
    }
    else if (wishlistItemAddStatus === 'rejected') {
      toast.error("Error adding product to wishlist, please try again later")
    }
  }, [wishlistItemAddStatus])

  useEffect(() => {
    if (wishlistItemDeleteStatus === 'fulfilled') {
      toast.success("Product removed from wishlist")
    }
    else if (wishlistItemDeleteStatus === 'rejected') {
      toast.error("Error removing product from wishlist, please try again later")
    }
  }, [wishlistItemDeleteStatus])

  useEffect(() => {
    if (wishlistItemUpdateStatus === 'fulfilled') {
      toast.success("Wishlist item updated")
    }
    else if (wishlistItemUpdateStatus === 'rejected') {
      toast.error("Error updating wishlist item")
    }

    setEditIndex(-1)
    setEditValue("")
  }, [wishlistItemUpdateStatus])

  useEffect(() => {
    if (cartItemAddStatus === 'fulfilled') {
      toast.success("Product added to cart")
    }
    else if (cartItemAddStatus === 'rejected') {
      toast.error('Error adding product to cart, please try again later')
    }
  }, [cartItemAddStatus])

  useEffect(() => {
    if (wishlistFetchStatus === 'rejected') {
      toast.error("Error fetching wishlist, please try again later")
    }
  }, [wishlistFetchStatus])

  useEffect(() => {
    return () => {
      dispatch(resetWishlistFetchStatus())
      dispatch(resetCartItemAddStatus())
      dispatch(resetWishlistItemUpdateStatus())
      dispatch(resetWishlistItemDeleteStatus())
      dispatch(resetWishlistItemAddStatus())
    }
  }, [])

  const handleNoteUpdate = (wishlistItemId) => {
    const update = { _id: wishlistItemId, note: editValue }
    dispatch(updateWishlistItemByIdAsync(update))
  }

  const handleEdit = (index) => {
    setEditValue(wishlistItems[index].note)
    setEditIndex(index)
  }

  const handleAddToCart = (productId) => {
    const data = { user: loggedInUser?._id, product: productId }
    dispatch(addToCartAsync(data))
  }

  return (
    <Box
      sx={{
        backgroundColor: sageGreen.light,
        minHeight: 'calc(100vh - 4rem)',
        width: '100%',
        paddingBottom: '5rem'
      }}
    >
      {/* Loading animation */}
      {wishlistFetchStatus === 'pending' ? (
        <Stack width="100%" height={'calc(100vh - 4rem)'} justifyContent={'center'} alignItems={'center'}>
          <Lottie animationData={loadingAnimation} style={{ maxWidth: '25rem' }} />
        </Stack>
      ) : (
        <Stack alignItems="center" sx={{ padding: is480 ? 2 : 3 }}>
          <Stack 
            width={is1130 ? "100%" : '70rem'} 
            rowGap={is480 ? 2 : 4} 
            maxWidth="1200px"
          >
            {/* Header section with back button */}
            <Box 
              component={Paper} 
              elevation={2}
              sx={{
                p: is480 ? 2 : 3,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                backgroundColor: '#fff',
                boxShadow: '0 4px 20px rgba(138, 175, 139, 0.15)',
                mb: 2
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <motion.div whileHover={{ x: -5 }}>
                  <IconButton 
                    component={Link} 
                    to={'/'} 
                    sx={{ 
                      color: sageGreen.main,
                      backgroundColor: sageGreen.light,
                      '&:hover': {
                        backgroundColor: sageGreen.light,
                        color: sageGreen.dark
                      }
                    }}
                  >
                    <ArrowBackIcon fontSize={is480 ? 'medium' : 'large'} />
                  </IconButton>
                </motion.div>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FavoriteIcon sx={{ color: sageGreen.main }} />
                  <Typography 
                    variant={is480 ? 'h5' : 'h4'} 
                    fontWeight={500}
                    color={sageGreen.dark}
                  >
                    Your Wishlist
                  </Typography>
                </Stack>
              </Stack>
              {wishlistItems?.length > 0 && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    backgroundColor: sageGreen.light, 
                    color: sageGreen.dark, 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 2,
                    fontWeight: 500
                  }}
                >
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </Typography>
              )}
            </Box>

            {/* Wishlist content */}
            <Box sx={{ width: '100%' }}>
              {wishlistItems?.length === 0 ? (
                // Empty wishlist animation
                <Box 
                  component={Paper} 
                  elevation={2}
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 20px rgba(138, 175, 139, 0.15)'
                  }}
                >
                  <Lottie animationData={emptyWishlistAnimation} style={{ maxWidth: '300px' }} />
                  <Typography 
                    variant='h6' 
                    fontWeight={300} 
                    sx={{ mt: 2, color: 'text.secondary' }}
                  >
                    You have no items in your wishlist
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/" 
                    variant="contained"
                    sx={{
                      mt: 3,
                      bgcolor: sageGreen.main,
                      '&:hover': {
                        bgcolor: sageGreen.dark,
                      },
                      borderRadius: '8px',
                      textTransform: 'none',
                      px: 3,
                      py: 1
                    }}
                  >
                    Continue Shopping
                  </Button>
                </Box>
              ) : (
                // Wishlist grid
                <Grid 
                  container 
                  spacing={3} 
                  justifyContent={is642 ? 'center' : 'flex-start'}
                >
                  {wishlistItems.map((item, index) => (
                    <Grid item xs={12} sm={4} md={3} lg={4} key={item._id}>
                      <Box 
                        component={Paper} 
                        elevation={2}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 20px rgba(138, 175, 139, 0.2)'
                          }
                        }}
                      >
                        {/* Product Card */}
                        <ProductCard 
                          brand={item.product.brand.name}
                          id={item.product._id}
                          price={item.product.price}
                          stockQuantity={item.product.stockQuantity}
                          thumbnail={item.product.thumbnail}
                          title={item.product.title}
                          handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                          isWishlistCard={true}
                          themeColors={sageGreen}
                        />
                        
                        {/* Note Section */}
                        <Box sx={{ p: 3, backgroundColor: '#fff' }}>
                          <Stack 
                            direction="row" 
                            alignItems="center" 
                            justifyContent="space-between"
                            sx={{ mb: 1 }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <AssignmentOutlinedIcon sx={{ color: sageGreen.main, fontSize: 22 }} />
                              <Typography 
                                variant='subtitle1' 
                                fontWeight={500}
                                color={sageGreen.dark}
                              >
                                Notes
                              </Typography>
                            </Stack>
                            <IconButton 
                              onClick={() => handleEdit(index)}
                              size="small"
                              sx={{ 
                                color: sageGreen.main,
                                '&:hover': {
                                  backgroundColor: sageGreen.light,
                                }
                              }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Stack>

                          {editIndex === index ? (
                            <Stack spacing={2}>
                              <TextField 
                                multiline 
                                rows={3} 
                                value={editValue} 
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder="Add your note here..."
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                      borderColor: sageGreen.main,
                                    },
                                  },
                                }}
                              />
                              
                              <Stack 
                                direction="row" 
                                justifyContent="flex-end" 
                                spacing={1}
                              >
                                <Button 
                                  onClick={() => setEditIndex(-1)} 
                                  size='small' 
                                  variant='outlined' 
                                  color='error'
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => handleNoteUpdate(item._id)} 
                                  size='small' 
                                  variant='contained'
                                  sx={{
                                    bgcolor: sageGreen.main,
                                    '&:hover': {
                                      bgcolor: sageGreen.dark,
                                    }
                                  }}
                                >
                                  Save
                                </Button>
                              </Stack>
                            </Stack>
                          ) : (
                            <Box 
                              sx={{ 
                                backgroundColor: sageGreen.light,
                                borderRadius: 1,
                                p: 2,
                                minHeight: '60px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Typography 
                                sx={{
                                  wordWrap: "break-word",
                                  color: item.note ? 'text.primary' : 'text.secondary',
                                  fontStyle: item.note ? 'normal' : 'italic',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {item.note ? item.note : "Add a custom note here"}
                              </Typography>
                            </Box>
                          )}

                          {/* Add to Cart Button */}
                          <Button 
                            fullWidth
                            sx={{ 
                              mt: 3,
                              borderColor: sageGreen.main,
                              color: sageGreen.dark,
                              '&:hover': {
                                borderColor: sageGreen.dark,
                                backgroundColor: sageGreen.light
                              }
                            }} 
                            size='medium' 
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => handleAddToCart(item.product._id)} 
                            variant='outlined'
                            component={cartItems.some((cartItem) => cartItem.product._id === item.product._id) ? Link : undefined}
                            to={cartItems.some((cartItem) => cartItem.product._id === item.product._id) ? '/cart' : undefined}
                            disabled={cartItems.some((cartItem) => cartItem.product._id === item.product._id)}
                          >
                            {cartItems.some((cartItem) => cartItem.product._id === item.product._id) 
                              ? 'View in Cart' 
                              : 'Add to Cart'}
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Stack>
        </Stack>
      )}
    </Box>
  )
}