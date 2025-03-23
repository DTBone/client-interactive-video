/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Person,
  Videocam
} from '@mui/icons-material';
import { api } from '~/Config/api';
import TypingIndicatorWithDots from '../TypingDot';
import { Clock } from 'lucide-react';

const ChatWindow = ({ conversation, socket, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const getMessages = async () => {
    const response = await api.get(`/messages?conversationId=${conversation._id}&limit=${limit || 10}&page=${page || 1}`);
    if (response.data.success) {
      setMessages(response.data.data);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    if (!conversation) return;
    socket.emit('conversation:join',  
      conversation._id
    );
    console.log('Join conversation', conversation._id);
    getMessages();
  }, [conversation._id]);

  useEffect(() => {
    if (!socket || !conversation) return;
    socket.on('conversation:new_message', (message) => {
      setMessages(prev => [...prev, message]);
      setTimeout(scrollToBottom, 100);
    });

    socket.on('conversation:typing', (data) => {
      console.log('User is typing', data);
      if(data.userId !== userId) {
        setIsTyping(true);
      }
    });
    socket.on('conversation:stop_typing', (data) => {
      console.log('User stop typing', data);
      if(data.userId !== userId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('conversation:new_message');
      socket.off('conversation:typing');
      socket.off('conversation:stop_typing');
      socket.emit('conversation:leave', conversation._id);
      setMessages([]);
    };
  }, [conversation]);

  // useEffect(() => {
  //   if (!socket || !conversation) return;

  //   // Join conversation và lấy tin nhắn từ server
  //   socket.emit('conversation:join', { 
  //     conversationId: conversation._id
  //   });
  //   console.log('Join conversation', conversation._id);
  //   // Lắng nghe khi join thành công để lấy lịch sử tin nhắn
  //   socket.on('message:list', (messages) => {
  //     setMessages(messages || []);
  //     setTimeout(scrollToBottom, 100);
  //   });

  //   // Lắng nghe tin nhắn mới
  //   socket.on('message:new', ({ message }) => {
  //     setMessages(prev => [...prev, message]);
  //     setTimeout(scrollToBottom, 100);
  //   });

  //   return () => {
  //     socket.off('conversation:joined');
  //     socket.emit('conversation:out', {
  //       conversationId: conversation._id
  //     })
  //     socket.off('message:new');
  //   };
  // }, [socket, conversation]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    socket.emit('conversation:send_message', {
      conversationId: conversation._id,
      content: newMessage,
    });
    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // TODO: Implement file upload logic
  };

  const handleVideoCall = () => {
    const videoCallWindow = window.open(
        `/video-call?conversationId=${conversation._id}&userId=${userId}`,
        '_blank',
        'width=1200,height=800'
    );
    

    // Check if the window was opened successfully
    if (videoCallWindow) {
      videoCallWindow.focus();
    } else {
      alert("Please allow pop-ups to start a video call.");
    }
  };
  const onTyping = () => {
    socket.emit('conversation:typing', conversation._id );
}
const onStopTyping = () => {
    socket.emit('conversation:stop_typing', conversation._id );
}
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
    });
};

  const getConversationTitleAndImage = (conversation) => {
    console.log('conversations', conversation);
    if (conversation.type === 'group') {
      return conversation.metadata.name;
    }
    // For direct messages, show the other participant's name
    const otherParticipant = conversation.participants.find(p => p._id !== userId);
    otherParticipant.profile.full_name ? otherParticipant.profile.full_name : 'Unknown';
    return otherParticipant
  };

  return (
    <Box className="h-full flex flex-col max-h-screen" >
      <AppBar position="static" color="default" elevation={1} sx={{
        zIndex: 1,
      }}>
        <Toolbar sx={{
          gap: 2,
        }}>
        {getConversationTitleAndImage(conversation).profile.picture ? (
                  <Avatar src={getConversationTitleAndImage(conversation).profile.picture} />
                ) : (
                  <Avatar>
                    <Person />
                  </Avatar>
                )}
          
          <Typography variant="h6" className="flex-grow">
            {getConversationTitleAndImage(conversation).profile.fullname  + ' - ' + conversation.courseId.title}
          </Typography>

          <IconButton onClick={handleVideoCall}>
            <Videocam />
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 text-lg">
                {messages.map((message) => (
                    <div
                        key={message?._id}
                        className={`flex ${message?.senderId._id === userId
                            ? 'justify-end'
                            : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-lg ${message?.senderId._id === userId
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm">
                                    {message?.senderId._id === userId ? 'You' : message?.senderId?.profile?.fullname}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatTimestamp(message?.createdAt)}
                                </span>
                            </div>
                            <p>{message?.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} >
                    {isTyping &&
                    (
                        <TypingIndicatorWithDots />
                    )}
                </div>
            </div>

      <Box className="p-4 border-t">
        <Box className="flex gap-2">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleSend()}
            size="small"
            onFocus={onTyping}
            onBlur={onStopTyping}
          />
          
          <IconButton
            component="label"
            className="text-gray-500"
          >
            <AttachFileIcon />
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            className="px-6"
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {conversation.type === 'group' && (
          <MenuItem onClick={() => {/* TODO: Show group info */}}>
            Group Info
          </MenuItem>
        )}
        <MenuItem onClick={() => {/* TODO: Search messages */}}>
          Search Messages
        </MenuItem>
        {conversation.type === 'group' && (
          <MenuItem onClick={() => {/* TODO: Leave group */}}>
            Leave Group
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ChatWindow;