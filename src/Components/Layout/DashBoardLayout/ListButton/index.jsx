import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RouteIcon from '@mui/icons-material/Route';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MailIcon from '@mui/icons-material/Mail';
import RateReviewIcon from '@mui/icons-material/RateReview';
import List from '@mui/material/List';
import { useState } from 'react';
function ListButton() {
    const list = ['Your Courses', 'Road Map', 'Message', 'Blogs'];
    const icons = [
    <AutoStoriesIcon key={0} fontSize='large' color='primary'/>, 
    <RouteIcon key={0} fontSize='large' color='primary'/>, 
    <MailIcon key={0} fontSize='large' color='primary'/>, 
    <RateReviewIcon key={0} fontSize='large' color='primary'/>
];
    const [opened, setOpened] = useState(-1);
    const handleClick = (index) => {
        setOpened(index);
    }
    return ( 
        <List>
          {list.map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                selected={opened === index}
                onClick={() => handleClick(index)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {icons[index]}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
     );
}

export default ListButton;