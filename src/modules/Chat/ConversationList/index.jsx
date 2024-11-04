/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Box,
  TextField,
  InputAdornment, Dialog, Popover,
} from '@mui/material';
import { Group as GroupIcon, Person as PersonIcon } from '@mui/icons-material';
import { SearchIcon } from 'lucide-react';

const ConversationList = ({ onSelectConversation, activeConversation, socket }) => {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))?._id;
  useEffect(() => {
    if (!socket) return;

    // Lắng nghe tin nhắn mới để cập nhật lastMessage
    socket.on('message:new', ({message}) => {
      setConversations(prevConversations =>
          prevConversations.map(conv => {
            if (conv._id === message.conversationId) {
              return {
                ...conv,
                lastMessage: message
              };
            }
            return conv;
          })
      );
    });
    socket.on('conversation:list', (conversations) => {
      setConversations(conversations);
    })
    socket.on('conversation:update', (conversation) => {
      setConversations(prevConversations =>
      prevConversations.map(conv => {
          if (conv._id === conversation._id) {
            return conversation;
          }
          return conv;
        }))
      console.log('conversation:update', conversation);
    })
    // socket.on('notification:new', (notification) => {
    //   console.log('New notification1', notification);
    //   setNotifications(prev => [notification, ...prev]);
    //   setConversations(prevConversations => 
    //     prevConversations.map(conv => {
    //       if (conv._id === notification.conversationId) {
    //         return {
    //           ...conv,
    //           unreadCount: conv.unreadCount ? conv.unreadCount + 1 : 1,
    //           lastMessage: notification.message.content
    //         };
    //       }
    //       return conv;
    //     })
    //   );
  //
  // });
  return () => {
    socket.off('message:new');
    socket.off('conversation:list');
  };
}, [socket]);
  // Hàm tìm kiếm
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setIsSearchOpen(true);
      const results = conversations.filter(conversation => {
        const title = conversation.type === 'group'
            ? conversation.metadata.name
            : getConversationTitleAndImage(conversation).profile.full_name;
        return title.toLowerCase().includes(query.toLowerCase());
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };
  const getConversationTitleAndImage = (conversation) => {
    if (conversation.type === 'group') {
      return conversation.metadata.name;
    }
    // For direct messages, show the other participant's name
    const otherParticipant = conversation.participants.find(p => p._id !== userId);
    otherParticipant.profile.full_name ? otherParticipant.profile.full_name : 'Unknown';
    return otherParticipant
  };

  return (
    <Box className="h-full overflow-y-auto" >
      <Box className="p-4 border-b">
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversation..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          slotProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
      
      {/* Popup tìm kiếm */}
      <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={isSearchOpen} onClose={() => setIsSearchOpen(false)} maxWidth="sm" fullWidth>
        <List>
          {searchResults.length > 0 ? (
              searchResults.map((conversation, index) => (
                  <ListItem
                      key={index}
                      button
                      onClick={() => {
                        onSelectConversation(conversation);
                        setIsSearchOpen(false);
                      }}
                  >
                    <ListItemAvatar>
                      {conversation.type === 'group' ? (
                          <Avatar className="bg-purple-500">
                            <GroupIcon />
                          </Avatar>
                      ) : (
                          <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              variant="dot"
                              color={conversation.isOnline ? 'success' : 'default'}
                          >
                            {getConversationTitleAndImage(conversation).profile.picture ? (
                                <Avatar src={getConversationTitleAndImage(conversation).profile.picture} />
                            ) : (
                                <Avatar>
                                  <PersonIcon />
                                </Avatar>
                            )}
                          </Badge>
                      )}
                    </ListItemAvatar>

                    <ListItemText
                        primary={
                          <Typography noWrap className="font-medium">
                            {getConversationTitleAndImage(conversation).profile.full_name || 'Unknown'}
                          </Typography>
                        }
                        secondary={
                          <Typography noWrap variant="body2" color="textSecondary">
                            {conversation.lastMessage ? conversation.lastMessage.content : 'No messages'}
                          </Typography>
                        }
                    />
                  </ListItem>
              ))
          ) : (
              <Typography className="p-4 text-gray-500">No results found</Typography>
          )}
        </List>
      </Popover>
      </Box>
    <List className="h-full overflow-y-auto">
      {conversations.map((conversation, index) => (
        <ListItem
          key={index}
          button
          selected={activeConversation?.id === conversation.id}
          onClick={() => {
            onSelectConversation(conversation);
          }}
          className={`hover:bg-gray-100 ${
            conversation.unreadCount > 0 ? 'bg-blue-50' : ''
          }`}
        >
          <ListItemAvatar>
            {conversation.type === 'group' ? (
              <Avatar className="bg-purple-500">
                <GroupIcon />
              </Avatar>
            ) : (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={conversation.isOnline ? 'success' : 'default'}
              >
                {getConversationTitleAndImage(conversation).profile.picture ? (
                  <Avatar src={getConversationTitleAndImage(conversation).profile.picture} />
                ) : (
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                )}
              </Badge>
            )}
          </ListItemAvatar>
          
          <ListItemText
            primary={
              <Typography noWrap className="font-medium">
                {getConversationTitleAndImage(conversation).profile.full_name || getConversationTitleAndImage(conversation).profile.fullname}
              </Typography>
            }
            secondary={
              <Typography noWrap variant="body2"
              sx={{
                fontWeight: `${conversation.unreadCount > 0 ? '700' : '400'}`,
                color: `${conversation.unreadCount > 0 ? 'black' : 'gray'}`,
              }}>
                {conversation.lastMessage ? conversation.lastMessage.senderId === userId ? 'You: ' + conversation.lastMessage?.content : conversation.lastMessage?.content : 'No messages'}
              </Typography>
            }
          />

          {conversation.unreadCount > 0 && (
            <Badge
              badgeContent={conversation.unreadCount}
              color="primary"
              className="ml-2"
            />
          )}
        </ListItem>
      ))}
    </List>
    </Box>
  );
};

export default ConversationList;