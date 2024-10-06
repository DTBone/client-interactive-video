/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import { Avatar, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '~/store/userSlice';
import { useNavigate } from 'react-router-dom';

export default function AvatarProfile({user}) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
  }
  function stringAvatar(name) {
    name = name.toUpperCase();
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
      onClick: handleClick,
      onBlur: handleBlur
    };
  }
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    dispatch(logout());
    setOpen(false);
    navigate('/home');
}
    const handleProfile = () => {
      setOpen(false);
      navigate('/profile/' + user._id);
    }
    const handleBlur = () => {
      setOpen(false);
    }
  return (
    <div>
      {user.profile.picture ? <Avatar src={user.profile.picture} alt={user.username} onBlur={handleBlur} onClick={handleClick}/> : <Avatar {...stringAvatar(user.username)} />}
      <Popper id={id} open={open} anchorEl={anchorEl} transition sx={{ zIndex:'1203', padding:'0' }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box sx={{ border: 'none', p: 1, 
                bgcolor: '#27BCEB', 
                display:'flex', 
                flexDirection:'column', 
                position:'relative', 
                zIndex:'1',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                borderRadius: '5px',
                padding: '10px',
                marginTop: '6px',
                minWidth: '150px',
                color: 'white',
                gap: '10px',
                }}>
            <Button variant='contained' onClick={handleProfile} >Profile</Button>
            <Button variant='contained' onClick={handleLogout} >Log Out</Button>
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
}