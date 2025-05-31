/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Divider, 
  IconButton, 
  Grid,
  Button,
  CircularProgress,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Delete, Group, People, PersonAdd, PersonRemove } from '@mui/icons-material';
import { addUserToGroup, deleteGroup, fetchUserGroups, removeUserFromGroup } from '~/store/slices/Account/action';
import { toast } from 'react-toastify';

function UserGroups({ refreshTrigger }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const groups = useSelector(state => state.account.groups) || [];
  const users = useSelector(state => state.account.accounts) || [];
  
  // State for dialogs
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        await dispatch(fetchUserGroups());
      } catch (error) {
        toast.error(`Error fetching groups: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, [dispatch, refreshTrigger]);

  const handleDeleteGroup = async (groupId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this group?');
    if (!confirmDelete) return;
    
    setLoading(true);
    try {
      const result = await dispatch(deleteGroup(groupId));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Group deleted successfully');
      } else {
        toast.error(`Failed to delete group: ${result.payload?.message}`);
      }
    } catch (error) {
      toast.error(`Error deleting group: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!selectedUser || !selectedGroup) {
      toast.error('Please select a user to add to the group');
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(addUserToGroup({
        groupId: selectedGroup._id,
        userId: selectedUser
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('User added to group successfully');
        setOpenAddUserDialog(false);
        setSelectedUser('');
      } else {
        toast.error(`Failed to add user: ${result.payload?.message}`);
      }
    } catch (error) {
      toast.error(`Error adding user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (groupId, userId) => {
    const confirmRemove = window.confirm('Are you sure you want to remove this user from the group?');
    if (!confirmRemove) return;

    setLoading(true);
    try {
      const result = await dispatch(removeUserFromGroup({
        groupId,
        userId
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('User removed from group successfully');
      } else {
        toast.error(`Failed to remove user: ${result.payload?.message}`);
      }
    } catch (error) {
      toast.error(`Error removing user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddUserToGroupDialog = (group) => {
    setSelectedGroup(group);
    setOpenAddUserDialog(true);
  };

  return (
    <Box sx={{ mt: 4, width: '100%', overflow: 'hidden', minHeight: '300px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight="bold">
          User Groups
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Group />}
          disabled={loading}
          size="small"
        >
          View All Groups
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {groups.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No user groups found. Select multiple users and use the &quot;Group Selected&quot; button to create a group.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            groups.map(group => (
              <Grid item xs={12} sm={6} lg={4} key={group._id}>
                <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box 
                    sx={{ 
                      bgcolor: 'secondary.light', 
                      p: 2, 
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>{group.name}</Typography>
                    <Box display="flex" alignItems="center">
                      <Chip 
                        icon={<People />} 
                        label={`${group.users?.length || 0} members`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 1 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteGroup(group._id)}
                        sx={{ color: 'white' }}
                        title="Delete Group"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {group.description && (
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ wordBreak: 'break-word' }}>
                        {group.description}
                      </Typography>
                    )}
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                        Members:
                      </Typography>
                      
                      <List dense disablePadding sx={{ maxHeight: '150px', overflow: 'auto' }}>
                        {(group.users || []).map(member => (
                          <ListItem key={member._id} disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={member.profile?.fullname || member.username}
                              primaryTypographyProps={{ 
                                noWrap: true,
                                title: member.profile?.fullname || member.username,
                                sx: { textOverflow: 'ellipsis' }
                              }}
                            />
                            <ListItemSecondaryAction>
                              <IconButton 
                                edge="end" 
                                size="small" 
                                onClick={() => handleRemoveUser(group._id, member._id)}
                                title="Remove User"
                              >
                                <PersonRemove fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
}

export default UserGroups; 