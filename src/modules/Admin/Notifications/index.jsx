import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Tab,
  Tabs,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  Autocomplete
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkunreadMailbox as UnreadIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Campaign as BroadcastIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups, getAllAccount } from '~/store/slices/Account/action';
import { api } from '~/Config/api';
import HTMLEditor from './htmlEditor';

const NotificationsAdmin = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sendType, setSendType] = useState('broadcast'); // broadcast, group, user
  const groups = useSelector(state => state.account.groups) || [];
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    htmlContent: '',
    link: '',
    metadata: {},
    isEmail: false,
    userId: '',
    groupName: ''
  });

  const listboxRef = useRef(null);

  useEffect(() => {
    // In a real implementation, fetch notifications from backend
    fetchNotificationsHistory();
    setLoading(false);
    setSearchLoading(false);
    setHasMoreUsers(true);
    setPage(1);
  }, []);

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
  }, [dispatch]);

  useEffect(() => {
    const loadInitialUsers = async () => {
      setLoading(true);
      try {
        const result = await dispatch(getAllAccount({page: 1, limit: 10}));
        if (getAllAccount.fulfilled.match(result)) {
          setUsers(result.payload.data.users);
        }
      } catch (error) {
        toast.error(`Error fetching users: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialUsers();
  }, [dispatch, openSendDialog]);

  const handleSearchUsers = async (event, value) => {
    if (!value) return;
    console.log('value', value);
    setSearchLoading(true);
    try {
      const result = await dispatch(getAllAccount({
        filters: {
          search: value
        }
      }));
      
      if (getAllAccount.fulfilled.match(result)) {
        setUsers(result.payload.data.users);
      }
    } catch (error) {
      toast.error(`Error searching users: ${error.message}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadMoreUsers = async () => {
    setSearchLoading(true);
    if (!hasMoreUsers) return;
    try {
      const result = await dispatch(getAllAccount({page: page + 1, limit: 10}));
      const totalUsers = result.payload.total;
      console.log('loading more users', hasMoreUsers, totalUsers, users.length);

      if (totalUsers <= users.length) {
        setHasMoreUsers(false);
        return;
      }
      

      if (getAllAccount.fulfilled.match(result)) {
        setUsers(prev => [...prev, ...result.payload.data.users]);
        setPage(page + 1);
      }
    } catch (error) {
      toast.error(`Error loading more users: ${error.message}`);
    } finally {
      setSearchLoading(false);
    }
  }


  const handleScroll = (event) => {
    if (listboxRef.current) {
      if (listboxRef.current.scrollTop + listboxRef.current.clientHeight >= listboxRef.current.scrollHeight && hasMoreUsers) {
        handleLoadMoreUsers();
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const fetchNotificationsHistory = async () => {
    try {
      setLoading(true);
      // Replace with actual API call to get notifications
      const response = await api.get('/notifications/admin');
      console.log('response', response);
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMarkAsRead = (id) => {
    // In a real app, would call API to mark as read
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDeleteNotification = async (id) => {
    try {
      const response = await api.delete(`/notifications/detail/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchNotificationsHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete notification');
    }
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleCloseViewDialog = () => {
    setSelectedNotification(null);
  };

  const handleOpenSendDialog = () => {
    setOpenSendDialog(true);
  };

  const handleCloseSendDialog = () => {
    setOpenSendDialog(false);
    setNewNotification({
      title: '',
      message: '',
      htmlContent: '',
      link: '',
      metadata: {},
      isEmail: false,
      userId: '',
      groupName: ''
    });
    setSendType('broadcast');
  };

  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
  };

  const handleSendNotification = async () => {
    try {
      setLoading(true);
      
      const notificationData = {
        title: newNotification.title,
        message: newNotification.message,
        htmlContent: newNotification.htmlContent,
        link: newNotification.link || '#',
        metadata: newNotification.metadata || {},
        isEmail: newNotification.isEmail
      };
      
      let response;
      
      if (sendType === 'broadcast') {
        response = await api.post('/notifications/broadcast', notificationData);
      } else if (sendType === 'group') {
        response = await api.post(`/notifications/group/${newNotification.groupName}`, notificationData);
      } else if (sendType === 'user') {
        response = await api.post(`/notifications/user/${newNotification.userId}`, notificationData);
      }
      
      if (response.data.success) {
        toast.success(response.data.message);
        handleCloseSendDialog();
        // Optionally refresh the notifications list
        console.log('fetching notifications history');
        setTimeout(() => {
          fetchNotificationsHistory();
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  // Filter notifications based on tab
  const filteredNotifications = tabValue === 0 
    ? notifications 
    : tabValue === 1 
      ? notifications.filter(n => n.isSystem) 
      : notifications.filter(n => !n.isSystem);


  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'course':
        return <Avatar sx={{ bgcolor: 'primary.main' }}>C</Avatar>;
      case 'user':
        return <Avatar sx={{ bgcolor: 'info.main' }}>U</Avatar>;
      case 'payment':
        return <Avatar sx={{ bgcolor: 'success.main' }}>P</Avatar>;
      case 'report':
        return <Avatar sx={{ bgcolor: 'error.main' }}>R</Avatar>;
      case 'system':
      default:
        return <Avatar sx={{ bgcolor: 'warning.main' }}>S</Avatar>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Notifications
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<SendIcon />} 
            onClick={handleOpenSendDialog}
            sx={{ mr: 1 }}
          >
            Send New
          </Button>
          <IconButton onClick={handleOpenSettingsDialog}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label="All Notifications" 
              icon={<Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>} 
              iconPosition="start" 
            />
            <Tab 
              label="Your Notifications" 
              icon={
                <UnreadIcon />
              } 
              iconPosition="start" 
            />
            <Tab 
              label="Sent Notifications" 
              icon={<DoneIcon />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <Box key={notification.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        bgcolor: notification.read ? 'transparent' : 'rgba(33, 150, 243, 0.05)',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                      secondaryAction={
                        <Box>
                          {!notification.read && (
                            <IconButton 
                              edge="end" 
                              aria-label="mark as read"
                              onClick={() => handleMarkAsRead(notification.id)}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              <DoneIcon />
                            </IconButton>
                          )}
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => {
                              setSelectedNotification(notification)
                            }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                      button
                      onClick={() => handleViewNotification(notification)}
                    >
                      <ListItemAvatar>
                        {getNotificationIcon(notification.type)}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                            >
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Chip
                                label="New"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: 'block' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {notification.message.length > 100 
                                ? `${notification.message.substring(0, 100)}...` 
                                : notification.message}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {formatDate(notification.createdAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No notifications" 
                    secondary="You don't have any notifications in this category."
                  />
                </ListItem>
              )}
            </List>
          )}
        </CardContent>
      </Card>

      {/* View Notification Dialog */}
      <Dialog
        open={!!selectedNotification}
        onClose={handleCloseViewDialog}
        aria-labelledby="notification-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle id="notification-dialog-title">
              {selectedNotification.title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(selectedNotification.createdAt)}
                </Typography>
                <Chip 
                  label={selectedNotification?.notificationType?.toString().charAt(0)?.toUpperCase() + selectedNotification?.notificationType?.toString().slice(1)} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
              <DialogContentText>
                {selectedNotification.message}
              </DialogContentText>
              {selectedNotification.htmlContent && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    HTML Content:
                  </Typography>
                  <Box dangerouslySetInnerHTML={{ __html: selectedNotification.htmlContent }} />
                </Box>
              )}
              {selectedNotification.link && selectedNotification.link !== '#' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Link:
                  </Typography>
                  <a href={selectedNotification.link} target="_blank" rel="noopener noreferrer">
                    {selectedNotification.link}
                  </a>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog}>Close</Button>
              <Button 
                onClick={() => {
                  handleDeleteNotification(selectedNotification._id);
                  handleCloseViewDialog();
                }} 
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog
        open={openSendDialog}
        onClose={handleCloseSendDialog}
        aria-labelledby="send-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="send-dialog-title">
          Send New Notification
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Notification Type
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={sendType === 'broadcast' ? 'contained' : 'outlined'}
                startIcon={<BroadcastIcon />}
                onClick={() => setSendType('broadcast')}
              >
                Broadcast
              </Button>
              <Button
                variant={sendType === 'group' ? 'contained' : 'outlined'}
                startIcon={<GroupIcon />}
                onClick={() => setSendType('group')}
              >
                Group
              </Button>
              <Button
                variant={sendType === 'user' ? 'contained' : 'outlined'}
                startIcon={<PersonIcon />}
                onClick={() => setSendType('user')}
              >
                Individual User
              </Button>
            </Box>
          </Box>

          {sendType === 'user' && (
            <Autocomplete
              fullWidth
              options={users}
              value={users.find(user => user._id === newNotification.userId)}
              getOptionLabel={(option) => option.profile.fullname + ' - ' + option.email}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search User"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              slotProps={
                {
                  listbox: {
                    onScroll: handleScroll,
                    ref: listboxRef,
                    style: { maxHeight: 300, overflow: 'auto' },
                  }
                }
              }
              onChange={(event, value) => setNewNotification({...newNotification, userId: value?._id || ''})}
              onInputChange={(event, value) => handleSearchUsers(event, value)}
              sx={{ mb: 2 }}
            />
          )}

          {sendType === 'group' && (
            <FormControl fullWidth>
              <InputLabel id="group-name-label">Group Name</InputLabel>
              <Select
                labelId="group-name-label"
                id="group-name"
                label="Group Name"
                fullWidth
                variant="outlined"
                value={newNotification.groupName || ''}
                onChange={(e) => setNewNotification({...newNotification, groupName: e.target.value})}
                sx={{ mb: 2 }}
              >
                {groups.map((group) => (
                  <MenuItem key={group._id} value={group._id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            autoFocus
            margin="dense"
            id="notification-title"
            label="Notification Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newNotification.title}
            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="notification-message"
            label="Message"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={newNotification.message}
            onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <HTMLEditor
            field="htmlContent"
            value={newNotification.htmlContent}
            handleProblemChange={(value) => setNewNotification({...newNotification, htmlContent: value})}
          />
          
          <TextField
            margin="dense"
            id="notification-link"
            label="Link (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={newNotification.link}
            onChange={(e) => setNewNotification({...newNotification, link: e.target.value})}
            sx={{ mb: 2 }}
            helperText="URL that users will be directed to when clicking the notification"
          />

          <FormControlLabel
            control={
              <Switch
                checked={newNotification.isEmail}
                onChange={(e) => setNewNotification({...newNotification, isEmail: e.target.checked})}
                name="isEmail"
              />
            }
            label="Send as Email also"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSendDialog} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSendNotification} 
            variant="contained"
            disabled={
              loading || 
              !newNotification.title || 
              !newNotification.message || 
              (sendType === 'user' && !newNotification.userId) ||
              (sendType === 'group' && !newNotification.groupName)
            }
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={openSettingsDialog}
        onClose={handleCloseSettingsDialog}
        aria-labelledby="settings-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="settings-dialog-title">
          Notification Settings
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Configure how notifications are processed and displayed in the admin panel.
          </DialogContentText>
          
          <Typography variant="subtitle2" gutterBottom>
            Email Notifications
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip label="Feature coming soon" color="primary" size="small" />
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Push Notifications
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip label="Feature coming soon" color="primary" size="small" />
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Notification Categories
          </Typography>
          <Box>
            <Chip label="Feature coming soon" color="primary" size="small" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsAdmin; 