import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const SuccessfulCourseRegis = ({ openSnackbar, closeSnackbar, snackbarState }) => {

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
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                You have successfully registered for the course!
            </Alert>
        </Snackbar>
    )
}
export default SuccessfulCourseRegis
