/* eslint-disable react/prop-types */
import styles from './Header.module.scss';
import Navbar from './components/Navbar';
import { Link } from 'react-router-dom';
import AvatarProfile from './components/Profile';
import logo from '../../assets/logo_codechef.png';
import { SearchIcon } from 'lucide-react';
import { TextField, InputAdornment } from '@mui/material';
function Header({isLogin, user, setSearch }) {
    if (!isLogin) {
        isLogin = false;
    }
    if(!user) {
        user = 
          {
            username: 'Guest',
            email: '',
            profile: {
                picture: ''
            },
            
          }
        }

      const handleSearchChange = (value) => {
          setSearch(value);
      }
      
      const handleClick = () => {
          window.location.href = '/';
      }
    return ( 
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {/* <div className={styles.background}></div> */}
                <div className={styles.header}>
                    <div className={styles.logo} onClick={() => handleClick()}>
                        <img src={logo} alt="logo" />
                    </div>
                    {!isLogin ? <Navbar /> : 
                        <TextField
                        id="input-with-icon-textfield"
                        label="Search"
                        size="small"
                        onKeyDown={
                            (e) => {
                                if (e.key === 'Enter') {
                                    handleSearchChange(e.target.value);
                                }
                            }
                        }
                        sx={{
                            width: '400px',
                        }}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          },
                        }}
                        variant="filled"
                      />
                  }
                    {!isLogin && <div className={styles.groupButton}>
                    
                        <Link to='/signin' className={styles.logIn} >Log In</Link>
                        <Link to='/signup' className={styles.signUp}>Sign Up</Link>
                    </div>}
                    {isLogin && <div className={styles.groupButton}>
                        <AvatarProfile user={user}/>
                    </div>}
                </div>
            </div>
        </div>
     );
}

export default Header;