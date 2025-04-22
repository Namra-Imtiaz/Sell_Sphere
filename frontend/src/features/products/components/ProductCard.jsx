"use client"

import { FormHelperText, Paper, Typography, useMediaQuery, useTheme, Box, styled } from "@mui/material"
import { useNavigate } from "react-router-dom"
import FavoriteBorder from "@mui/icons-material/FavoriteBorder"
import Favorite from "@mui/icons-material/Favorite"
import Checkbox from "@mui/material/Checkbox"
import { useDispatch, useSelector } from "react-redux"
import { selectWishlistItems } from "../../wishlist/WishlistSlice"
import { selectLoggedInUser } from "../../auth/AuthSlice"
import { addToCartAsync, selectCartItems } from "../../cart/CartSlice"
import { motion } from "framer-motion"
import { alpha } from "@mui/material/styles"
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined"
import DoneIcon from "@mui/icons-material/Done"

// Refined sage green palette with additional shades
const sageGreenPalette = {
  main: "#6A8A70",
  light: "#8AAD91",
  lighter: "#EEF4F0",
  lightest: "#F7FAF8",
  dark: "#4D6652",
  darker: "#3A4F3D",
  contrastText: "#FFFFFF",
  accent: "#D0E0D5",
}

// Styled components with enhanced design
const StyledCard = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(0),
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  borderRadius: "16px",
  border: `1px solid ${alpha(sageGreenPalette.main, 0.1)}`,
  position: "relative",
  backgroundColor: sageGreenPalette.lightest,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `linear-gradient(to bottom, ${alpha(sageGreenPalette.main, 0)} 0%, ${alpha(
      sageGreenPalette.main,
      0.02,
    )} 100%)`,
    pointerEvents: "none",
  },
}))

const ImageContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  backgroundColor: "#FFFFFF",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    background: `linear-gradient(to bottom, ${alpha(sageGreenPalette.lighter, 0.5)} 0%, rgba(255,255,255,0) 100%)`,
    zIndex: 1,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover::before": {
    opacity: 1,
  },
})

const ProductImage = styled("img")({
  width: "100%",
  aspectRatio: "1/1",
  objectFit: "contain",
  transition: "transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  padding: "16px",
})

const WishlistButton = styled(Box)({
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 10,
  transition: "transform 0.3s ease",
})

const AddToCartButton = styled(motion.button)({
  padding: "10px 16px",
  borderRadius: "30px",
  outline: "none",
  border: "none",
  cursor: "pointer",
  backgroundColor: sageGreenPalette.dark,
  color: sageGreenPalette.contrastText,
  fontWeight: 600,
  fontSize: "0.9rem",
  transition: "all 0.3s ease",
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  boxShadow: `0 4px 12px ${alpha(sageGreenPalette.dark, 0.25)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
})

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}))

const BrandBadge = styled(Box)({
  position: "absolute",
  top: "12px",
  left: "12px",
  backgroundColor: alpha(sageGreenPalette.main, 0.1),
  color: sageGreenPalette.dark,
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: 600,
  zIndex: 10,
  backdropFilter: "blur(4px)",
  border: `1px solid ${alpha(sageGreenPalette.main, 0.2)}`,
  boxShadow: `0 2px 6px ${alpha(sageGreenPalette.dark, 0.1)}`,
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
})

export const ProductCard = ({
  id,
  title,
  price,
  thumbnail,
  brand,
  stockQuantity,
  handleAddRemoveFromWishlist,
  isWishlistCard,
  isAdminCard,
}) => {
  const navigate = useNavigate()
  const wishlistItems = useSelector(selectWishlistItems)
  const loggedInUser = useSelector(selectLoggedInUser)
  const cartItems = useSelector(selectCartItems)
  const dispatch = useDispatch()

  const theme = useTheme()
  const is1410 = useMediaQuery(theme.breakpoints.down(1410))
  const is932 = useMediaQuery(theme.breakpoints.down(932))
  const is752 = useMediaQuery(theme.breakpoints.down(752))
  const is500 = useMediaQuery(theme.breakpoints.down(500))
  const is608 = useMediaQuery(theme.breakpoints.down(608))
  const is488 = useMediaQuery(theme.breakpoints.down(488))
  const is408 = useMediaQuery(theme.breakpoints.down(408))

  const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id)
  const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id)

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    const data = { user: loggedInUser?._id, product: id }
    dispatch(addToCartAsync(data))
  }

  // Card width based on screen size
  const cardWidth = is408
    ? "100%"
    : is488
      ? "200px"
      : is608
        ? "240px"
        : is752
          ? "300px"
          : is932
            ? "240px"
            : is1410
              ? "300px"
              : "340px"

  // Only render if the product is in the wishlist or if it's not a wishlist-specific view
  if (isProductAlreadyinWishlist === -1 && !isWishlistCard && !isAdminCard) {
    return null
  }

  return (
    <StyledCard
      elevation={0}
      component={isAdminCard || isWishlistCard || is408 ? "div" : Paper}
      onClick={() => navigate(`/product-details/${id}`)}
      style={{ width: cardWidth, marginTop: is408 ? "16px" : 0 }}
      whileHover={{ y: -8, boxShadow: `0 20px 30px ${alpha(sageGreenPalette.dark, 0.15)}` }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {/* Brand badge */}
      <BrandBadge>{brand}</BrandBadge>

      {/* Image container */}
      <ImageContainer>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <ProductImage src={thumbnail || "/placeholder.svg"} alt={`${title} photo unavailable`} />
        </motion.div>

        {/* Wishlist button */}
        {!isAdminCard && (
          <WishlistButton>
            <motion.div
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Checkbox
                onClick={(e) => e.stopPropagation()}
                checked={isProductAlreadyinWishlist}
                onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                icon={
                  <FavoriteBorder
                    sx={{
                      color: alpha("#000000", 0.7),
                      filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.2))",
                      fontSize: "1.5rem",
                    }}
                  />
                }
                checkedIcon={
                  <Favorite
                    sx={{
                      color: "#FF5C5C",
                      filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.2))",
                      fontSize: "1.5rem",
                    }}
                  />
                }
              />
            </motion.div>
          </WishlistButton>
        )}
      </ImageContainer>

      {/* Content container */}
      <ContentContainer>
        {/* Product info */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "#2D3748",
              lineHeight: 1.3,
              mb: 0.5,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Price and cart section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography
              sx={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: sageGreenPalette.dark,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                letterSpacing: "-0.02em",
              }}
            >
              ${price}
            </Typography>

            {/* Stock quantity indicator */}
            {stockQuantity <= 20 && (
              <FormHelperText
                error
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  mt: 0.5,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {stockQuantity === 1 ? "Only 1 left in stock!" : "Low stock - order soon!"}
              </FormHelperText>
            )}
          </Box>

          {!isWishlistCard ? (
            isProductAlreadyInCart ? (
              <Box
                sx={{
                  backgroundColor: alpha(sageGreenPalette.main, 0.1),
                  color: sageGreenPalette.dark,
                  padding: "8px 12px",
                  borderRadius: "30px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  gap: "4px",
                  border: `1px solid ${alpha(sageGreenPalette.main, 0.2)}`,
                }}
              >
                <DoneIcon sx={{ fontSize: "1rem" }} /> Added
              </Box>
            ) : (
              !isAdminCard && (
                <AddToCartButton
                  whileHover={{ scale: 1.05, boxShadow: `0 6px 15px ${alpha(sageGreenPalette.dark, 0.3)}` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleAddToCart(e)}
                  style={{
                    fontSize: is408 ? ".9rem" : is488 ? ".8rem" : is500 ? ".85rem" : ".9rem",
                  }}
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: "1rem" }} />
                  Add
                </AddToCartButton>
              )
            )
          ) : null}
        </Box>
      </ContentContainer>
    </StyledCard>
  )
}
