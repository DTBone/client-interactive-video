import * as React from 'react';

import Snackbar from '@mui/material/Snackbar';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
const NoticeSnackbar = ({ open, handleClose, status, content }) => {



    const messageContent = (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '8px'
        }}>
            {status === 'error' && status ? (
                <CloseIcon sx={{ color: '#ff3333' }} />
            ) : (
                <DoneOutlineIcon sx={{ color: '#4caf50' }} />
            )}
            <span>{content}</span>

        </Box>
    );
    return (
        <div>

            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={messageContent}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        bgcolor: status === 'error' ? '#ffebee' : '#e8f5e9',
                        color: '#333',
                        minWidth: '300px',
                    }
                }}
            />

        </div >
    )
}

export default NoticeSnackbar
