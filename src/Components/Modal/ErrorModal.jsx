import React, { useState } from 'react';
import { Box, Typography, Modal, Button } from '@mui/material';

const ErrorModal = ({ errorMessage }) => {
    const [open, setOpen] = useState(true); // Modal tự mở khi có lỗi

    const handleClose = () => setOpen(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="error-modal-title"
            aria-describedby="error-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="error-modal-title" variant="h6" component="h2" color="error">
                    Error
                </Typography>
                <Typography id="error-modal-description" sx={{ mt: 2 }}>
                    {errorMessage}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default ErrorModal;
