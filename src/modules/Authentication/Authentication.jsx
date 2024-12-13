/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Snackbar, Typography } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import { jwtDecode } from 'jwt-decode';

import { login, register, verifyCaptcha } from '~/store/slices/Auth/action';
import styles from './Login.module.scss';
import { setUser } from '~/store/userSlice';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const submitBtn = useRef(null);

    const { loading, error } = useSelector((state) => state.auth);

    const [isLogin, setIsLogin] = useState(true);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [load, setLoad] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const validationRegister = () => {
        const { fullname, email, password, confirmPassword } = formData;

        if (!fullname || !email || !password || !confirmPassword) {
            setMessage('Please fill in all fields');
            return false;
        }
        // Check fullname have no number and special character
        if ((/[^a-zA-Z\s]/).test(fullname)) {
            setMessage('Full name must not contain numbers or special characters');
            return false;
        }
        // Check username have no space
        if ((/\s/).test(formData.username)) {
            setMessage('Username must not contain space');
            return false;
        }
        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
            setMessage('Invalid email');
            return false;
        }
        if (password.length < 8) {
            setMessage('Password must be at least 8 characters');
            return false;
        }
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/).test(password)) {
            setMessage('Password must contain at least one uppercase letter, one lowercase letter, one special letter and one number');
            return false;
        }
        if (password !== confirmPassword) {
            setMessage('Password and Confirm Password do not match');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoad(true);
        if (isLogin) {
            try {
                const credentials = {
                    email: formData.email,
                    password: formData.password
                };
                const resultAction = await dispatch(login(credentials));
                console.log('resultAction', resultAction);

                if (resultAction.payload.status === 'success') {
                    setOpen(true);
                    if (submitBtn.current) {
                        submitBtn.current.disabled = true;
                    }
                    const { user, token } = resultAction.payload.data;
                    console.log('user', user);

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    //dispatch(setUser(user));
                    console.log('Token saved:', localStorage.getItem('token'));

                    // Navigate to home page after successful login
                    if (user.role === 'student') {
                        navigate(`/homeuser?userid=${user.userId}`, { state: { user } });
                    }
                    if (user.role === 'admin') {
                        navigate('/admin');
                    }
                    if (user.role === 'instructor') {
                        navigate(`/instructor`, { state: { user: user } });
                    }
                }
            } catch (err) {
                setMessage('Login failed. Please check your credentials.');
            } finally {
                setLoad(false);
            }

        } else {
            if (validationRegister()) {
                if (!captchaToken) {
                    alert('Please complete the reCAPTCHA');
                    return;
                }

                const captchaResult = await dispatch(verifyCaptcha(captchaToken));

                if (verifyCaptcha.fulfilled.match(captchaResult) && captchaResult.payload === 200) {
                    try {
                        const credentials = {
                            fullname: formData.fullname,
                            username: formData.username,
                            email: formData.email,
                            password: formData.password
                        };
                        const resultAction = await dispatch(register(credentials));

                        if (register.fulfilled.match(resultAction)) {
                            navigate('/verify-account', { state: { email: formData.email } });
                            setOpen(true);
                            setIsLogin(true);
                        }
                    } catch (err) {
                        setMessage(err.response?.data?.message || 'Registration failed');
                    } finally {
                        setLoad(false);
                    }
                } else {
                    alert("Captcha invalid");
                }
            }
        }
    };

    const handleGoogleSuccess = async (token) => {
        const decodedToken = jwtDecode(token.credential);
        const credentials = {
            isGoogle: true,
            email: decodedToken.email,
            fullname: decodedToken.name,
            picture: decodedToken.picture,
            googleId: decodedToken.sub,
        };

        try {
            const resultAction = await dispatch(login(credentials));
            console.log('resultAction', resultAction);
            if (resultAction.payload.status === 'success') {
                setOpen(true);
                const { user } = resultAction.payload.data;
                navigate(`/homeuser?userid=${user.userId}`, { state: { user } });
            }
        } catch (err) {
            setMessage('Google login failed. Please try again.');
        }
    };

    const handleFacebookResponse = async (response) => {
        const credentials = {
            isFacebook: true,
            email: response.email,
            fullname: response.name,
            picture: response.picture.data.url,
            facebookId: response.userID,
        };

        try {
            const resultAction = await dispatch(login(credentials));
            if (login.fulfilled.match(resultAction)) {
                setOpen(true);
                const { user } = resultAction.payload;
                navigate(`/homeuser?userid=${user.userId}`, { state: { user } });
            }
        } catch (err) {
            setMessage('Facebook login failed. Please try again.');
        }
    };

    const title = isLogin ? 'Log In' : 'Sign Up';
    const ask = isLogin ? "Don't have an account?" : 'Already have an account?';
    const switchText = isLogin ? 'Create new Account' : 'Log In';

    return (
        <div className="flex flex-col items-center w-screen h-screen">
            <div className={`${styles.wrapper} flex w-2/5 h-4/5 mt-5 p-5 flex-col items-center`}>
                <div className="logo h-1/6 flex flex-col items-center">
                    <img className="h-full" src="src/assets/logo_codechef.png" alt="logo" />
                </div>
                <div className="w-full h-2/3 form flex flex-col items-center gap-2">
                    <h1 className="font-bold text-3xl text-blue-700 uppercase">
                        {title} to CodeChef
                    </h1>
                    <form onSubmit={handleLogin} className="w-4/5 h-auto p-5 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg">
                        {!isLogin && (
                            <>
                                <TextField
                                    required
                                    name="fullname"
                                    autoComplete="off"
                                    variant="filled"
                                    label="Full name"
                                    placeholder="John Doe"
                                    onChange={handleInputChange}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: 'white',
                                        borderRadius: '5px',
                                    }}
                                />
                                <TextField
                                    required
                                    name="username"
                                    autoComplete="off"
                                    variant="filled"
                                    label="User name"
                                    placeholder="johndoe123"
                                    onChange={handleInputChange}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: 'white',
                                        borderRadius: '5px',
                                    }}
                                />
                            </>
                        )}
                        <TextField
                            required
                            name="email"
                            autoComplete="off"
                            variant="filled"
                            label="Email"
                            type="email"
                            placeholder="johndoe@gmail.com"
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                backgroundColor: 'white',
                                borderRadius: '5px',
                            }}
                        />
                        <TextField
                            required
                            name="password"
                            autoComplete="off"
                            variant="filled"
                            label="Password"
                            type="password"
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                backgroundColor: 'white',
                                borderRadius: '5px',
                            }}
                        />
                        {!isLogin && (
                            <TextField
                                required
                                name="confirmPassword"
                                variant="filled"
                                autoComplete="off"
                                label="Confirm Password"
                                type="password"
                                onChange={handleInputChange}
                                sx={{
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderRadius: '5px',
                                }}
                            />
                        )}
                        {(message || error) && (
                            <Typography variant="subtitle1" color="error">
                                {message || error}
                            </Typography>
                        )}
                        {!isLogin && (
                            <ReCAPTCHA
                                sitekey="6Lf2jFcqAAAAAF3yHodwcNcSRXkqWSt0C4bFGnB4"
                                onChange={setCaptchaToken}
                            />
                        )}
                        <Button
                            type="submit"
                            ref={submitBtn}
                            className="w-full"
                            variant="contained"
                            color="secondary"
                            disabled={load}
                            sx={{ backgroundColor: 'white', color: 'black' }}
                        >
                            {load ? 'Processing...' : title}
                        </Button>
                        {isLogin && (
                            <div className="groupButton self-start text-white">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                        )}
                    </form>

                    <div className="social w-4/5 flex flex-col px-5 py-2 items-center bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg">
                        <div className="w-full flex flex-row gap-2 items-center justify-center">
                            <FacebookLogin
                                appId="1183791329364036"
                                autoLoad={false}
                                textButton="Facebook"
                                buttonStyle={{
                                    backgroundColor: '#0064e0',
                                    width: '100%',
                                    color: 'white',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    fontSize: '1rem',
                                    alignContent: 'center',
                                }}
                                fields="name,email,picture"
                                callback={handleFacebookResponse}
                            />
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setMessage('Google login failed. Please try again.')}
                            />
                        </div>
                    </div>

                    <Snackbar
                        open={open}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        message={isLogin ? 'Login successful' : 'Register successful'}
                    />

                    <div className="ask">{ask}</div>
                    <div className="switch w-4/5 flex flex-col px-5 py-2 items-center bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg">
                        <Button
                            onClick={() => setIsLogin(!isLogin)}
                            className="w-full"
                            variant="contained"
                            color="secondary"
                            disabled={load}
                            sx={{ backgroundColor: 'white', color: 'black' }}
                        >
                            {load ? 'Processing...' : switchText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;