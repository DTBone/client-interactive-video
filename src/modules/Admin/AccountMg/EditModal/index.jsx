/* eslint-disable react/prop-types */
import { useDispatch } from 'react-redux'
import { updateAccount } from '~/store/slices/Account/action'
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
    Chip
  } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import { useState, useEffect } from 'react';
  
  function EditUserModal({ open, setOpen, userData }) {
    const [formData, setFormData] = useState({
      fullname: '',
      email: '',
      phone: '',
      bio: '',
      role: '',
      status: '',
      username: ''
    });
    const dispatch = useDispatch();
    const [messageBox, setMessageBox] = useState('')
  
    useEffect(() => {
      if (userData) {
        setFormData({
          fullname: userData.profile?.fullname || '',
          email: userData.email || '',
          phone: userData.profile?.phone || '',
          bio: userData.profile?.bio || '',
          role: userData.role || '',
          status: userData.status || '',
          username: userData.username || '',
          userId: userData._id || ''
        });
      }
    }, [userData]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // Mở hộp thoại xác nhận
      const confirmUpdate = window.confirm('Are you sure you want to update this user?');
      if (confirmUpdate) {
        // Thực hiện cập nhật dữ liệu người dùng ở đây
        const result = await dispatch(updateAccount(formData));
        if (updateAccount.fulfilled.match(result)) {
            // Xử lý khi cập nhật thành công
            setMessageBox('Update successfully')
        }
        else
            setMessageBox('Update failed')
        // Đóng modal sau khi cập nhật thành công
      }
    };
  
    const getRoleColor = (role) => {
      switch(role) {
        case 'admin':
          return 'error';
        case 'instructor':
          return 'warning';
        default:
          return 'info';
      }
    };
  
    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="edit-user-modal"
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <EditIcon color="primary" fontSize="large" />
              <Typography variant="h6">Edit User Profile</Typography>
            </Box>
            <Box>
              <Chip 
                label={userData?.role?.toUpperCase()}
                color={getRoleColor(userData?.role)}
                sx={{ mr: 1 }}
              />
              <Chip 
                label={userData?.status?.toUpperCase()}
                color={userData?.status === 'active' ? 'success' : 'error'}
              />
            </Box>
          </Box>
  
          <Divider sx={{ mb: 3 }} />
  
          {/* User Avatar Section */}
          <Box display="flex" justifyContent="center" mb={3}>
            <Avatar
              src={userData?.profile?.picture}
              alt={userData?.profile?.fullname}
              sx={{ width: 100, height: 100 }}
            >
              {userData?.profile?.fullname?.charAt(0)}
            </Avatar>
          </Box>
  
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
                  label="Full Name"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
  
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  disabled
                />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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
                  rows={4}
                />
              </Grid>
  
              {/* Role Selection - Only if current user is admin */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    name="role"
                    onChange={handleChange}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="instructor">Instructor</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
  
              {/* Additional Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Enrolled Courses: {userData?.enrolled_courses?.length || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Created: {new Date(userData?.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
  
              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
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
                    Save Changes
                  </Button>
                  <Typography variant="h5" color={messageBox === 'Update successfully' ? 'success': 'error'} >{messageBox}</Typography>
                  
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    );
  }
  
  export default EditUserModal;