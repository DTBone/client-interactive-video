/* eslint-disable react/prop-types */
import '~/index.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '~/store/userSlice';
import { useRef } from 'react';

import styles from './Login.module.scss';
import authService from '~/services/auth/authService';
import { Snackbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import FacebookLogin from 'react-facebook-login';
import ReCAPTCHA from 'react-google-recaptcha';
import userService from '~/services/api/userService';
// import GitHubLoginButton from './GithubLoginButton';



function Login( { isLoginForm } ) {

    const dispatch = useDispatch();
    if(isLoginForm === undefined) {
        isLoginForm = true;
    }
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

    setOpen(false);
  };
    const submitBtn = useRef(null);
    const [isLogin, setIsLogin] = useState(isLoginForm);
    const [message, setMessage] = useState(null);
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null)

    var title = isLogin ? 'Log In' : 'Sign Up';
    var ask = isLogin ? 'Don\'t have an account?' : 'Already have an account?';
    var switchText = isLogin ? 'Create new Account' : 'Log In';

    const validationRegister = () => {
        if(fullname === '' || email === '' || password === '' || confirmPassword === '') {
            setMessage('Please fill in all fields');
            return false;
        }
        if((/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email) === false) {
            setMessage('Invalid email');
            return false;
        }
        if(password.length < 8) {
            setMessage('Password must be at least 8 characters');
            return false;
        }
        if((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/).test(password) === false) {
            setMessage('Password must contain at least one uppercase letter, one lowercase letter, one special letter and one number');
            return false;
        }
        if(password !== confirmPassword) {
            setMessage('Password and Confirm Password do not match');
            return false;
        }
        return true;
    }
    const handleCaptchaChange = (token) => {
        setCaptchaToken(token)
    }
    var handleSwitch = () => {
        setIsLogin(!isLogin);
    }
    // const login = useGoogleLogin({
    //     ux_mode: 'popup',
    //     clientId: '1094830000000-abc123def456.apps.googleusercontent.com',
    //     onSucess: handleSuccess,
    //     onError: (err) => {
    //         setMessage('Login Google failed. Please check your credentials.' + err);
    //     }
    // });
    var handleResponseFacebook = async (response) => {
        console.log(response);
        const credentials = { 
            isFacebook: true,
            email: response.email,
            fullname: response.name,
            picture: response.picture.data.url,
            facebookId: response.userID,
        };
        try {
            const data = await authService.login(credentials);
            setOpen(true);
            // Lưu token hoặc dữ liệu người dùng vào localStorage/sessionStorage nếu cần
            localStorage.setItem('userToken', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            dispatch(setUser(data.data.user));
            const user = data.data.user;
            // Chuyển hướng đến trang chính sau khi đăng nhập thành công
            navigate(`/homeuser?userid=${user.userId}`, {state: {user: user}});
        }
        catch (err) {
            setMessage('Login Facebook failed. Please check your credentials.' + err);
            throw err;
        }
    }
    var handleSuccess = async (token) => {
        const decodedToken = jwtDecode(token.credential);
        const credentials = { 
            isGoogle: true,
            email: decodedToken.email,
            fullname: decodedToken.name,
            picture: decodedToken.picture,
            googleId: decodedToken.sub,
        };
        try {
            const data = await authService.login(credentials);
            setOpen(true);
            // Lưu token hoặc dữ liệu người dùng vào localStorage/sessionStorage nếu cần
            localStorage.setItem('userToken', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            dispatch(setUser(data.data.user));
            const user = data.data.user;
            // Chuyển hướng đến trang chính sau khi đăng nhập thành công
            navigate(`/homeuser?userid=${user.userId}`, {state: {user: user}});
        }
        catch (err) {
            setMessage('Login err failed. Please check your credentials.');
            throw err;
        }

    }
    var handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);
        submitBtn.current.disabled = true;
        if(isLogin) {
            try {
                const credentials = { email, password };
                const data = await authService.login(credentials);
                setOpen(true);
                // Lưu token hoặc dữ liệu người dùng vào localStorage/sessionStorage nếu cần
                localStorage.setItem('userToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                dispatch(setUser(data.data.user));
                const user = data.data.user;
                // Chuyển hướng đến trang chính sau khi đăng nhập thành công
                navigate(`/homeuser?userid=${user.userId}`, {state: {user: user}});
            } catch (err) {
                setMessage('Login failed. Please check your credentials.');
                throw err;
            }
        }
        else {
            if(validationRegister()) {
                if (!captchaToken) {
                    alert('Please complete the reCAPTCHA');
                    return;
                }
                else {
                    const data = await userService.verifyCaptcha(captchaToken)
                    console.log(data)
                    if(data === 200)
                    {
                        //Thực hiện gửi form đăng kí
                        try {
                            const credentials = { fullname, username, email, password };
                            const data = await authService.register(credentials);

                            navigate('/verify-account', {state: {email: email}});
                
                            // Lưu token hoặc dữ liệu người dùng vào localStorage/sessionStorage nếu cần
                            localStorage.setItem('userToken', data.data.token);
                            setOpen(true);
                            setIsLogin(true);
                        } catch (err) {
                            setMessage(err.response.data.message);
                            throw err;
                            }
                    }

                    else{
                        alert("Captcha in valid")
                    }
                }     
        }
    }
}
    return ( 
        <div className='flex flex-col items-center w-screen h-screen'>
              <div className={`${styles.wrapper} flex w-2/5 h-4/5 mt-5 p-5 flex-col items-center'`}>
                <div className='logo h-1/6 flex flex-col items-center'>
                        <img className='h-full' src="src/assets/logo_codechef.png" alt="logo" />
                </div>
                    <div className='w-full h-2/3 form flex flex-col items-center gap-2'>
                        <h1 className='font-bold text-3xl text-blue-700 uppercase'>{title} to CodeChef</h1>
                            <form onSubmit={handleLogin} className='w-4/5 h-auto p-5 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg'>
                                {isLogin || <TextField
                                    required
                                    autoComplete='off'
                                    id="filled-required"
                                    variant='filled'
                                    label="Full name"
                                    placeholder='John Doe'
                                    type='text'
                                    onChange={(e) => setFullname(e.target.value)}
                                    sx={{
                                        width:'100%',
                                        backgroundColor:'white',
                                        borderRadius:'5px',
                                    }}
                                    color='primary'
                                    />}
                                    {isLogin || <TextField
                                    required
                                    id="filled-required"
                                    variant='filled'
                                    autoComplete='off'
                                    label="User name"
                                    type='text'
                                    placeholder='johndoe123'
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={{
                                        width:'100%',
                                        backgroundColor:'white',
                                        borderRadius:'5px',
                                    }}
                                    color='primary'
                                    />}
                                <TextField
                                    required
                                    autoComplete='off'
                                    
                                    variant='filled'
                                    label="Email"
                                    type='email'
                                    placeholder='johndoe@gmail.com'
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{
                                        width:'100%',
                                        backgroundColor:'white',
                                        borderRadius:'5px',
                                    }}
                                    color='primary'
                                    />
                                
                                
                                <TextField
                                    required
                                    autoComplete='off'
                                    
                                    variant='filled'
                                    label="Password"
                                    type='password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{
                                        width:'100%',
                                        backgroundColor:'white',
                                        borderRadius:'5px',
                                    }}
                                    color='primary'
                                    />
                                {isLogin || <TextField
                                    required
                                    
                                    variant='filled'
                                    autoComplete='off'
                                    label="Confirm Password"
                                    type='password'
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    sx={{
                                        width:'100%',
                                        backgroundColor:'white',
                                        borderRadius:'5px',
                                    }}
                                    color='primary'
                                    />}
                                {message && <Typography variant='subtitle1' color='error'>{message}</Typography>}
                                {isLogin || <ReCAPTCHA onChange={handleCaptchaChange} sitekey='6Lf2jFcqAAAAAF3yHodwcNcSRXkqWSt0C4bFGnB4'/>}
                                <Button type="submit" ref={submitBtn} className='w-full' variant="contained" color='secondary' sx={{backgroundColor:'white', color:'black'}}>{title}</Button>
                                    <div className='groupButton self-start text-white'>
                                        {isLogin && <Link to='/forgot-password'>Forgot Password?</Link>}
                                    </div>
                            
                            </form>
                            <div className='switch w-4/5 flex flex-col px-5 py-2 items-center  bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg'>
                            
                            <div className='social w-full flex flex-row gap-2 items-center justify-center' >
                                      
                                
                                    {/* <GitHubLoginButton
                                    window={window}
                                    /> */}
                                <FacebookLogin
                                    appId='1183791329364036'
                                    autoLoad={false}
                                    textButton='Facebook'
                                    buttonStyle={{backgroundColor: '#0064e0',width:'100%', color: 'white', borderRadius: '5px', padding: '10px', fontSize: '1rem', alignContent: 'center'}}
                                    fields='name,email,picture'
                                    callback={handleResponseFacebook}
                                />
                            
                                <GoogleLogin
                                onSuccess={handleSuccess}
                                onError={(err) => {
                                    setMessage('Login Google failed. Please check your credentials.' + err);
                                }}
                                />
                                    
                            </div>
                            </div>
                            <Snackbar
                                open={open}
                                autoHideDuration={5000}
                                onClose={handleClose}
                                type='success'
                                message={isLogin ? 'Login successful' : 'Register successful'}
                            />
                            <div className='ask'>{ask}</div>
                            <div className='switch w-4/5 flex flex-col px-5 py-2 items-center  bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg'>
                                <Button onClick={() => handleSwitch()} className='w-full' variant="contained" color='secondary' sx={{backgroundColor:'white', color:'black'}}>{switchText}</Button>
                            </div>
                        </div>
              </div>                
        </div>
     );
}

export default Login;