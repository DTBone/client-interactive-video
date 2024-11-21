/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import React from 'react';
import '~/index.css'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import Header from '~/components/Header';
import ListButton from './ListButton';
import userService from '~/services/api/userService';
import ErrorModal from '~/pages/ErrorModal';
import ListButtonAdmin from './ListButtonAdmin';
import backgroundGif from '~/assets/backgroundBlind.jpg';

const drawerWidth = 260;



const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(2)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '41px 8px',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  zIndex: 999,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundImage: 'linear-gradient(to right, #3b82f6, #2dd4bf)',
  backgroundColor: 'transparent',
  height: '80px',
  padding: '0 !important',
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  const token = localStorage.getItem('token');
  const [error, setError] = React.useState(null);
  var user = null
  if (!user) {
    const localUser = localStorage.getItem('user');
    console.log(localUser);
    user = localUser ? JSON.parse(localUser) : null;
  }
  
  // Re-run if `userId` changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(userId, token);
        localStorage.setItem('user', JSON.stringify(data)); 
         // Set the user data
      } catch (err) {
        setError(err.message);
      }
    };
    if (userId && !user) {
      fetchUser();  // Gọi hàm fetchUser khi userId tồn tại
    }
  }, [userId, user, token, open]);
  const handleDrawerOpen = () => {
    setOpen(!open);
  };
  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };
  return (
    <Box sx={{ display: 'flex' }}>
      <ErrorModal error={error}/>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 2,
              
            }}
          >
            {!open ? <MenuIcon fontSize="large" /> : <MenuOpenIcon fontSize="large" />}
          </IconButton>
          <Header className='h-4' isLogin={true} user={user} />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
        </DrawerHeader>
        <Divider />
        {user.role !== 'admin' ? <ListButton /> : <ListButtonAdmin />}
      </Drawer>
      <Box component="main" sx={{
        flexGrow: 1, p: 3,
        backgroundImage: `url(${backgroundGif})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}>
        <DrawerHeader />
        <div
        style={{
          // height: 'calc(100vh - 130px)',
          height: 'auto',
          width: '100%',
          transform: open == true ? 'translateX(0)' : 'translateX(0)',
          transition: 'all 0.5s',
        }}
        >
        {React.cloneElement(children, { user } )}
        </div>
      </Box>
    </Box>
  );
}
