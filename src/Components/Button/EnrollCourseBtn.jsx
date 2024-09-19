import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FreeTrial from './FreeTrial';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,

};

const EnrollCourseBtn = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button
                variant='contained'
                onClick={handleOpen}
                sx={{ width: "18rem", height: "4rem", background: "#0048b0" }}>
                Enroll For Free
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ width: '100%' }}
            >
                <Box sx={style}>
                    <FreeTrial onClose={handleClose} />
                </Box>
            </Modal>

        </div>
    )
}

export default EnrollCourseBtn
