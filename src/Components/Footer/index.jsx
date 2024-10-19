import { Typography } from '@mui/material';
import styles from './Footer.module.scss';

function Footer() {
    return ( 
        <footer>
            <div className={styles.container}>
                <Typography variant='h6'>© 2024 Code Chef, Inc. All rights reserved.</Typography>
            </div>
        </footer>
     );
}

export default Footer;