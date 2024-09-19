import ModeSwitcher from './components/ModeSwitch/ModeSwitch';
import styles from './Header.module.scss';
import Navbar from './components/Navbar';
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
                        <button className={styles.logIn}>Log In</button>
                        <button className={styles.signUp}>Sign Up</button>
                    </div>
                </div>
            </div>
        </header>
     );
}

export default Header;