import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const CourseRegisFailed = ({ openSnackbar, closeSnackbar, snackbarState }) => {

    const { vertical, horizontal, open } = snackbarState;



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        closeSnackbar();
    };
    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            autoHideDuration={5000}
            open={open}
            onClose={handleClose}
            key={vertical + horizontal}
        >
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                Đăng ký khóa học thất bại. Vui lòng thử lại!
            </Alert>
        </Snackbar>
    )
}

export default CourseRegisFailed
