import styles from './Navbar.module.scss';
import {Link} from 'react-router-dom';
import { useState } from 'react';
function Navbar() {

    const [active, setActive] = useState(1);
    const handleClick = (index) => {
        setActive(index);
    }

    return ( 
        <nav className={styles.nav}>
            <Link href="#Home"
            className={`${styles.btnNav} ${active === 1 ? styles.active : ''}`}
            onClick={() => handleClick(1)}
            >
                Home
            </Link>
            <Link href="#Contest"
            className={`${styles.btnNav} ${active == 2 ? styles.active : ''}`}
            onClick={() => handleClick(2)}
            >
                Contest
            </Link>
            <Link href="#Practice"
            className={`${styles.btnNav} ${active == 3 ? styles.active : ''}`}
            onClick={() => handleClick(3)}
            >
                Practice
            </Link>
            <Link href="#Code"
            className={`${styles.btnNav} ${active == 4 ? styles.active : ''}`}
            onClick={() => handleClick(4)}
            >
                Code
            </Link>
            
        </nav>
     );
}

export default Navbar;