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
  signupAsync, 
  selectSignupStatus, 
  selectSignupError, 
  clearSignupError, 
  resetSignupStatus 
} from '../AuthSlice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material'

const sageGreenPalette = {
  light: '#8DAA9D',
  main: '#5F7161',
  dark: '#4A584C',
  contrastText: '#ffffff',
  background: '#F4F9F4',
  accent: '#A7C4BC',
}

export const Signup = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectSignupStatus)
  const error = useSelector(selectSignupError)
  const loggedInUser = useSelector(selectLoggedInUser)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const theme = useTheme()
  const is900 = useMediaQuery(theme.breakpoints.down(900))
  const is480 = useMediaQuery(theme.breakpoints.down(480))
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // handles user redirection
  useEffect(() => {
    if (loggedInUser && !loggedInUser?.isVerified) {
      navigate("/verify-otp")
    }
    else if (loggedInUser) {
      navigate("/")
    }
  }, [loggedInUser, navigate])

  // handles signup error and toast them
  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  // handles signup status and dispatches reset actions to relevant states in cleanup
  useEffect(() => {
    if (status === 'fullfilled') {
      toast.success("Welcome! Verify your email to start shopping on SellSphere.")
      reset()
    }
    return () => {
      dispatch(clearSignupError())
      dispatch(resetSignupStatus())
    }
  }, [status, dispatch, reset])

  // this function handles signup and dispatches the signup action with credentails that api requires
  const handleSignup = (data) => {
    const cred = { ...data }
    delete cred.confirmPassword
    dispatch(signupAsync(cred))
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
                  Join SellSphere
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '80%', mx: 'auto', mb: 4 }}>
                  Create an account to start your shopping journey with us
                </Typography>
                {/* <Box 
                  component="img" 
                  src="/api/placeholder/400/320" 
                  alt="Shopping" 
                  sx={{ 
                    width: '70%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }} 
                /> */}
              </Box>
              {/* Decorative circles */}
              <Box sx={{ 
                position: 'absolute', 
                top: '-5%', 
                left: '-5%', 
                width: '20rem', 
                height: '20rem', 
                borderRadius: '50%', 
                backgroundColor: sageGreenPalette.light,
                opacity: 0.3 
              }}/>
              <Box sx={{ 
                position: 'absolute', 
                bottom: '-10%', 
                right: '-5%', 
                width: '15rem', 
                height: '15rem', 
                borderRadius: '50%', 
                backgroundColor: sageGreenPalette.accent,
                opacity: 0.3 
              }}/>
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
            <Box sx={{ textAlign: 'center', mb: 3 }}>
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
              onSubmit={handleSubmit(handleSignup)}
              sx={{ 
                width: '100%', 
                maxWidth: is480 ? '95vw' : '28rem',
                px: 2
              }}
            >
              <motion.div whileHover={{ y: -5 }} style={{ marginBottom: '1rem' }}>
                <TextField 
                  fullWidth 
                  {...register("name", {required: "Username is required"})} 
                  placeholder='Username'
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: sageGreenPalette.main }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: sageGreenPalette.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: sageGreenPalette.main,
                      },
                    },
                  }}
                />
                {errors.name && <FormHelperText sx={{mb: 2}} error>{errors.name.message}</FormHelperText>}
              </motion.div>

              <motion.div whileHover={{ y: -5 }} style={{ marginBottom: '1rem' }}>
                <TextField 
                  fullWidth 
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: sageGreenPalette.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: sageGreenPalette.main,
                      },
                    },
                  }}
                />
                {errors.email && <FormHelperText sx={{mb: 2}} error>{errors.email.message}</FormHelperText>}
              </motion.div>

              <motion.div whileHover={{ y: -5 }} style={{ marginBottom: '1rem' }}>
                <TextField 
                  type={showPassword ? 'text' : 'password'} 
                  fullWidth 
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message: `At least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number. Can contain special characters`
                    }
                  })} 
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: sageGreenPalette.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: sageGreenPalette.main,
                      },
                    },
                  }}
                />
                {errors.password && <FormHelperText sx={{mb: 2}} error>{errors.password.message}</FormHelperText>}
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} style={{ marginBottom: '1.5rem' }}>
                <TextField 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  fullWidth 
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value, formValues) => value === formValues.password || "Passwords don't match"
                  })} 
                  placeholder='Confirm Password'
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
                          aria-label="toggle confirm password visibility"
                          onClick={toggleShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? 
                            <VisibilityOff sx={{ color: sageGreenPalette.main }} /> : 
                            <Visibility sx={{ color: sageGreenPalette.main }} />
                          }
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: sageGreenPalette.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: sageGreenPalette.main,
                      },
                    },
                  }}
                />
                {errors.confirmPassword && <FormHelperText sx={{mb: 2}} error>{errors.confirmPassword.message}</FormHelperText>}
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
                  Sign Up
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
                    to='/login' 
                    sx={{ 
                      textDecoration: "none", 
                      color: "text.primary"
                    }}
                  >
                    Already a member? <span style={{ color: sageGreenPalette.dark, fontWeight: 600 }}>Login</span>
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