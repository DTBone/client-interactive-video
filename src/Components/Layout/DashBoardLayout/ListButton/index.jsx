import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import RouteIcon from '@mui/icons-material/Route';
import MailIcon from '@mui/icons-material/Mail';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Search } from '@mui/icons-material';

function ListButton() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const userId = JSON.parse(user)?.userId;
  const url = window.location.pathname;

  const list = [
    { text: 'Home', url: '/homeuser' },
    { text: 'My Learning', url: '/my-learning' },
    { text: 'Road Map', url: '/roadmap' },
    { text: 'Search', url: '/search' },
  ];

  const [opened, setOpened] = useState(list.findIndex(e => e.url === url) || 0);

  const handleClick = (index) => {
    setOpened(index);
    navigate(list[index].url + (index === 0 ? `?userid=${userId}` : ''));
  };

  useEffect(() => {
    setOpened(list.findIndex(e => e.url === url) || 0);
  }, [url]);

  return (
    <List sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: '20px',
      whiteSpace: 'nowrap',
      width: '100%',
      bgcolor: 'background.paper',
      paddingLeft: "5%",
      paddingBottom: 0,
      marginBottom: 0,

    }}>
      {list.map((item, index) => (
        <ListItem key={item.text} disablePadding sx={{ width: 'auto' }}>
          <ListItemButton
            sx={{
              padding: '10px 15px',
              borderBottom: opened === index ? '4px solid blue' : 'none',
              color: opened === index ? 'blue' : 'inherit',
              fontWeight: opened === index ? 'bold !important' : 'normal',
              '&:hover': {
                color: 'blue',
                backgroundColor: 'background.paper',

              }
            }}
            onClick={() => handleClick(index)}
          >
            <ListItemText primary={item.text} sx={{ textAlign: 'center' }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default ListButton;

