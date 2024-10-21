/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import React from 'react';
import '~/index.css'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';

import Header from '~/components/Header';
import userService from '~/services/api/userService';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '~/store/userSlice';
import ErrorModal from '~/pages/ErrorModal';



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



export default function MiniDrawer({ children }) {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  const token = localStorage.getItem('token');
  const [error, setError] = React.useState(null);
  const dispatch = useDispatch();
  var user = null  // Lấy user từ Redux store
  if (!user) {
    const localUser = localStorage.getItem('user');
    user = localUser ? JSON.parse(localUser) : null;
  }
  
  // Re-run if `userId` changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(userId, token);
        dispatch(setUser(data)); 
         // Set the user data
      } catch (err) {
        setError(err.message);
      }
    };
    if (userId && !user) {
      fetchUser();  // Gọi hàm fetchUser khi userId tồn tại
    }
  }, [userId, user, dispatch, token]);

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };
  return (
    <Box sx={{ display: 'flex' }}>
      <ErrorModal error={error}/>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          
          <Header className='h-4' isLogin={true} user={user} />
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div className='h-screen'
        style={{
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
