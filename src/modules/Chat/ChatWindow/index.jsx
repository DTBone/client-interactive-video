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

const ChatWindow = ({ conversation, socket, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket || !conversation) return;

    // Join conversation và lấy tin nhắn từ server
    socket.emit('conversation:join', { 
      conversationId: conversation._id
    });
    console.log('Join conversation', conversation._id);
    // Lắng nghe khi join thành công để lấy lịch sử tin nhắn
    socket.on('message:list', (messages) => {
      setMessages(messages || []);
      setTimeout(scrollToBottom, 100);
    });

    // Lắng nghe tin nhắn mới
    socket.on('message:new', ({ message }) => {
      setMessages(prev => [...prev, message]);
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      socket.off('conversation:joined');
      socket.emit('conversation:out', {
        conversationId: conversation._id
      })
      socket.off('message:new');
    };
  }, [socket, conversation]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    socket.emit('message:send', {
      conversationId: conversation._id,
      content: newMessage,
      type: 'text'
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
        `/video-call?conversationId=${conversation._id}`,
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
    <Box className="h-full flex flex-col" >
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
            {getConversationTitleAndImage(conversation).profile.fullname ? getConversationTitleAndImage(conversation).profile.fullname: 'Unknown'}
          </Typography>

          <IconButton onClick={handleVideoCall}>
            <Videocam />
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box className="flex-grow p-4"
      sx={{
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 340px)',
      }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            className={`flex mb-4 ${
              message.senderId === userId ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.senderId !== userId && (
              <Avatar
                src={conversation.participants.find(p => p._id === message.senderId)?.profile.picture}
                className="mr-2 w-8 h-8"
              />
            )}
            
            <Box
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography
                variant="caption"
                className="mt-1 opacity-70"
              >
                {new Date(message.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

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