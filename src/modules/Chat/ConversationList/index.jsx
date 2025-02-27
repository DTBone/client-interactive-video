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
  InputAdornment,
} from '@mui/material';
import { Group as GroupIcon, Person as PersonIcon } from '@mui/icons-material';
import { SearchIcon } from 'lucide-react';
import useDebounce from "~/hooks/useDebounce.js";
import {api} from "~/Config/api.js";
import SearchUsersPopper from "~/modules/Chat/SearchUser/index.jsx";

const ConversationList = ({ onSelectConversation, activeConversation, socket }) => {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))?._id;
  const searchDebounce = useDebounce(searchQuery, 500);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const getConversations = async () => {
    const res = await api.get(`/conversations?userId=${userId}`);
    console.log(res);
    if(res?.data?.success === true)
    {
      setConversations(res.data.data);
    }
    else {
      console.error(res.meta.requestStatus);
    }
  };
  useEffect(() => {
    getConversations();
  }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on('conversation:unread_message', (message) => {
      console.log('conversation:unread_message', message);
      if(message.conversationId !== activeConversation?._id) {
        setConversations(prevConversations => 
          prevConversations.map(conv => {
            if (conv._id === message.conversationId) {
              return {
                ...conv,
                lastMessage: message,
                unReadCounts: conv.unReadCounts ? conv.unReadCounts + 1 : 1,
              };
            }
            return conv;
          })
        );
        setConversations(prevConversations => prevConversations.sort((a, b) => {
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        }));
      }
    })

    return () => {
      socket.off('conversation:unread_message');
      socket.off('conversation:new_message');
    }
  }, [socket, conversations, activeConversation]);
//   useEffect(() => {
//     if (!socket) return;

//     // Lắng nghe tin nhắn mới để cập nhật lastMessage
//     socket.on('message:new', ({message}) => {
//       setConversations(prevConversations =>
//           prevConversations.map(conv => {
//             if (conv._id === message.conversationId) {
//               return {
//                 ...conv,
//                 lastMessage: message
//               };
//             }
//             return conv;
//           })
//       );
//     });
//     socket.on('conversation:list', (conversations) => {
//       setConversations(conversations);
//     })
//     socket.on('conversation:update', (conversation) => {
//       setConversations(prevConversations =>
//       prevConversations.map(conv => {
//           if (conv._id === conversation._id) {
//             return conversation;
//           }
//           return conv;
//         }))
//       console.log('conversation:update', conversation);
//     })
//     // socket.on('notification:new', (notification) => {
//     //   console.log('New notification1', notification);
//     //   setNotifications(prev => [notification, ...prev]);
//     //   setConversations(prevConversations => 
//     //     prevConversations.map(conv => {
//     //       if (conv._id === notification.conversationId) {
//     //         return {
//     //           ...conv,
//     //           unreadCount: conv.unreadCount ? conv.unreadCount + 1 : 1,
//     //           lastMessage: notification.message.content
//     //         };
//     //       }
//     //       return conv;
//     //     })
//     //   );
//   //
//   // });
//   return () => {
//     socket.off('message:new');
//     socket.off('conversation:list');
//   };
// }, [socket]);
  // Hàm tìm kiếm
  useEffect(() => {
    if (!searchDebounce) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    api.get(`/users?limit=9&&fullname=${searchDebounce}`)
        .then((res) => {
          setSearchResults(res.data.data.users);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsSearching(false);
        });
  }, [searchDebounce]);
  const getConversationTitleAndImage = (conversation) => {
    if (conversation.type === 'group') {
      return conversation.metadata.name;
    }
    // For direct messages, show the other participant's name
    const otherParticipant = conversation.participants.find(p => p._id !== userId);
    otherParticipant?.profile?.full_name ? otherParticipant.profile.full_name : 'Unknown';
    return otherParticipant
  };

  return (
    <Box className="h-full overflow-y-auto" >
      <Box className="p-4 border-b">
        <TextField
            fullWidth
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setAnchorEl(e.currentTarget);
            }}
            InputProps={{
              startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
              ),
            }}
        />

        <SearchUsersPopper
            anchorEl={anchorEl}
            searchResults={searchResults}
            onSelectUser={onSelectConversation}
            loading={isSearching}
            open={Boolean(anchorEl) && searchQuery.length > 0}
            onClose={() => setAnchorEl(null)}
        />
      </Box>
    <List className="h-full overflow-y-auto">
      {conversations.map((conversation, index) => (
        <ListItem
          key={index}
          button
          sx={{
            backgroundColor: `${activeConversation?._id === conversation._id ? 'rgba(0,0,0,0.1)' : 'white'}`,
          }}
          onClick={() => {
            onSelectConversation(conversation);
            setConversations((prev) => {
              return prev.map((conv) => {
                if (conv._id === conversation._id) {
                  return {
                    ...conv,
                    unReadCounts: 0,
                  };
                }
                return conv;
              });
            });
          }}
          className={`hover:bg-gray-100 ${
            conversation.unReadCountss > 0 ? 'bg-blue-50' : ''
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
                {getConversationTitleAndImage(conversation)?.profile?.picture ? (
                  <Avatar src={getConversationTitleAndImage(conversation)?.profile?.picture} />
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
                {getConversationTitleAndImage(conversation)?.profile?.full_name || getConversationTitleAndImage(conversation)?.profile?.fullname + ' - ' + conversation.courseId.title}
              </Typography>
            }
            secondary={
              <Typography noWrap variant="body2"
              sx={{
                fontWeight: `${conversation.unReadCounts > 0 ? '700' : '400'}`,
                color: `${conversation.unReadCounts > 0 ? 'black' : 'gray'}`,
              }}>
                {conversation.lastMessage ? conversation.lastMessage.senderId === userId ? 'You: ' + conversation.lastMessage?.content : conversation.lastMessage?.content : 'No messages'}
              </Typography>
            }
          />

          {conversation?.unReadCounts > 0 && (
            <Badge
              badgeContent={conversation.unReadCounts}
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