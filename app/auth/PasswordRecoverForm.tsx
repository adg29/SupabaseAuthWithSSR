'use client';
import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormLabel,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import ForgotPassword from './ForgotPassword';
import { useRouter } from 'next/navigation';
import Message from './messages';
import { useFormStatus } from 'react-dom';
import { resetPassword } from '../redirect/auth-password-update/action';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

export default function PasswordRecoverForm() {
  const [email, setEmail] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('rememberedEmail') || ''
      : ''
  );
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(
    typeof window !== 'undefined' && !!localStorage.getItem('rememberedEmail')
  );
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = useCallback(() => {
    let isValid = true;
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!password.trim()) {
      setPasswordError(true);
      setPasswordErrorMessage('Error in password');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    return isValid;
  }, [email, password]);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const validatePassword = (password: string) => {
    console.log('password', password);
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };
    console.log('requirements', requirements);
    setPasswordRequirements(requirements);
  };

  //   const handleSubmit = async (formData: FormData) => {
  //     console.log('formData', formData, formData.get('email'));
  //     if (validateInputs()) {
  //       await login(formData);
  //       if (rememberMe) {
  //         localStorage.setItem('rememberedEmail', email);
  //       } else {
  //         localStorage.removeItem('rememberedEmail');
  //       }
  //     }
  //   };

  const handleSubmit = async (formData: FormData) => {
    // Check if the passwords match
    console.log(
      'formData',
      JSON.stringify(formData),
      JSON.stringify(formData.get('newPassword'))
    );
    if (newPassword !== confirmPassword) {
      alert('Passwords must match.');
      return;
    }
    await resetPassword(formData);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: { xs: '100%', sm: '450px' },
        p: { xs: 2, sm: 3 },
        gap: 1,
        boxShadow:
          'rgba(0, 0, 0, 0.05) 0px 5px 15px 0px, rgba(25, 28, 33, 0.05) 0px 15px 35px -5px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign In
      </Typography>
      <Box
        component="form"
        action={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 1
        }}
      >
        <FormControl>
          <FormLabel htmlFor="newPassword">Password</FormLabel>
          <TextField
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            autoComplete="new-password"
            variant="outlined"
            margin="normal"
            fullWidth
            InputProps={{
              startAdornment: <LockOutlinedIcon />
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="newPassword">Password</FormLabel>
          <TextField
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            variant="outlined"
            margin="normal"
            fullWidth
            InputProps={{
              startAdornment: <LockOutlinedIcon />
            }}
          />
        </FormControl>
        <SubmitButton />
        <Message />
      </Box>
      <Divider>or</Divider>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        type="submit"
        variant="contained"
        disabled={pending}
        sx={{ width: '200px' }} // Adjust the width as needed
      >
        {pending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Update Password'
        )}
      </Button>
    </Box>
  );
}
