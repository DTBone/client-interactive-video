/* eslint-disable react/prop-types */
import '~/index.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useEffect,useState } from 'react';
import styles from './Login.module.scss';
function Login( { isLoginForm } ) {
    if(isLoginForm === undefined) {
        isLoginForm = true;
    }
    const [isLogin, setIsLogin] = useState(isLoginForm);

    var title = isLogin ? 'Log In' : 'Sign Up';
    var ask = isLogin ? 'Don\'t have an account?' : 'Already have an account?';
    var switchText = isLogin ? 'Create new Account' : 'Log In';


    var handleSwitch = () => {
        setIsLogin(!isLogin);
    }
    useEffect(() => {
        console.log(isLogin);
    }
    , [isLogin]);
    return ( 
        <div className='flex flex-col items-center w-screen h-screen'>
              <div className={`${styles.wrapper} flex w-2/5 h-4/5 mt-5 p-5 flex-col items-center'`}>
                <div className='logo h-1/4 flex flex-col items-center'>
                        <img className='h-full' src="src/assets/logo_codechef.png" alt="logo" />
                </div>
                    <div className='w-full h-2/3 form flex flex-col items-center gap-2'>
                        <h1 className='font-bold text-3xl text-blue-700 uppercase'>{title} to CodeChef</h1>
                            <form className='w-4/5 h-4/5 p-5 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg'>
                                
                                <TextField
                                    required
                                    id="filled-required"
                                    variant='filled'
                                    label="Email"
                                    sx={{
                                        width:'100%',
                                        backgroundColor:'white',
                                        borderRadius:'5px',
                                    }}
                                    />
                                
                                
                                <TextField
                                    required
                                    id="filled-required"
                                    variant='filled'
                                    label="Password"
                                    sx={{
                                        width:'100%',
                                        backgroundColor:'white',
                                        borderRadius:'5px',
                                    }}
                                
                                    />
                                
                                <Button type="submit" className='w-full' variant="contained" color='secondary' sx={{backgroundColor:'white', color:'black'}}>{title}</Button>
                                    <div className='groupButton self-start text-white'>
                                        {isLogin && <Link to='/forgotpassword'>Forgot Password?</Link>}
                                    </div>
                            <div className='social w-auto flex gap-5'>
                                <FontAwesomeIcon icon={faFacebook} size="2xl" style={{color: "white",}} />
                                <FontAwesomeIcon icon={faGoogle} size="2xl" style={{color: "white",}} />
                                <FontAwesomeIcon icon={faGithub} size="2xl" style={{color: "white",}} />
                            </div>
                            </form>
                            
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