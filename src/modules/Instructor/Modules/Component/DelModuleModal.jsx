import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    IconButton,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import {
    Lock as LockIcon,
    Close as CloseIcon,
    Warning as WarningIcon
} from '@mui/icons-material';

const DelModuleModal = ({
    open,
    onClose,
    onConfirm,
    moduleName,
    isLoading
}) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmitDele = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }

        try {
            await onConfirm(password);
            setPassword('');
            setError('');
        } catch (err) {
            setError(err.message || 'Invalid password');
        }
    };

    const handleClose = () => {
        setPassword('');
        setError('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{
                m: 0,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'error.main'
            }}>
                <WarningIcon />
                Delete Module Confirmation
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <div >
                <DialogContent dividers>
                    <Typography gutterBottom>
                        You are about to delete module: <Box component="span" fontWeight="bold">{moduleName}</Box>
                        <br />
                        This action cannot be undone. Please enter your password to confirm.
                    </Typography>

                    <Box sx={{ mt: 2, position: 'relative' }}>
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            InputProps={{
                                startAdornment: (
                                    <LockIcon sx={{ mr: 1, color: 'action.active' }} />
                                ),
                            }}
                            autoComplete="current-password"
                        />
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                        >
                            {error}
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={handleClose}
                        disabled={isLoading}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => handleSubmitDele(e)}
                        variant="contained"
                        color="error"
                        disabled={!password.trim() || isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Module'}
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default DelModuleModal;