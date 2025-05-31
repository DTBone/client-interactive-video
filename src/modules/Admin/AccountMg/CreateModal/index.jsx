/* eslint-disable react/prop-types */
import { useDispatch } from 'react-redux';
import { createAccount } from '~/store/slices/Account/action';
import { 
  Modal, 
  Box, 
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { toast } from 'react-toastify';

function CreateUserModal({ open, setOpen }) {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    bio: '',
    role: 'student',
    status: 'active',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Username validation (no spaces, only letters, numbers, and underscores)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (formData.username && !usernameRegex.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return; // Don't proceed if validation fails
    }
    
    // Confirm before submitting
    const confirmCreate = window.confirm('Are you sure you want to create this user?');
    if (confirmCreate) {
      setLoading(true);
      
      try {
        // Create a clean object for API submission
        const submitData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          status: formData.status,
          profile: {
            fullname: formData.fullname,
            phone: formData.phone,
            bio: formData.bio
          }
        };
        
        const result = await dispatch(createAccount(submitData));
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('User created successfully');
          setOpen(false);
        } else {
          toast.error(result.payload?.message || 'Failed to create user');
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => !loading && setOpen(false)}
      aria-labelledby="create-user-modal"
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
        <Box display="flex" alignItems="center" mb={3}>
          <AddIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
          <Typography variant="h6">Create New User</Typography>
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
                label="Full Name *"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                error={!!errors.fullname}
                helperText={errors.fullname}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password *"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password *"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
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
                  disabled={loading}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
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
                multiline
                rows={3}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  name="role"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="instructor">Instructor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} mt={2}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button 
                  variant="outlined" 
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}

export default CreateUserModal; 