/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  CircularProgress,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid
} from '@mui/material';
import { Person, PersonAdd } from '@mui/icons-material';
import { addUserToGroup, fetchUserGroups, groupAccount } from '~/store/slices/Account/action';
import { toast } from 'react-toastify';

const AddToGroupModal = ({ open, handleClose, selectedUsers = [] }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [createNewGroup, setCreateNewGroup] = useState(false);
  
  // Get groups from Redux store
  const groups = useSelector(state => state.account.groups) || [];
  const users = useSelector(state => state.account.accounts) || [];
  
  // Fetch groups when the modal opens
  useEffect(() => {
    if (open) {
      fetchGroups();
      // Reset selection when modal opens
      setSelectedGroup('');
    }
  }, [open]);

  // Set default group only if groups exist and no group is selected
  useEffect(() => {
    if (groups.length > 0 && !selectedGroup && !createNewGroup) {
      setSelectedGroup(groups[0]._id);
    }
  }, [groups, selectedGroup, createNewGroup]);
  
  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      await dispatch(fetchUserGroups());
    } catch (error) {
      toast.error(`Error fetching groups: ${error.message}`);
    } finally {
      setLoadingGroups(false);
    }
  };
  
  const handleAddToGroup = async () => {
    if (!selectedGroup && !createNewGroup) {
      toast.error('Please select a group or create a new one');
      return;
    }
    
    if (createNewGroup && !newGroupName.trim()) {
      toast.error('Please enter a name for the new group');
      return;
    }
    
    if (selectedUsers.length === 0) {
      toast.error('No users selected to add to the group');
      return;
    }
    
    setLoading(true);
    
    try {
      if (createNewGroup) {
        // Create a new group and add users to it
        const createGroupData = {
          userIds: selectedUsers,
          groupName: newGroupName.trim(),
          description: newGroupDescription.trim()
        };
        
        const createResult = await dispatch(groupAccount(createGroupData));
        
        if (createResult?.meta?.requestStatus === 'fulfilled') {
          toast.success('New group created successfully with selected users');
          resetForm();
          handleClose();
        } else {
          toast.error(`Failed to create group: ${createResult?.payload?.message}`);
        }
      } else {
        // Add users to existing group
        const promises = selectedUsers.map(userId => 
          dispatch(addUserToGroup({
            groupId: selectedGroup,
            userId
          }))
        );
        
        const results = await Promise.all(promises);
        const failures = results.filter(result => result.meta.requestStatus !== 'fulfilled');
        
        if (failures.length === 0) {
          toast.success(`${selectedUsers.length} users added to group successfully`);
          resetForm();
          handleClose();
        } else {
          toast.error(`Failed to add ${failures.length} users to group`);
        }
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedGroup(id);
  }

  const resetForm = () => {
    setSelectedGroup('');
    setNewGroupName('');
    setNewGroupDescription('');
    setCreateNewGroup(false);
  };
  
  // Get selected users' details
  const selectedUserDetails = selectedUsers.map(userId => 
    users.find(user => user._id === userId) || { _id: userId, username: 'Unknown User' }
  );
  
  return (
    <Dialog
      open={open}
      onClose={() => !loading && handleClose()}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Add {selectedUsers.length} {selectedUsers.length === 1 ? 'User' : 'Users'} to Group
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Box mb={3} mt={1}>
              {loadingGroups ? (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Button
                      variant={!createNewGroup ? "contained" : "outlined"}
                      onClick={() => setCreateNewGroup(false)}
                      disabled={loading}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Existing Group
                    </Button>
                    <Button
                      variant={createNewGroup ? "contained" : "outlined"}
                      onClick={() => setCreateNewGroup(true)}
                      disabled={loading}
                      size="small"
                    >
                      New Group
                    </Button>
                  </Box>
                  
                  {createNewGroup ? (
                    <Box>
                      <TextField
                        fullWidth
                        label="Group Name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        disabled={loading}
                        margin="normal"
                        required
                      />
                      <TextField
                        fullWidth
                        label="Description (Optional)"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        disabled={loading}
                        margin="normal"
                        multiline
                        rows={3}
                      />
                    </Box>
                  ) : (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="group-select-label">Select Group</InputLabel>
                      <Select
                        labelId="group-select-label"
                        value={selectedGroup}
                        onChange={handleChange}
                        label="Select Group"
                        disabled={loading}
                      >
                        <MenuItem value="">
                          <em>Select a group</em>
                        </MenuItem>
                        {groups.map(group => (
                          <MenuItem key={group._id} value={group._id}>
                            {group.name} ({group.users?.length || 0} members)
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Selected Users ({selectedUsers.length})
              </Typography>
              <Divider />
              <List sx={{ maxHeight: 250, overflow: 'auto' }}>
                {selectedUserDetails.map(user => (
                  <ListItem key={user._id} dense>
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.profile?.fullname || user.username}
                      secondary={user.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddToGroup}
          variant="contained"
          color="primary"
          disabled={
            loading || 
            loadingGroups || 
            (selectedUsers.length === 0) || 
            (createNewGroup ? !newGroupName.trim() : !selectedGroup)
          }
          startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
        >
          {loading ? 'Processing...' : 'Add to Group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddToGroupModal; 