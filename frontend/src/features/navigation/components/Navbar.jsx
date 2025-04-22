"use client"

import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import Avatar from "@mui/material/Avatar"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import { Link, useNavigate } from "react-router-dom"
import { Badge, Button, Stack, useMediaQuery, useTheme } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { selectUserInfo } from "../../user/UserSlice"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import { selectCartItems } from "../../cart/CartSlice"
import { selectLoggedInUser } from "../../auth/AuthSlice"
import { selectWishlistItems } from "../../wishlist/WishlistSlice"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import TuneIcon from "@mui/icons-material/Tune"
import { selectProductIsFilterOpen, toggleFilters } from "../../products/ProductSlice"
import { alpha } from "@mui/material/styles"
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded"

// Refined sage green palette - softer and more pleasing
const sageGreenPalette = {
  main: "#8AAD91",
  light: "#EEF4F0",
  lighter: "#F7FAF8",
  dark: "#6A8A70",
  darker: "#4D6652",
  contrastText: "#FFFFFF",
  accent: "#D0E0D5",
}

export const Navbar = ({ isProductList = false }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const userInfo = useSelector(selectUserInfo)
  const cartItems = useSelector(selectCartItems)
  const loggedInUser = useSelector(selectLoggedInUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  const wishlistItems = useSelector(selectWishlistItems)
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleToggleFilters = () => {
    dispatch(toggleFilters())
  }

  const settings = [
    { name: "Home", to: "/" },
    { name: "Profile", to: loggedInUser?.isAdmin ? "/admin/profile" : "/profile" },
    { name: loggedInUser?.isAdmin ? "Orders" : "My orders", to: loggedInUser?.isAdmin ? "/admin/orders" : "/orders" },
    { name: "Logout", to: "/logout" },
  ]

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: sageGreenPalette.lighter,
        borderBottom: `1px solid ${alpha(sageGreenPalette.main, 0.15)}`,
        color: "#2D3748",
      }}
    >
      <Toolbar
        sx={{
          p: { xs: 1.5, md: 2 },
          height: "4.25rem",
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1400px",
          mx: "auto",
          width: "100%",
        }}
      >
        {/* Logo Section */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <StorefrontRoundedIcon
            sx={{
              color: sageGreenPalette.dark,
              fontSize: "1.75rem",
            }}
          />
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              fontWeight: 600,
              color: sageGreenPalette.dark,
              textDecoration: "none",
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              letterSpacing: "-0.01em",
            }}
          >
            SellSphere
          </Typography>
        </Stack>

        {/* User Section */}
        <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2.5, md: 3 }}>
          {/* User Avatar and Menu */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Tooltip title="Account settings" arrow>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0,
                  "&:hover": {
                    transform: "translateY(-1px)",
                  },
                  transition: "transform 0.2s ease",
                }}
              >
                <Avatar
                  alt={userInfo?.name}
                  src="null"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: sageGreenPalette.main,
                    color: sageGreenPalette.contrastText,
                    fontWeight: "bold",
                    border: `2px solid ${sageGreenPalette.contrastText}`,
                    boxShadow: `0 1px 4px ${alpha(sageGreenPalette.dark, 0.2)}`,
                  }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  borderRadius: "10px",
                  boxShadow: `0 4px 20px ${alpha("#000000", 0.08)}`,
                  border: `1px solid ${alpha(sageGreenPalette.main, 0.1)}`,
                  overflow: "hidden",
                  padding: "6px",
                  minWidth: "180px",
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {loggedInUser?.isAdmin && (
                <MenuItem
                  onClick={handleCloseUserMenu}
                  sx={{
                    borderRadius: "6px",
                    mb: 0.5,
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(sageGreenPalette.main, 0.08),
                    },
                  }}
                >
                  <Typography
                    component={Link}
                    color={"text.primary"}
                    sx={{
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      width: "100%",
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                    to="/admin/add-product"
                    textAlign="left"
                  >
                    Add new Product
                  </Typography>
                </MenuItem>
              )}

              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={handleCloseUserMenu}
                  sx={{
                    borderRadius: "6px",
                    mb: 0.5,
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(sageGreenPalette.main, 0.08),
                    },
                  }}
                >
                  <Typography
                    component={Link}
                    color={"text.primary"}
                    sx={{
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      width: "100%",
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                    to={setting.to}
                    textAlign="left"
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>

            <Typography
              variant="body1"
              sx={{
                color: "#4A5568",
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                display: { xs: is480 ? "none" : "block", sm: "block" },
              }}
            >
              {is480 ? `${userInfo?.name?.toString().split(" ")[0]}` : `Hey👋, ${userInfo?.name}`}
            </Typography>
          </Stack>

          {/* Admin Badge */}
          {loggedInUser?.isAdmin && (
            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: sageGreenPalette.main,
                color: sageGreenPalette.contrastText,
                fontWeight: 600,
                borderRadius: "6px",
                textTransform: "none",
                padding: "4px 12px",
                fontSize: "0.85rem",
                letterSpacing: "0.01em",
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                boxShadow: `0 1px 3px ${alpha(sageGreenPalette.dark, 0.2)}`,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: sageGreenPalette.dark,
                  boxShadow: `0 2px 5px ${alpha(sageGreenPalette.dark, 0.25)}`,
                  transform: "translateY(-1px)",
                },
              }}
            >
              Admin
            </Button>
          )}

          {/* Icons Section */}
          <Stack direction="row" spacing={{ xs: 0.75, sm: 1.5 }} alignItems="center">
            {/* Cart Icon */}
            {cartItems?.length > 0 && (
              <Badge
                badgeContent={cartItems.length}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#E53E3E",
                    fontWeight: "bold",
                    minWidth: "18px",
                    height: "18px",
                    fontSize: "0.7rem",
                  },
                }}
              >
                <IconButton
                  onClick={() => navigate("/cart")}
                  sx={{
                    color: sageGreenPalette.dark,
                    transition: "all 0.2s ease",
                    padding: "8px",
                    "&:hover": {
                      backgroundColor: alpha(sageGreenPalette.main, 0.1),
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: "1.3rem" }} />
                </IconButton>
              </Badge>
            )}

            {/* Wishlist Icon */}
            {!loggedInUser?.isAdmin && (
              <Badge
                badgeContent={wishlistItems?.length}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#E53E3E",
                    fontWeight: "bold",
                    minWidth: "18px",
                    height: "18px",
                    fontSize: "0.7rem",
                  },
                }}
              >
                <IconButton
                  component={Link}
                  to={"/wishlist"}
                  sx={{
                    color: sageGreenPalette.dark,
                    transition: "all 0.2s ease",
                    padding: "8px",
                    "&:hover": {
                      backgroundColor: alpha(sageGreenPalette.main, 0.1),
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: "1.3rem" }} />
                </IconButton>
              </Badge>
            )}

            {/* Filter Icon */}
            {isProductList && (
              <IconButton
                onClick={handleToggleFilters}
                sx={{
                  color: isProductFilterOpen ? sageGreenPalette.dark : "#718096",
                  transition: "all 0.2s ease",
                  padding: "8px",
                  backgroundColor: isProductFilterOpen ? alpha(sageGreenPalette.main, 0.1) : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(sageGreenPalette.main, 0.1),
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <TuneIcon sx={{ fontSize: "1.3rem" }} />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
