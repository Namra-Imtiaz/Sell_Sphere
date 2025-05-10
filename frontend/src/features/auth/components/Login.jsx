import {
  Box,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab'
import {
  selectLoggedInUser,
  loginAsync,
  selectLoginStatus,
  selectLoginError,
  clearLoginError,
  resetLoginStatus
} from '../AuthSlice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'

const sageGreenPalette = {
  light: '#8DAA9D',
  main: '#5F7161',
  dark: '#4A584C',
  contrastText: '#ffffff',
  background: '#F4F9F4',
  accent: '#A7C4BC',
}

export const Login = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectLoginStatus)
  const error = useSelector(selectLoginError)
  const loggedInUser = useSelector(selectLoggedInUser)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const theme = useTheme()
  const is900 = useMediaQuery(theme.breakpoints.down(900))
  const is480 = useMediaQuery(theme.breakpoints.down(480))
  const [showPassword, setShowPassword] = useState(false)

  const allowedAdminEmail = "admin@gmail.com"

  // Navigate after login if verified
  useEffect(() => {
    if (loggedInUser?.isVerified) {
      if (loggedInUser.role === "admin" && loggedInUser.email === allowedAdminEmail) {
        navigate("../features/admin/components/AdminDashBoard")
      } else {
        navigate("/")
      }
    }
  }, [loggedInUser, navigate])
  

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  // Show success toast
  useEffect(() => {
    if (status === 'fulfilled' && loggedInUser?.isVerified) {
      toast.success("Login successful")
      reset()
    }

    return () => {
      dispatch(clearLoginError())
      dispatch(resetLoginStatus())
    }
  }, [status, dispatch, loggedInUser, reset])

  const handleLogin = (data) => {
    const { email, password, role } = data

    // Block login if admin role but wrong email
    if (role === "admin" && email !== allowedAdminEmail) {
      toast.error("Unauthorized admin email")
      return
    }

    dispatch(loginAsync({ email, password, role }))
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: `linear-gradient(135deg, ${sageGreenPalette.background} 0%, ${sageGreenPalette.light} 100%)`,
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: is900 ? 'column' : 'row',
            minHeight: '80vh',
            boxShadow: '0 8px 32px rgba(95, 113, 97, 0.2)'
          }}
        >
          {!is900 && (
            <Box
              sx={{
                flex: 1,
                bgcolor: sageGreenPalette.main,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  zIndex: 1,
                  textAlign: 'center',
                  color: '#fff'
                }}
              >
                <Typography variant="h3" fontWeight={600} gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '80%', mx: 'auto', mb: 4 }}>
                  Sign in to continue your shopping journey with SellSphere
                </Typography>
              </Box>
              <Box sx={{
                position: 'absolute',
                top: '-5%',
                left: '-5%',
                width: '20rem',
                height: '20rem',
                borderRadius: '50%',
                backgroundColor: sageGreenPalette.light,
                opacity: 0.3
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: '-10%',
                right: '-5%',
                width: '15rem',
                height: '15rem',
                borderRadius: '50%',
                backgroundColor: sageGreenPalette.accent,
                opacity: 0.3
              }} />
            </Box>
          )}

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              bgcolor: '#fff'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant='h3'
                fontWeight={600}
                color={sageGreenPalette.dark}
                sx={{
                  wordBreak: "break-word",
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                SellSphere
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '4px',
                    backgroundColor: sageGreenPalette.accent,
                    borderRadius: '2px'
                  }}
                />
              </Typography>
              <Typography
                color="text.secondary"
                variant='body2'
                sx={{ mt: 1 }}
              >
                - Where Crafts Spark Business, and Passion Becomes Profit.
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleLogin)}
              sx={{
                width: '100%',
                maxWidth: is480 ? '95vw' : '28rem',
                px: 2
              }}
            >
              {/* Email */}
              <motion.div whileHover={{ y: -5 }} style={{ marginBottom: '1rem' }}>
                <TextField
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: "Enter a valid email"
                    }
                  })}
                  placeholder='Email'
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: sageGreenPalette.main }} />
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.email && <FormHelperText sx={{ mt: 1 }} error>{errors.email.message}</FormHelperText>}
              </motion.div>

              {/* Password */}
              <motion.div whileHover={{ y: -5 }} style={{ marginBottom: '1rem' }}>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  {...register("password", { required: "Password is required" })}
                  placeholder='Password'
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: sageGreenPalette.main }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ?
                            <VisibilityOff sx={{ color: sageGreenPalette.main }} /> :
                            <Visibility sx={{ color: sageGreenPalette.main }} />
                          }
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                {errors.password && <FormHelperText sx={{ mt: 1 }} error>{errors.password.message}</FormHelperText>}
              </motion.div>

              {/* Role Selection */}
              <motion.div whileHover={{ y: -5 }} style={{ marginBottom: '1.5rem' }}>
                <TextField
                  select
                  fullWidth
                  defaultValue="user"
                  {...register("role", { required: "Role is required" })}
                  label="Login As"
                  SelectProps={{ native: true }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </TextField>
                {errors.role && <FormHelperText error>{errors.role.message}</FormHelperText>}
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <LoadingButton
                  fullWidth
                  sx={{
                    height: '3rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    bgcolor: sageGreenPalette.main,
                    '&:hover': {
                      bgcolor: sageGreenPalette.dark,
                    }
                  }}
                  loading={status === 'pending'}
                  type='submit'
                  variant='contained'
                >
                  Sign In
                </LoadingButton>
              </motion.div>

              <Stack
                direction={is480 ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={is480 ? 'center' : 'center'}
                spacing={is480 ? 2 : 0}
                sx={{ mt: 3 }}
              >
                <motion.div whileHover={{ x: 2 }}>
                  <Typography
                    component={Link}
                    to='/forgot-password'
                    sx={{
                      textDecoration: "none",
                      color: sageGreenPalette.main,
                      '&:hover': {
                        color: sageGreenPalette.dark,
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Forgot password?
                  </Typography>
                </motion.div>

                <motion.div whileHover={{ x: 2 }}>
                  <Typography
                    component={Link}
                    to='/signup'
                    sx={{
                      textDecoration: "none",
                      color: "text.primary"
                    }}
                  >
                    Don't have an account? <span style={{ color: sageGreenPalette.dark, fontWeight: 600 }}>Register</span>
                  </Typography>
                </motion.div>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
