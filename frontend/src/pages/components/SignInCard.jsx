import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useAuth } from '../../hooks/useAuth';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  gap: theme.spacing(1.5),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
    padding: theme.spacing(4),
    margin: theme.spacing(8),
    gap: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(2),
    minHeight: 'auto',
    maxWidth: '100%',
    borderRadius: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const [message, setMessage] = React.useState();
  const [username, setUsernaem] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loginEmail, setLoginEmail] = React.useState(''); // Separate email for login OTP
  const [otp, setOtp] = React.useState('');

  // OTP related states
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const [isResendDisabled, setIsResendDisabled] = React.useState(false);

  const [formState, setFormState] = React.useState(0); // 0 for signin and 1 for signup
  const [loginMethod, setLoginMethod] = React.useState('password'); // 'password' or 'otp'

  // Auth hook for backend integration
  const {
    loading,
    error,
    clearError,
    register,
    verifyEmail,
    resendEmailOTP,
    login,
    sendLoginOTP,
    loginWithOTP,
  } = useAuth();

  // Countdown timer effect
  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isResendDisabled]);

  // Handle OTP sending for signin (email-based)
  const handleSendLoginOtp = async () => {
    if (!loginEmail.trim()) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      return;
    }

    setEmailError(false);
    setEmailErrorMessage('');
    
    try {
      await sendLoginOTP(loginEmail);
      setOtpSent(true);
      setCountdown(60);
      setIsResendDisabled(true);
      setMessage('OTP sent to your email!');
      setOpenSnackbar(true);
    } catch (error) {
      setEmailError(true);
      setEmailErrorMessage(error.message || 'Failed to send OTP');
    }
  };

  // Handle resend OTP for signin
  const handleResendLoginOtp = () => {
    if (!isResendDisabled) {
      handleSendLoginOtp();
    }
  };

  // Handle initial signup with OTP (creates user and sends OTP)
  const handleInitialSignupWithOTP = async () => {
    // Validate all required fields for registration
    if (!name.trim()) {
      setEmailError(true);
      setEmailErrorMessage('Please enter your full name.');
      return;
    }
    
    if (!username.trim()) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid username.');
      return;
    }
    
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    
    if (!email.trim()) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      return;
    }

    setEmailError(false);
    setEmailErrorMessage('');
    setPasswordError(false);
    setPasswordErrorMessage('');
    
    try {
      // Register user which automatically sends OTP
      await register({ 
        name, 
        username, 
        password, 
        email 
      });
      setOtpSent(true);
      setCountdown(60);
      setIsResendDisabled(true);
      setMessage('Registration successful! OTP sent to your email.');
      setOpenSnackbar(true);
    } catch (error) {
      setEmailError(true);
      setEmailErrorMessage(error.message || 'Failed to register user');
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      setOpenSnackbar(true);
      return;
    }

    try {
      if (formState === 1) {
        // Signup email verification
        await verifyEmail(email, otp);
        setOtpVerified(true);
        setMessage('Email verified successfully!');
        setOpenSnackbar(true);
      } else if (formState === 0 && loginMethod === 'otp') {
        // Login with OTP
        await loginWithOTP(loginEmail, otp);
        setOtpVerified(true);
        setMessage('Login successful!');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setMessage(error.message || 'Invalid OTP. Please try again.');
      setOpenSnackbar(true);
    }
  };

  // Handle resend OTP for signup
  const handleResendOtp = async () => {
    if (!isResendDisabled && email.trim()) {
      try {
        await resendEmailOTP(email);
        setCountdown(60);
        setIsResendDisabled(true);
        setMessage('OTP sent successfully!');
        setOpenSnackbar(true);
      } catch (error) {
        setEmailError(true);
        setEmailErrorMessage(error.message || 'Failed to resend OTP');
      }
    }
  };

  let handleAuth = async () => {
    let isValid = true;
    clearError(); // Clear any previous errors

    // Validation for signin
    if (formState === 0) {
      if (loginMethod === 'password') {
        // For password login, check username and password
        if (!username.trim()) {
          setEmailError(true);
          setEmailErrorMessage('Please enter a valid username or email.');
          isValid = false;
        } else {
          setEmailError(false);
          setEmailErrorMessage('');
        }
        
        if (!password || password.length < 6) {
          setPasswordError(true);
          setPasswordErrorMessage('Password must be at least 6 characters long.');
          isValid = false;
        } else {
          setPasswordError(false);
          setPasswordErrorMessage('');
        }
      } else if (loginMethod === 'otp') {
        // For OTP login, check email and OTP verification
        if (!loginEmail.trim()) {
          setEmailError(true);
          setEmailErrorMessage('Please enter a valid email address.');
          isValid = false;
        } else {
          setEmailError(false);
          setEmailErrorMessage('');
        }
        
        if (!otpVerified) {
          setMessage('Please verify your email with OTP first.');
          setOpenSnackbar(true);
          isValid = false;
        }
      }
    }

    // Validation for signup
    if (formState === 1) {
      if (!name.trim()) {
        setEmailError(true);
        setEmailErrorMessage('Please enter your full name.');
        isValid = false;
      }
      
      if (!username.trim()) {
        setEmailError(true);
        setEmailErrorMessage('Please enter a valid username.');
        isValid = false;
      } else {
        setEmailError(false);
        setEmailErrorMessage('');
      }
      
      if (!password || password.length < 6) {
        setPasswordError(true);
        setPasswordErrorMessage('Password must be at least 6 characters long.');
        isValid = false;
      } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
      }
      
      if (!otpVerified) {
        setMessage('Please verify your email address first.');
        setOpenSnackbar(true);
        isValid = false;
      }
    }

    if (!isValid) return;

    try {
      if (formState === 0) {
        // Login
        if (loginMethod === 'password') {
          await login({ email: username, password });
          setMessage('Login successful!');
          setOpenSnackbar(true);
        }
        // OTP login is already handled in handleVerifyOtp
      } else if (formState === 1) {
        // For signup, user should already be registered when they verified email
        // Just show success message and switch to signin
        setMessage('Registration completed successfully! You can now sign in.');
        setOpenSnackbar(true);
        
        // Reset form and switch to signin
        setFormState(0);
        setPassword('');
        setName('');
        setUsernaem('');
        setEmail('');
        // Reset OTP states
        setOtpSent(false);
        setOtpVerified(false);
        setOtp('');
        setLoginMethod('password');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
      setOpenSnackbar(true);
      console.error('Authentication error:', error);
    }
  }
  

  const handleSnackClose = () => {
    setOpenSnackbar(false);
  }

  // const handleSubmit = (event) => {
  //   if (emailError || passwordError) {
  //     event.preventDefault();
  //     return;
  //   }
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ 
          width: '100%', 
          fontSize: { xs: 'clamp(1.5rem, 8vw, 2rem)', sm: 'clamp(2rem, 10vw, 2.15rem)' },
          textAlign: 'center',
          mb: { xs: 1, sm: 0 }
        }}
      >
        {formState === 0 ? 'Sign in' : 'Sign up'} 
      </Typography>
      
      {/* Login Method Toggle - Only show for signin */}
      {formState === 0 && (
        <Box sx={{ textAlign: 'center', mb: { xs: 1, sm: 2 } }}>
        
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Button
              variant={loginMethod === 'password' ? 'contained' : 'outlined'}
              onClick={() => {
                setLoginMethod('password');
                setOtpSent(false);
                setOtpVerified(false);
                setOtp('');
                setLoginEmail('');
                clearError();
                setEmailError(false);
                setEmailErrorMessage('');
              }}
              size="small"
              sx={{ 
                minHeight: { xs: '44px', sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '0.8125rem' }
              }}
            >
              Password
            </Button>
            <Button
              variant={loginMethod === 'otp' ? 'contained' : 'outlined'}
              onClick={() => {
                setLoginMethod('otp');
                setPassword('');
                setPasswordError(false);
                setPasswordErrorMessage('');
                clearError();
              }}
              size="small"
              sx={{ 
                minHeight: { xs: '44px', sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '0.8125rem' }
              }}
            >
              OTP
            </Button>
          </Box>
        </Box>
      )}
      
      <Box
        //component="form"

        //noValidate
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          gap: { xs: 1.5, sm: 2 }
        }}
      >
        {formState == 1 && <FormControl>
          <FormLabel htmlFor="name">Full Name</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="name"
            type="name"
            name="name"
            placeholder="John Doe"
            autoComplete="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
            color={emailError ? 'error' : 'primary'}
          />
        </FormControl> }
        
        {/* Username field - only show for signup OR signin with password */}
        {(formState === 1 || (formState === 0 && loginMethod === 'password')) && (
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="username"
              type="username"
              name="username"
              value={username}
              placeholder="@john_doe"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
              onChange={(e) => setUsernaem(e.target.value)}
            />
          </FormControl>
        )}
        
        {/* Email field for login with OTP */}
        {formState === 0 && loginMethod === 'otp' && (
          <FormControl>
            <FormLabel htmlFor="login-email">Email Address</FormLabel>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              alignItems: 'flex-start',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="login-email"
                type="email"
                name="login-email"
                value={loginEmail}
                placeholder="john@example.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                onChange={(e) => setLoginEmail(e.target.value)}
                color={emailError ? 'error' : 'primary'}
                disabled={otpVerified}
                sx={{ mb: { xs: 1, sm: 0 } }}
              />
              {loginEmail.trim() && (
                otpVerified ? (
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ 
                      minWidth: { xs: '100%', sm: '80px' }, 
                      height: '40px', 
                      fontSize: '0.75rem',
                      minHeight: '44px'
                    }}
                    disabled
                  >
                    ✓ Verified
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={otpSent ? handleResendLoginOtp : handleSendLoginOtp}
                    disabled={isResendDisabled}
                    sx={{ 
                      minWidth: { xs: '100%', sm: '80px' }, 
                      height: '40px', 
                      fontSize: { xs: '0.75rem', sm: '0.55rem' },
                      backgroundColor: '#000',
                      color: '#fff',
                      border: '1px solid #000',
                      minHeight: '44px',
                      '&:hover': {
                        backgroundColor: '#333',
                        border: '1px solid #333'
                      },
                      '&:disabled': {
                        backgroundColor: '#666',
                        color: '#fff',
                        border: '1px solid #666'
                      }
                    }}
                  >
                    {otpSent ? (
                      isResendDisabled ? `Resend (${countdown}s)` : 'Resend OTP'
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                )
              )}
            </Box>
          </FormControl>
        )}
        
        {/* OTP input for signin */}
        {formState === 0 && loginMethod === 'otp' && otpSent && !otpVerified && (
          <FormControl>
            <FormLabel htmlFor="login-otp">Enter OTP</FormLabel>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              alignItems: 'flex-start',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                id="login-otp"
                type="text"
                name="login-otp"
                value={otp}
                placeholder="Enter 6-digit OTP"
                required
                fullWidth
                variant="outlined"
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                sx={{ mb: { xs: 1, sm: 0 } }}
              />
              
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Development mode: Check the backend console/terminal for your OTP
            </Typography>
          </FormControl>
        )}
        
        {formState == 1 && <FormControl>
          <FormLabel htmlFor="email">Email Address</FormLabel>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              value={email}
              placeholder="john@example.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              color={emailError ? 'error' : 'primary'}
              disabled={otpVerified}
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
          </Box>
        </FormControl> }

        {formState == 1 && otpSent && !otpVerified && <FormControl>
          <FormLabel htmlFor="otp">Enter OTP</FormLabel>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              id="otp"
              type="text"
              name="otp"
              value={otp}
              placeholder="Enter 6-digit OTP"
              required
              fullWidth
              variant="outlined"
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
            <Button
              variant="contained"
              onClick={handleVerifyOtp}
              sx={{ 
                minWidth: { xs: '100%', sm: '70px' }, 
                height: '40px', 
                fontSize: { xs: '0.875rem', sm: '0.65rem' },
                backgroundColor: '#000',
                color: '#fff',
                minHeight: '44px',
                '&:hover': {
                  backgroundColor: '#333'
                }
              }}
            >
              Verify
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Development mode: Check the backend console/terminal for your OTP
          </Typography>
        </FormControl> }
        
        {/* Password field - show for signup OR signin with password */}
        {(formState === 1 || (formState === 0 && loginMethod === 'password')) && (
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              value={password}
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
        )}
    
        <p style={{color: "rgb(128 29 20)", margin: "8px 0", fontSize: "14px"}}>{error}</p>
        
        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {formState == 0 ? 
          <Button 
            type="button" 
            fullWidth 
            variant="contained" 
            onClick={handleAuth}
            disabled={loading}
            sx={{ 
              minHeight: { xs: '48px', sm: '42px' },
              fontSize: { xs: '1rem', sm: '0.875rem' },
              mt: { xs: 1, sm: 0 }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
          </Button> 
        :
         <Button 
           type="button" 
           fullWidth 
           variant="contained" 
           onClick={handleAuth}
           disabled={loading}
           sx={{ 
             minHeight: { xs: '48px', sm: '42px' },
             fontSize: { xs: '1rem', sm: '0.875rem' },
             mt: { xs: 1, sm: 0 }
           }}
         >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign up'}
          </Button> }
        
    
        
        <Typography sx={{ 
          textAlign: 'center',
          fontSize: { xs: '0.875rem', sm: '0.875rem' },
          mt: { xs: 1, sm: 0 }
        }}>
          {formState == 0 ? `Don't` : "Already"} have an account?{' '}
          <span>
            <Link
              href="/material-ui/getting-started/templates/sign-in/"
              variant="body2"
              sx={{ 
                alignSelf: 'center',
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                touchAction: 'manipulation',
                minHeight: { xs: '44px', sm: 'auto' },
                display: 'inline-flex',
                alignItems: 'center'
              }}
              onClick={(e) => {
                e.preventDefault();
                // Reset all states when switching between signin/signup
                setOtpSent(false);
                setOtpVerified(false);
                setOtp('');
                setEmail('');
                setLoginEmail('');
                setPassword('');
                clearError();
                setEmailError(false);
                setEmailErrorMessage('');
                setPasswordError(false);
                setPasswordErrorMessage('');
                setLoginMethod('password'); // Reset to password method
                setFormState((prev) => (prev === 0 ? 1 : 0));
              }}
            >
              {formState == 0 ?  "Sign up" : "Sign In"}
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider></Divider>
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Facebook')}
          startIcon={<FacebookIcon />}
        >
          Sign in with Facebook
        </Button>
      </Box> */}

      <Snackbar />
      {error && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleSnackClose}
          message={message || error}
        />
      )}
    </Card>
  );
}