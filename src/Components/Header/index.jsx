/* eslint-disable react/prop-types */
import ModeSwitcher from './components/ModeSwitch/ModeSwitch';
import styles from './Header.module.scss';
import Navbar from './components/Navbar';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material';
function Header({isLogin, user }) {
    if (!user) {
        user = {
            name: 'John Doe',
            avatar: ''
        }
    }
    if (!isLogin) {
        isLogin = false;
    }
    function stringToColor(string) {
        let hash = 0;
        let i;
      
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
      
        return color;
      }
      
      function stringAvatar(name) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
      }
    return ( 
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {/* <div className={styles.background}></div> */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <img src="src/assets/logo_codechef.png" alt="logo" />
                    </div>
                    <Navbar/>
                    {!isLogin && <div className={styles.groupButton}>
                    
                        <ModeSwitcher/>
                        <Link to='/login' className={styles.logIn} >Log In</Link>
                        <Link to='/signup' className={styles.signUp}>Sign Up</Link>
                    </div>}
                    {isLogin && <div className={styles.groupButton}>
                        {user.avatar ? <Avatar src={user.avatar} alt={user.name} /> : <Avatar {...stringAvatar(user.name)} />}
                        <Link to='/login' className={`${styles.logIn}`} >Log Out</Link>
                    </div>}
                </div>
            </div>
        </div>
     );
}

export default Header;