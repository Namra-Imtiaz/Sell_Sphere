import { Avatar, Button, Paper, Stack, Typography, useTheme, TextField, useMediaQuery, Box, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo } from '../UserSlice'
import { addAddressAsync, resetAddressAddStatus, resetAddressDeleteStatus, resetAddressUpdateStatus, selectAddressAddStatus, selectAddressDeleteStatus, selectAddressErrors, selectAddressStatus, selectAddressUpdateStatus, selectAddresses } from '../../address/AddressSlice'
import { Address } from '../../address/components/Address'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import HomeIcon from '@mui/icons-material/Home';

export const UserProfile = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
    const status = useSelector(selectAddressStatus)
    const userInfo = useSelector(selectUserInfo)
    const addresses = useSelector(selectAddresses)
    const theme = useTheme()
    const [addAddress, setAddAddress] = useState(false)

    // Custom sage green color palette
    const sageGreen = {
        light: '#E8F1E8',
        main: '#8BAF8B',
        dark: '#5A775A',
        contrastText: '#FFFFFF'
    }

    const addressAddStatus = useSelector(selectAddressAddStatus)
    const addressUpdateStatus = useSelector(selectAddressUpdateStatus)
    const addressDeleteStatus = useSelector(selectAddressDeleteStatus)

    const is900 = useMediaQuery(theme.breakpoints.down(900))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (addressAddStatus === 'fulfilled') {
            toast.success("Address added")
        }
        else if (addressAddStatus === 'rejected') {
            toast.error("Error adding address, please try again later")
        }
    }, [addressAddStatus])

    useEffect(() => {
        if (addressUpdateStatus === 'fulfilled') {
            toast.success("Address updated")
        }
        else if (addressUpdateStatus === 'rejected') {
            toast.error("Error updating address, please try again later")
        }
    }, [addressUpdateStatus])

    useEffect(() => {
        if (addressDeleteStatus === 'fulfilled') {
            toast.success("Address deleted")
        }
        else if (addressDeleteStatus === 'rejected') {
            toast.error("Error deleting address, please try again later")
        }
    }, [addressDeleteStatus])

    useEffect(() => {
        return () => {
            dispatch(resetAddressAddStatus())
            dispatch(resetAddressUpdateStatus())
            dispatch(resetAddressDeleteStatus())
        }
    }, [])

    const handleAddAddress = (data) => {
        const address = { ...data, user: userInfo._id }
        dispatch(addAddressAsync(address))
        setAddAddress(false)
        reset()
    }

    return (
        <Box 
            sx={{
                backgroundColor: sageGreen.light,
                minHeight: 'calc(100vh - 4rem)',
                padding: is480 ? 1 : 3,
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Stack 
                component={Paper} 
                elevation={2} 
                width={is900 ? '100%' : "50rem"} 
                p={is480 ? 2 : 3} 
                mt={is480 ? 0 : 2} 
                borderRadius={2}
                sx={{
                    boxShadow: '0 4px 20px rgba(138, 175, 139, 0.15)'
                }}
            >
                {/* User details section */}
                <Stack 
                    bgcolor={sageGreen.light} 
                    p={3} 
                    mb={3}
                    rowGap={2} 
                    borderRadius={2} 
                    justifyContent={'center'} 
                    alignItems={'center'}
                    sx={{
                        border: `1px solid ${sageGreen.main}`,
                    }}
                >
                    <Avatar 
                        src='none' 
                        alt={userInfo?.name} 
                        sx={{
                            width: 90,
                            height: 90,
                            bgcolor: sageGreen.main,
                            border: `2px solid ${sageGreen.dark}`,
                            fontSize: '2rem',
                            boxShadow: '0 3px 8px rgba(90, 119, 90, 0.2)'
                        }}
                    >
                        {userInfo?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box textAlign="center">
                        <Typography variant='h5' fontWeight={500} color={sageGreen.dark}>{userInfo?.name}</Typography>
                        <Typography variant='body1' color="text.secondary">{userInfo?.email}</Typography>
                    </Box>
                </Stack>

                <Divider sx={{ my: 2, borderColor: sageGreen.light }} />

                {/* Address section */}
                <Stack justifyContent={'center'} alignItems={'center'} rowGap={3}>
                    {/* Heading and add button */}
                    <Stack 
                        flexDirection={'row'} 
                        alignItems={'center'} 
                        justifyContent={'space-between'} 
                        width="100%"
                        pb={2}
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <HomeIcon sx={{ color: sageGreen.main }} />
                            <Typography variant='h6' fontWeight={500} color={sageGreen.dark}>
                                Manage Addresses
                            </Typography>
                        </Stack>
                        <Button 
                            onClick={() => setAddAddress(true)} 
                            size={is480 ? 'small' : 'medium'} 
                            variant='contained'
                            startIcon={<AddLocationAltIcon />}
                            sx={{
                                bgcolor: sageGreen.main,
                                '&:hover': {
                                    bgcolor: sageGreen.dark,
                                }
                            }}
                            disabled={addAddress}
                        >
                            Add New
                        </Button>
                    </Stack>
                    
                    {/* Add address form - state dependent */}
                    {addAddress && (
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                width: '100%', 
                                p: 3, 
                                borderRadius: 2,
                                border: `1px solid ${sageGreen.light}`,
                                mb: 2
                            }}
                        >
                            <Typography variant="h6" gutterBottom color={sageGreen.dark} sx={{ mb: 2 }}>
                                Add New Address
                            </Typography>
                            <Stack 
                                width={'100%'} 
                                component={'form'} 
                                noValidate 
                                onSubmit={handleSubmit(handleAddAddress)} 
                                rowGap={2}
                            >
                                <Stack direction={is480 ? "column" : "row"} spacing={2} sx={{ width: '100%' }}>
                                    <Stack flex={1}>
                                        <Typography variant="body2" gutterBottom>Type</Typography>
                                        <TextField 
                                            placeholder='Eg. Home, Business' 
                                            {...register("type", { required: true })}
                                            fullWidth
                                            size="small"
                                            error={errors.type}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: sageGreen.main,
                                                    },
                                                },
                                            }}
                                        />
                                    </Stack>
                                    <Stack flex={1}>
                                        <Typography variant="body2" gutterBottom>Phone Number</Typography>
                                        <TextField 
                                            type='number' 
                                            {...register("phoneNumber", { required: true })}
                                            fullWidth
                                            size="small"
                                            error={errors.phoneNumber}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: sageGreen.main,
                                                    },
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Stack>

                                <Stack>
                                    <Typography variant="body2" gutterBottom>Street</Typography>
                                    <TextField 
                                        {...register("street", { required: true })}
                                        fullWidth
                                        size="small"
                                        error={errors.street}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: sageGreen.main,
                                                },
                                            },
                                        }}
                                    />
                                </Stack>

                                <Stack direction={is480 ? "column" : "row"} spacing={2} sx={{ width: '100%' }}>
                                    <Stack flex={1}>
                                        <Typography variant="body2" gutterBottom>City</Typography>
                                        <TextField 
                                            {...register("city", { required: true })}
                                            fullWidth
                                            size="small"
                                            error={errors.city}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: sageGreen.main,
                                                    },
                                                },
                                            }}
                                        />
                                    </Stack>
                                    <Stack flex={1}>
                                        <Typography variant="body2" gutterBottom>State</Typography>
                                        <TextField 
                                            {...register("state", { required: true })}
                                            fullWidth
                                            size="small"
                                            error={errors.state}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: sageGreen.main,
                                                    },
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Stack>

                                <Stack direction={is480 ? "column" : "row"} spacing={2} sx={{ width: '100%' }}>
                                    <Stack flex={1}>
                                        <Typography variant="body2" gutterBottom>Postal Code</Typography>
                                        <TextField 
                                            type='number' 
                                            {...register("postalCode", { required: true })}
                                            fullWidth
                                            size="small"
                                            error={errors.postalCode}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: sageGreen.main,
                                                    },
                                                },
                                            }}
                                        />
                                    </Stack>
                                    <Stack flex={1}>
                                        <Typography variant="body2" gutterBottom>Country</Typography>
                                        <TextField 
                                            {...register("country", { required: true })}
                                            fullWidth
                                            size="small"
                                            error={errors.country}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: sageGreen.main,
                                                    },
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Stack>

                                <Stack 
                                    flexDirection={'row'} 
                                    alignSelf={'flex-end'} 
                                    columnGap={is480 ? 1 : 2}
                                    mt={1}
                                >
                                    <Button 
                                        color='error' 
                                        onClick={() => setAddAddress(false)} 
                                        variant="outlined" 
                                        size={is480 ? "small" : "medium"}
                                    >
                                        Cancel
                                    </Button>
                                    <LoadingButton 
                                        loading={status === 'pending'} 
                                        type='submit' 
                                        size={is480 ? "small" : "medium"} 
                                        variant='contained'
                                        sx={{
                                            bgcolor: sageGreen.main,
                                            '&:hover': {
                                                bgcolor: sageGreen.dark,
                                            }
                                        }}
                                    >
                                        Save Address
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </Paper>
                    )}

                    {/* Mapping on addresses here */}
                    <Stack width={'100%'} rowGap={2}>
                        {addresses.length > 0 ? (
                            addresses.map((address) => (
                                <Address 
                                    key={address._id} 
                                    id={address._id} 
                                    city={address.city} 
                                    country={address.country} 
                                    phoneNumber={address.phoneNumber} 
                                    postalCode={address.postalCode} 
                                    state={address.state} 
                                    street={address.street} 
                                    type={address.type}
                                    // Pass sage green theme colors to Address component
                                    themeColors={sageGreen}
                                />
                            ))
                        ) : (
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: 3, 
                                    textAlign: 'center',
                                    backgroundColor: sageGreen.light,
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant='body1' color="text.secondary">
                                    You have no saved addresses
                                </Typography>
                                <Typography variant='body2' color="text.secondary" sx={{ mt: 1 }}>
                                    Add an address to make checkout faster
                                </Typography>
                            </Paper>
                        )}      
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}