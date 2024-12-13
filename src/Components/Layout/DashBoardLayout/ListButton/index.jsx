import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RouteIcon from '@mui/icons-material/Route';
import MailIcon from '@mui/icons-material/Mail';
import RateReviewIcon from '@mui/icons-material/RateReview';
import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { Search } from '@mui/icons-material';
function ListButton() {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');
    const userId = JSON.parse(user)?.userId;
    const url = window.location.pathname;

//     const list = ['Home', 'Road Map', 'Message', 'Blogs'];
//     const icons = [
//     <HomeIcon key={0} fontSize='large' color='primary'/>, 
//     <RouteIcon key={0} fontSize='large' color='primary'/>, 
//     <MailIcon key={0} fontSize='large' color='primary'/>, 
//     <RateReviewIcon key={0} fontSize='large' color='primary'/>
// ];
    const list =[
      {
        text: 'Home',
        icon: <HomeIcon key={0} fontSize='large' color='primary'/>,
        url: '/homeuser'
      },
      {
        text: 'Road Map',
        icon: <RouteIcon key={0} fontSize='large' color='primary'/>,
        url: '/roadmap'
      },
      {
        text: 'Message',
        icon: <MailIcon key={0} fontSize='large' color='primary'/>,
        url: '/chat'
      },
      {
        text: 'Blogs',
        icon: <Search key={0} fontSize='large' color='primary'/>,
        url: '/blogs'
      }
    ]
    const [opened, setOpened] = useState(list.find(e => e.url == url) ? list.findIndex(e => e.url == url) : 0);
    const handleClick = (index) => {
        setOpened(index);
        if(index === 0){
            navigate('/homeuser?userid=' + userId);
        }
        if(index === 1){
            navigate('/roadmap');
        }
        if(index === 2){
            navigate('/chat');
        }
        if(index === 3){
            navigate('/blogs');
        }

    }
    useEffect(() => {
        setOpened(list.find(e => e.url == url) ? list.findIndex(e => e.url == url) : 0);
    }, [url]);

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

export default ListButton;