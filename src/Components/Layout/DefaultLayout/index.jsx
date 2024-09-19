/* eslint-disable react/prop-types */
import styles from './DefaultLayout.module.scss';
import Header from '../../Header';
import Footer from '../../Footer';
function DefaultLayout({ children  }) {
    return (
        <div className={styles.wrapperWeb}>
            <div className={styles.background}></div>
            <Header />
                <div className={styles.content}>
                    {children}
                </div>
            <Footer />
        </div>);
}
export default DefaultLayout;