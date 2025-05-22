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
                Course registration failed. Please try again!
            </Alert>
        </Snackbar>
    )
}

export default CourseRegisFailed
