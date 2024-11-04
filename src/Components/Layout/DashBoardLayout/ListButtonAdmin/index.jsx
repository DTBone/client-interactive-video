/* eslint-disable no-unused-vars */
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import List from '@mui/material/List';
import { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { AccountCircle, Book, School } from '@mui/icons-material';

function ListButtonAdmin() {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');
    const userId = JSON.parse(user).userId;
    const url = window.location.pathname;

    // const list = ['Home', 'Account Manager', 'Available Course', 'Intructor Manager', 'Message'];
    const list = [
      {
        text: 'Home',
        icon: <HomeIcon key={0} fontSize='large' color='primary'/>,
        url: '/admin'
      },
      {
        text: 'Account Manager',
        icon: <AccountCircle key={0} fontSize='large' color='primary'/>,
        url: '/account-manager'
      },
      {
        text: 'Available Course',
        icon: <Book key={0} fontSize='large' color='primary'/>,
        url: '/course-manager'
      },
      {
        text: 'Intructor Manager',
        icon: <School key={0} fontSize='large' color='primary'/>,
        url: '/instructor-manager'
      },
      {
        text: 'Message',
        icon: <MailIcon key={0} fontSize='large' color='primary'/>,
        url: '/chat'
      }
    ]
    const [opened, setOpened] = useState(list.find(e => e.url === url) ? list.findIndex(e => e.url === url) : 0);
    const handleClick = (index) => {
        setOpened(index);
        if(index === 0){
            navigate('/admin');
        }
        if(index === 1){
            navigate('/account-manager');
        }
        if(index === 2){
          navigate('/course-manager');
      }
      if(index === 3){
        navigate('/instructor-manager');

    }
    if(index === 4){
      navigate('/chat');
    }

    }
    return ( 
        <List>
          {list.map((text, index) => (
            <ListItem key={text.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor: opened === index ? 'rgb(0 0 0 / 20%)' : 'transparent',
                  ":hover": {
                    bgcolor: 'rgb(0 0 0 / 20%)'
                  }
                }}
                // selected={opened === index}
                onClick={() => handleClick(index)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {text.icon}
                </ListItemIcon>
                <ListItemText primary={text.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
     );
}

export default ListButtonAdmin;