"use client"

import {
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Box,
  Drawer,
  Divider,
  Button,
  Chip,
  styled,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchProductsAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  toggleFilters,
} from "../ProductSlice"
import { ProductCard } from "./ProductCard"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import { selectBrands } from "../../brands/BrandSlice"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import { selectCategories } from "../../categories/CategoriesSlice"
import Pagination from "@mui/material/Pagination"
import { ITEMS_PER_PAGE } from "../../../constants"
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice"
import { selectLoggedInUser } from "../../auth/AuthSlice"
import { toast } from "react-toastify"
import { banner1, banner2, banner3, banner4, loadingAnimation } from "../../../assets"
import { resetCartItemAddStatus, selectCartItemAddStatus } from "../../cart/CartSlice"
import { motion, AnimatePresence } from "framer-motion"
import { ProductBanner } from "./ProductBanner"
import ClearIcon from "@mui/icons-material/Clear"
import Lottie from "lottie-react"
import { alpha } from "@mui/material/styles"
import FilterListIcon from "@mui/icons-material/FilterList"
import SortIcon from "@mui/icons-material/Sort"
import RemoveIcon from "@mui/icons-material/Remove"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

// Refined sage green palette
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

// Styled components
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: "transparent",
  border: `1px solid ${alpha(sageGreenPalette.main, 0.15)}`,
  borderRadius: "10px",
  marginBottom: theme.spacing(2),
  boxShadow: "none",
  "&::before": {
    display: "none",
  },
  "& .MuiAccordionSummary-root": {
    backgroundColor: alpha(sageGreenPalette.main, 0.05),
    borderRadius: "10px",
    "&.Mui-expanded": {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
}))

const CategoryButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  textTransform: "none",
  fontWeight: 500,
  color: "#4A5568",
  padding: theme.spacing(1, 2),
  borderRadius: "8px",
  transition: "all 0.2s ease",
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  "&:hover": {
    backgroundColor: alpha(sageGreenPalette.main, 0.1),
    color: sageGreenPalette.dark,
    transform: "translateX(4px)",
  },
}))

const SortButton = styled(Button)(({ theme }) => ({
  backgroundColor: alpha(sageGreenPalette.main, 0.05),
  color: sageGreenPalette.dark,
  borderRadius: "30px",
  padding: theme.spacing(1, 2.5),
  textTransform: "none",
  fontWeight: 600,
  border: `1px solid ${alpha(sageGreenPalette.main, 0.15)}`,
  "&:hover": {
    backgroundColor: alpha(sageGreenPalette.main, 0.1),
  },
}))

const PaginationContainer = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  backgroundColor: sageGreenPalette.lightest,
  border: `1px solid ${alpha(sageGreenPalette.main, 0.1)}`,
  padding: theme.spacing(3),
  boxShadow: `0 4px 20px ${alpha(sageGreenPalette.dark, 0.05)}`,
}))

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
]

const bannerImages = [banner1, banner3, banner2, banner4]

export const ProductList = () => {
  // Initialize filters with empty arrays for brand and category
  const [filters, setFilters] = useState({ brand: [], category: [] })
  const [tempFilters, setTempFilters] = useState({ brand: [], category: [] })
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState(null)
  const theme = useTheme()

  const is1200 = useMediaQuery(theme.breakpoints.down(1200))
  const is800 = useMediaQuery(theme.breakpoints.down(800))
  const is700 = useMediaQuery(theme.breakpoints.down(700))
  const is600 = useMediaQuery(theme.breakpoints.down(600))
  const is500 = useMediaQuery(theme.breakpoints.down(500))
  const is488 = useMediaQuery(theme.breakpoints.down(488))

  const brands = useSelector(selectBrands)
  const categories = useSelector(selectCategories)
  const products = useSelector(selectProducts)
  const totalResults = useSelector(selectProductTotalResults)
  const loggedInUser = useSelector(selectLoggedInUser)

  const productFetchStatus = useSelector(selectProductFetchStatus)

  const wishlistItems = useSelector(selectWishlistItems)
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)

  const cartItemAddStatus = useSelector(selectCartItemAddStatus)

  const isProductFilterOpen = useSelector(selectProductIsFilterOpen)

  const dispatch = useDispatch()

  // When the filter drawer opens, initialize tempFilters with current filters
  useEffect(() => {
    if (isProductFilterOpen) {
      setTempFilters({ ...filters })
    }
  }, [isProductFilterOpen])

  const handleBrandFilters = (e) => {
    const brandId = e.target.value
    const isChecked = e.target.checked

    setTempFilters((prev) => {
      // Create a copy of the current brand array
      const updatedBrands = [...prev.brand]

      if (isChecked) {
        // Add the brand if it's not already in the array
        if (!updatedBrands.includes(brandId)) {
          updatedBrands.push(brandId)
        }
      } else {
        // Remove the brand if it exists in the array
        const index = updatedBrands.indexOf(brandId)
        if (index !== -1) {
          updatedBrands.splice(index, 1)
        }
      }

      return { ...prev, brand: updatedBrands }
    })
  }

  const handleCategoryFilters = (e) => {
    const categoryId = e.target.value
    const isChecked = e.target.checked

    setTempFilters((prev) => {
      // Create a copy of the current category array
      const updatedCategories = [...prev.category]

      if (isChecked) {
        // Add the category if it's not already in the array
        if (!updatedCategories.includes(categoryId)) {
          updatedCategories.push(categoryId)
        }
      } else {
        // Remove the category if it exists in the array
        const index = updatedCategories.indexOf(categoryId)
        if (index !== -1) {
          updatedCategories.splice(index, 1)
        }
      }

      return { ...prev, category: updatedCategories }
    })
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    })
  }, [])

  useEffect(() => {
    setPage(1)
  }, [totalResults])

  useEffect(() => {
    const finalFilters = { ...filters }

    finalFilters["pagination"] = { page: page, limit: ITEMS_PER_PAGE }
    finalFilters["sort"] = sort

    if (!loggedInUser?.isAdmin) {
      finalFilters["user"] = true
    }

    dispatch(fetchProductsAsync(finalFilters))
  }, [filters, page, sort, dispatch, loggedInUser])

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: productId }
      dispatch(createWishlistItemAsync(data))
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex((item) => item.product._id === productId)
      if (index !== -1) {
        dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id))
      }
    }
  }

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled") {
      toast.success("Product added to wishlist")
    } else if (wishlistItemAddStatus === "rejected") {
      toast.error("Error adding product to wishlist, please try again later")
    }
  }, [wishlistItemAddStatus])

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled") {
      toast.success("Product removed from wishlist")
    } else if (wishlistItemDeleteStatus === "rejected") {
      toast.error("Error removing product from wishlist, please try again later")
    }
  }, [wishlistItemDeleteStatus])

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart")
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later")
    }
  }, [cartItemAddStatus])

  useEffect(() => {
    if (productFetchStatus === "rejected") {
      toast.error("Error fetching products, please try again later")
    }
  }, [productFetchStatus])

  useEffect(() => {
    return () => {
      dispatch(resetProductFetchStatus())
      dispatch(resetWishlistItemAddStatus())
      dispatch(resetWishlistItemDeleteStatus())
      dispatch(resetCartItemAddStatus())
    }
  }, [dispatch])

  const handleFilterClose = () => {
    dispatch(toggleFilters())
  }

  const handleOpenFilters = () => {
    dispatch(toggleFilters())
  }

  // Apply filters and close drawer
  const handleApplyFilters = () => {
    setFilters(tempFilters)
    handleFilterClose()
  }

  // Reset temp filters to current filters and close drawer
  const handleCancelFilters = () => {
    setTempFilters({ ...filters })
    handleFilterClose()
  }

  // Reset all filters
  const handleResetFilters = () => {
    setTempFilters({ brand: [], category: [] })
  }

  // Calculate active filters count
  const activeFiltersCount = filters.brand.length + filters.category.length

  // Check if a brand is selected in tempFilters
  const isBrandSelected = (brandId) => {
    return tempFilters.brand.includes(brandId)
  }

  // Check if a category is selected in tempFilters
  const isCategorySelected = (categoryId) => {
    return tempFilters.category.includes(categoryId)
  }

  return (
    <Box sx={{ maxWidth: "1600px", mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}>
      {productFetchStatus === "pending" ? (
        <Stack
          width={is500 ? "35vh" : "25rem"}
          height={"calc(100vh - 4rem)"}
          justifyContent={"center"}
          marginRight={"auto"}
          marginLeft={"auto"}
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <>
          {/* Filters sidebar as a drawer */}
          <Drawer
            anchor="left"
            open={isProductFilterOpen}
            onClose={handleFilterClose}
            PaperProps={{
              sx: {
                width: is500 ? "100%" : "350px",
                padding: 0,
                backgroundColor: sageGreenPalette.lightest,
              },
            }}
          >
            <Box sx={{ p: 3, height: "100%", overflowY: "auto" }}>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: sageGreenPalette.dark,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Filters
                </Typography>

                <IconButton
                  onClick={handleFilterClose}
                  sx={{
                    color: sageGreenPalette.dark,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(sageGreenPalette.main, 0.1),
                    },
                  }}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <ClearIcon />
                  </motion.div>
                </IconButton>
              </Box>

              <Divider sx={{ mb: 3, borderColor: alpha(sageGreenPalette.main, 0.1) }} />

              {/* Categories */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: sageGreenPalette.dark,
                  mb: 2,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                Categories
              </Typography>

              <Stack spacing={1} mb={4}>
                <CategoryButton startIcon={<KeyboardArrowRightIcon />}>Totes</CategoryButton>
                <CategoryButton startIcon={<KeyboardArrowRightIcon />}>Backpacks</CategoryButton>
                <CategoryButton startIcon={<KeyboardArrowRightIcon />}>Travel Bags</CategoryButton>
                <CategoryButton startIcon={<KeyboardArrowRightIcon />}>Hip Bags</CategoryButton>
                <CategoryButton startIcon={<KeyboardArrowRightIcon />}>Laptop Sleeves</CategoryButton>
              </Stack>

              {/* Brand filters */}
              <StyledAccordion defaultExpanded>
                <AccordionSummary
                  expandIcon={
                    <RemoveIcon
                      sx={{
                        color: sageGreenPalette.dark,
                        fontSize: "1.2rem",
                      }}
                    />
                  }
                  aria-controls="brand-filters"
                  id="brand-filters"
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: sageGreenPalette.dark,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Brands
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 2 }}>
                  <FormGroup onChange={handleBrandFilters}>
                    {brands?.map((brand) => (
                      <motion.div
                        key={brand._id}
                        style={{ width: "fit-content" }}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FormControlLabel
                          sx={{
                            ml: 1,
                            mb: 1.5,
                            "& .MuiTypography-root": {
                              fontSize: "0.95rem",
                              color: "#4A5568",
                              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            },
                          }}
                          control={
                            <Checkbox
                              checked={isBrandSelected(brand._id)}
                              sx={{
                                color: alpha(sageGreenPalette.main, 0.6),
                                "&.Mui-checked": {
                                  color: sageGreenPalette.main,
                                },
                              }}
                            />
                          }
                          label={brand.name}
                          value={brand._id}
                        />
                      </motion.div>
                    ))}
                  </FormGroup>
                </AccordionDetails>
              </StyledAccordion>

              {/* Category filters */}
              <StyledAccordion defaultExpanded>
                <AccordionSummary
                  expandIcon={
                    <RemoveIcon
                      sx={{
                        color: sageGreenPalette.dark,
                        fontSize: "1.2rem",
                      }}
                    />
                  }
                  aria-controls="category-filters"
                  id="category-filters"
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: sageGreenPalette.dark,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Category
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 2 }}>
                  <FormGroup onChange={handleCategoryFilters}>
                    {categories?.map((category) => (
                      <motion.div
                        key={category._id}
                        style={{ width: "fit-content" }}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FormControlLabel
                          sx={{
                            ml: 1,
                            mb: 1.5,
                            "& .MuiTypography-root": {
                              fontSize: "0.95rem",
                              color: "#4A5568",
                              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            },
                          }}
                          control={
                            <Checkbox
                              checked={isCategorySelected(category._id)}
                              sx={{
                                color: alpha(sageGreenPalette.main, 0.6),
                                "&.Mui-checked": {
                                  color: sageGreenPalette.main,
                                },
                              }}
                            />
                          }
                          label={category.name}
                          value={category._id}
                        />
                      </motion.div>
                    ))}
                  </FormGroup>
                </AccordionDetails>
              </StyledAccordion>

              {/* Filter actions */}
              <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: alpha(sageGreenPalette.main, 0.3),
                    color: sageGreenPalette.dark,
                    "&:hover": {
                      borderColor: sageGreenPalette.main,
                      backgroundColor: alpha(sageGreenPalette.main, 0.05),
                    },
                  }}
                  onClick={handleCancelFilters}
                >
                  Cancel
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    borderColor: alpha(sageGreenPalette.main, 0.3),
                    color: sageGreenPalette.dark,
                    "&:hover": {
                      borderColor: sageGreenPalette.main,
                      backgroundColor: alpha(sageGreenPalette.main, 0.05),
                    },
                  }}
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: sageGreenPalette.dark,
                    color: sageGreenPalette.contrastText,
                    "&:hover": {
                      backgroundColor: sageGreenPalette.darker,
                    },
                  }}
                  onClick={handleApplyFilters}
                >
                  Apply
                </Button>
              </Box>
            </Box>
          </Drawer>

          <Stack spacing={5}>
            {/* Banners section */}
            {!is600 && (
              <Box
                sx={{
                  width: "100%",
                  height: is800 ? "300px" : is1200 ? "400px" : "500px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: `0 4px 20px ${alpha(sageGreenPalette.dark, 0.1)}`,
                }}
              >
                <ProductBanner images={bannerImages} />
              </Box>
            )}

            {/* Products section */}
            <Stack spacing={4}>
              {/* Filters and sort bar */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {/* Filter button */}
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={handleOpenFilters}
                  sx={{
                    borderColor: alpha(sageGreenPalette.main, 0.3),
                    color: sageGreenPalette.dark,
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    "&:hover": {
                      borderColor: sageGreenPalette.main,
                      backgroundColor: alpha(sageGreenPalette.main, 0.05),
                    },
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Filters
                  {activeFiltersCount > 0 && (
                    <Chip
                      size="small"
                      label={activeFiltersCount}
                      sx={{
                        ml: 1,
                        backgroundColor: sageGreenPalette.main,
                        color: "white",
                        height: "20px",
                        minWidth: "20px",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Button>

                {/* Sort dropdown */}
                <Box sx={{ position: "relative" }}>
                  <FormControl sx={{ minWidth: 180 }}>
                    <Select
                      value={sort || ""}
                      onChange={(e) => setSort(e.target.value)}
                      displayEmpty
                      variant="outlined"
                      sx={{
                        borderRadius: "30px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(sageGreenPalette.main, 0.3),
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: sageGreenPalette.main,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: sageGreenPalette.main,
                        },
                        "& .MuiSelect-select": {
                          paddingLeft: 2.5,
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 600,
                          color: sageGreenPalette.dark,
                        },
                      }}
                      startAdornment={<SortIcon sx={{ ml: 1, mr: 1, color: sageGreenPalette.dark }} />}
                      inputProps={{ "aria-label": "Sort" }}
                    >
                      <MenuItem value="">
                        <em>Sort by</em>
                      </MenuItem>
                      {sortOptions.map((option) => (
                        <MenuItem key={option.name} value={option}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Results count */}
              <Typography
                sx={{
                  color: "#4A5568",
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                }}
              >
                Showing {totalResults} products
              </Typography>

              {/* Product grid */}
              <AnimatePresence>
                <Grid
                  container
                  spacing={3}
                  justifyContent={"flex-start"}
                  alignContent={"center"}
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {products.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ProductCard
                          id={product._id}
                          title={product.title}
                          thumbnail={product.thumbnail}
                          brand={product.brand.name}
                          price={product.price}
                          stockQuantity={product.stockQuantity}
                          handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </AnimatePresence>

              {/* Pagination */}
              <PaginationContainer elevation={0}>
                <Stack spacing={2} alignItems="center">
                  <Pagination
                    size={is488 ? "medium" : "large"}
                    page={page}
                    onChange={(e, page) => setPage(page)}
                    count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: sageGreenPalette.dark,
                        borderColor: alpha(sageGreenPalette.main, 0.3),
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        "&.Mui-selected": {
                          backgroundColor: sageGreenPalette.main,
                          color: "white",
                          borderColor: sageGreenPalette.main,
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: sageGreenPalette.dark,
                          },
                        },
                        "&:hover": {
                          backgroundColor: alpha(sageGreenPalette.main, 0.05),
                        },
                      },
                    }}
                  />
                  <Typography
                    textAlign={"center"}
                    sx={{
                      color: "#4A5568",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE} of {totalResults}{" "}
                    results
                  </Typography>
                </Stack>
              </PaginationContainer>
            </Stack>
          </Stack>
        </>
      )}
    </Box>
  )
}
