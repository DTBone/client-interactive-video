/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import authService from '~/services/auth/authService';
import Badge from '@mui/material/Badge';
import { Notifications, School } from "@mui/icons-material";
import { api } from "~/Config/api.js";
import socketService from "~/Hooks/SocketService.js";
import NotificationMenu from "~/Components/Header/components/Notification/index.jsx";
import { useDispatch } from 'react-redux';

export default function AccountMenu({ user }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [unreadNotifications, setUnreadNotifications] = React.useState(0);
  const open = Boolean(anchorEl);
  const socket = socketService.connect('http://localhost:3000')
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const notificationOpen = Boolean(notificationAnchorEl);


  console.log('user', user);
  if (!user) {
    user = JSON.parse(localStorage.getItem('user'));
  }
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  const fetchNotifications = async () => {
    const result = await api.get('/notifications');
    // if(result.data.success){
    //   setNotifications(result.data.data);
    //   setUnreadNotifications(result.data.filter(notification => notification.read === false).length);
    // }
    if (result.data.success) {
      const notifications = result.data.data; // Assuming this is the array of notifications
      setNotifications(notifications);
      setUnreadNotifications(
        notifications.filter(notification => !notification.read).length
      );
    }
  }

  React.useEffect(() => {
    fetchNotifications();
  }, []);
  React.useEffect(() => {
    socket.emit('user:login', {
      userId: user._id,
      fullname: user?.profile?.fullname || "Chưa cập nhật",
      picture: user?.profile?.picture,
      role: 'student'
    });
    socket.on('notification:new', (data) => {
      console.log('data', data);
      setNotifications((prev) => [data, ...prev]);
      setUnreadNotifications(prevState => prevState + 1);
    })
  }, [socket]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (response.status === 'success') {
        // dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        await dispatch({ type: 'CLEAR_STORE' });
        handleClose();
        navigate('/signin');
      }
    }
    catch (error) {
      console.log(error);
    }
    
  }
  const handleProfile = () => {
    const user1 = JSON.parse(localStorage.getItem('user'));
    console.log('user', user1._id);

    navigate('/profile/' + user1._id);
    handleClose();
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <IconButton onClick={handleNotificationClick}>
        {unreadNotifications > 0 ? (
          <Badge color="secondary" variant="dot">
            <Notifications fontSize='large' />
          </Badge>
        ) : (
          <Notifications fontSize='large' />
        )}
      </IconButton>

      <NotificationMenu
        anchorEl={notificationAnchorEl}
        open={notificationOpen}
        onClose={handleNotificationClose}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar src={user?.profile?.picture} sx={{ width: 40, height: 40 }}></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <Avatar src={user?.profile?.picture} sx={{ width: 20, height: 20 }}></Avatar>
          Your Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/codespace')}>
          <ListItemIcon>
            <School fontSize="small" />
          </ListItemIcon>
          Codespaces
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
