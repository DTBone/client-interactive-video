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
import backgroundGif from '~/assets/bg.jpg';
import Footer from '~/components/Footer';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ErrorModal error={error} />
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
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        position: "relative", // Để định vị overlay
        minHeight: "100vh",
        overflow: "hidden",
        marginTop: "130px",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundGif})`,
          backgroundSize: "300px",
          backgroundPosition: "center",
          opacity: 0.1, // Điều chỉnh độ mờ (0.1 - 1)
        },
      }}
    >
        {/* <DrawerHeader /> */}
        <div
          style={{
            // height: 'calc(100vh - 130px)',
            height: 'auto',
            width: '100%',
            transform: open == true ? 'translateX(0)' : 'translateX(0)',
            transition: 'all 0.5s',
          }}
        >
          {React.cloneElement(children, { user, search })}
        </div>
      </Box>
      <Footer />
    </Box>
  );
}
