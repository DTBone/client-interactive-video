import { useEffect, useState } from 'react';
import { Box, Paper, Grid2 as Grid } from '@mui/material';
import ConversationList from '../ConversationList';
import ChatWindow from '../ChatWindow';
import UserList from '../UserList';
import SocketService from '~/hooks/SocketService';

const ChatContainer = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const userId = JSON.parse(localStorage.getItem('user'))?._id;
  let socket = SocketService.connect('http://localhost:3000');

  useEffect(() => {
    console.log('User ID:', userId, socket.socket?.id);
    if (!socket || !userId) return
    // Đăng nhập socket khi component mount
    socket.emit('user:login', {
      userId,
      username: JSON.parse(localStorage.getItem('user'))?.profile.full_name || JSON.parse(localStorage.getItem('user'))?.profile.fullname,
      picture: JSON.parse(localStorage.getItem('user'))?.profile?.picture
    });
    
    
    return () => {
      // Đăng xuất socket khi component unmount
      socket.emit('user:logout', { userId });
      socket.disconnect();
    };
  }, [socket, userId]);
  
  return (
    <Box className="bg-gray-100" sx={{
        height: 'calc(100vh - 130px)',
    }}>
      <Grid container className="h-full p-4">
        <Grid item size={2} className="pr-2">
          <Paper className="h-full">
            <ConversationList 
              onSelectConversation={setActiveConversation}
              activeConversation={activeConversation}
              socket={socket.socket}
            />
          </Paper>
        </Grid>
        
        <Grid item size={8} className="px-2">
          <Paper className="h-full w-full">
            {activeConversation ? (
              <ChatWindow conversation={activeConversation} socket={socket.socket} userId={userId}/>
            ) : (
              <Box className="h-full flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item size={2} className="pl-2">
          <Paper className="h-full">
            <UserList socket={socket.socket}/>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatContainer;