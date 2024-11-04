/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
  Box
} from '@mui/material';
import {
  Search as SearchIcon,
  Message as MessageIcon
} from '@mui/icons-material';

const UserList = ({socket}) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('users:online', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off('users:online');
    };
  }, [socket]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startDirectChat = (userId) => {
    socket.emit('conversation:join', {
      type: 'direct',
      participants: [socket.userId, userId]
    });
  };

  return (
    <Box className="h-full flex flex-col">
      <Box className="p-4 border-b">
        <TextField
          fullWidth
          size="small"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List className="flex-grow overflow-y-auto">
        {filteredUsers.map(user => (
          <ListItem key={user.id} className="hover:bg-gray-50">
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={user.online ? 'success' : 'default'}
              >
                <Avatar src={user.picture || undefined} />
              </Badge>
            </ListItemAvatar>
            
            <ListItemText
              primary={
                <Typography className="font-medium">
                  {user.username}
                </Typography>
              }
              secondary={
                !user.online && user.lastSeen
                  ? `Last seen ${new Date(user.lastSeen).toLocaleString()}`
                  : 'Online'
              }
            />

            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                onClick={() => startDirectChat(user.id)}
                className="text-blue-500"
              >
                <MessageIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserList;