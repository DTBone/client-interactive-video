/* eslint-disable react/prop-types */
import { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SaveIcon from '@mui/icons-material/Save';

function GroupUsersModal({ open, setOpen, selectedCount, onSubmit }) {
  const [formData, setFormData] = useState({
    groupName: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.groupName.trim()) newErrors.groupName = 'Group name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return; // Don't proceed if validation fails
    }
    
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => !loading && setOpen(false)}
      aria-labelledby="group-users-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {xs: '90%', sm: 500},
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <GroupIcon color="secondary" fontSize="large" sx={{ mr: 2 }} />
          <Typography variant="h6">Create User Group</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />
        
        <Box mb={3} display="flex" alignItems="center">
          <Chip 
            label={`${selectedCount} users selected`} 
            color="secondary" 
            variant="outlined"
          />
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Name *"
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
                error={!!errors.groupName}
                helperText={errors.groupName}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading}
              />
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
                  color="secondary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Group'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}

export default GroupUsersModal; 