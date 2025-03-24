/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FreeTrial from './FreeTrial';
import { useState } from 'react';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,

};

const EnrollCourseBtn = ({ course, submitCourse }) => {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const handleSubmit = () => {
        setOpen(true);
        submitCourse(open);
        handleClose();
    }
    const convertPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }


    return (
        <div>
            <Button
                variant='contained'
                onClick={handleOpen}

                sx={{ width: "18rem", height: "4rem", background: theme => theme.palette.primary.main }}>
                {course.price > 0 ? `Enroll with ${convertPrice(course.price)} VND` : 'Enroll For Free Trial '}
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ width: '100%' }}
            >
                <Box sx={style}>
                    <FreeTrial course={course} onClose={handleClose} onSubmit={handleSubmit} />

                </Box>
            </Modal>

        </div>
    )
}

export default EnrollCourseBtn
