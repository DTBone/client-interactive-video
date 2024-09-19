import ModeSwitcher from './components/ModeSwitch/ModeSwitch';
import styles from './Header.module.scss';
import Navbar from './components/Navbar';
import { Link } from 'react-router-dom';
function Header() {
    return ( 
        <header>
            <div className={styles.container}>
                {/* <div className={styles.background}></div> */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <img src="src/assets/logo_codechef.png" alt="logo" />
                    </div>
                    <Navbar/>
                    <div className={styles.groupButton}>
                        <ModeSwitcher/>
                        <Link to='/login' className={styles.logIn} >Log In</Link>
                        <Link to='/signup' className={styles.signUp}>Sign Up</Link>
                    </div>
                </div>
            </div>
        </header>
     );
}

export default Header;