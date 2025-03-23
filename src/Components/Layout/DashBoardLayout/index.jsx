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



const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: '80px',
  padding: '0 !important',
}));

const NavBar = styled('nav')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between', // Changed from 'center' to 'space-between'
  alignItems: 'center',
  padding: '0px 20px', // Added horizontal padding for spacing from edges
  color: theme.palette.text.primary,
  backgroundColor: '#fffffa',
  borderBottom: '1px solid #ddd',
  flexDirection: 'row',
  width: '100%', // Ensure navbar takes full width
  marginBottom: '0px', // Ensure no margin at the bottom

}));



export default function MainDrawer({ children }) {
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  const token = localStorage.getItem('token');


  let user = localStorage.getItem('user');
  user = user ? JSON.parse(user) : null;

  // Re-run if `userId` changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(userId, token);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        setError(err.message);
      }
    };
    if (userId && !user) {
      fetchUser();
    }
  }, [userId, user, token]);



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: "20px" }}>
      <ErrorModal error={error} />
      <CssBaseline />
      <AppBar position="fixed" open={open}
        sx={{
          backgroundColor: '#C5FFFF',
          boxShadow: 'none',
          backgroundSize: 'cover',
        }}
      >
        <Toolbar sx={
          {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px 0px',
            height: '80px',
            backgroundColor: '#fffffa',

            boxShadow: 'none',
          }
        }>

          <Header className='h-4' isLogin={true} user={user} setSearch={setSearch} />
        </Toolbar>
        <NavBar>
          {user?.role !== 'admin' ? <ListButton /> : <ListButtonAdmin />}
        </NavBar>
        <Divider sx={{ marginTop: 0 }} />
      </AppBar>

      <Box component="main" sx={{
        flexGrow: 1,
        padding: "0 5%",
        backgroundColor: 'rgba(255, 255, 245 , 0.5)',
        marginTop: '140px',
      }}>
        {React.cloneElement(children, { user, search })}

      </Box>
    </Box>
  );
}
