import { useDispatch } from 'react-redux'
import { createAccount } from '~/store/slices/Account/action'
import {
    Modal,
    Box,
    Typography,
    Grid2 as Grid,
    TextField,
    Avatar,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';

function AddInstructorModal({ open, setOpen }) {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        bio: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'instructor', // Mặc định là instructor
        status: 'active' // Mặc định là active
    });

    const dispatch = useDispatch();
    const [messageBox, setMessageBox] = useState('')
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Validate fullname
        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Full name is required';
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }

        // Validate username
        if (!formData.username || formData.username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters';
        }

        // Validate password
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Validate phone (optional)
        if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10-11 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const confirmCreate = window.confirm('Are you sure you want to create this instructor?');
        if (confirmCreate) {
            try {
                const result = await dispatch(createAccount(formData));
                if (createInstructor.fulfilled.match(result)) {
                    setMessageBox('Instructor created successfully');
                    // Reset form after successful creation
                    setFormData({
                        fullname: '',
                        email: '',
                        phone: '',
                        bio: '',
                        username: '',
                        password: '',
                        confirmPassword: '',
                        role: 'instructor',
                        status: 'active'
                    });
                    setTimeout(() => {
                        setOpen(false);
                    }, 2000);
                } else {
                    setMessageBox('Failed to create instructor');
                }
            } catch (error) {
                setMessageBox('Error creating instructor');
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="add-instructor-modal"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: {xs: '90%', sm: 600},
                maxHeight: '90vh',
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
            }}>
                {/* Header */}
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <PersonAddIcon color="primary" fontSize="large" />
                    <Typography variant="h6">Add New Instructor</Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Basic Information */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Basic Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Full Name"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                error={!!errors.fullname}
                                helperText={errors.fullname}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    label="Status"
                                    name="status"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                
                                rows={4}
                            />
                        </Grid>

                        {/* Password Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Security
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Box display="flex" gap={2} justifyContent="flex-end" alignItems="center">
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Create Instructor
                                </Button>
                                {messageBox && (
                                    <Typography
                                        variant="subtitle2"
                                        color={messageBox.includes('successfully') ? 'success.main' : 'error.main'}
                                    >
                                        {messageBox}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
}

export default AddInstructorModal;