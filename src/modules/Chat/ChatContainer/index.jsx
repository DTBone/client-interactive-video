import { useEffect, useState } from 'react';
import { Box, Paper, Grid2 as Grid } from '@mui/material';
import ConversationList from '../ConversationList';
import ChatWindow from '../ChatWindow';
import UserList from '../UserList';
import SocketService from '~/Hooks/SocketService';
import {api} from "~/Config/api.js";

const ChatContainer = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const userId = JSON.parse(localStorage.getItem('user'))?._id;
  let socket = SocketService.connect('http://localhost:3000');

  const handleSelecConversation = async (conversation) => {
    // const _id = conversation.username ? conversation._id : conversation.participants.find(p => p !== userId)._id;
    // console.log('Selected conversation:', conversation);
    // const getConversation = await api.get(`/conversations`, {
    //     params: {
    //         participants: `${_id},${userId}`
    //     }
    // });
    // if (getConversation.data.data.length === 0) {
    //     const newConversation = await api.post(`/conversations`, {
    //         participants: [_id, userId]
    //     });
    //     setActiveConversation(newConversation.data.data);
    //     socket.emit('conversation:recall', {userId});
    // } else {
    //     setActiveConversation(conversation);
    // }
    setActiveConversation(conversation);
  }

  useEffect(() => {
    console.log('User ID:', userId, socket.socket?.id);
    if (!socket || !userId) return
    // Đăng nhập socket khi component mount
    socket.emit('user:login', {
      userId,
      fullname: JSON.parse(localStorage.getItem('user'))?.profile.full_name || JSON.parse(localStorage.getItem('user'))?.profile.fullname,
      picture: JSON.parse(localStorage.getItem('user'))?.profile?.picture,
      role: 'instructor'
    });
    
    
    return () => {
      // Đăng xuất socket khi component unmount
      socket.emit('user:logout', { userId });
      socket.disconnect();
    };
  }, [socket, userId]);
  
  return (
    <Box className="bg-gray-100" sx={{
        maxHeight: 'calc(100vh)',
        width: '100%',
    }}>
      <Grid container className="p-4 h-full">  
        <Grid item size={3} className="pr-2">
          <Paper className="h-[calc(100vh-64px)]">
            <ConversationList 
              onSelectConversation={handleSelecConversation}
              activeConversation={activeConversation}
              socket={socket.socket}
            />
          </Paper>
        </Grid>
        
        <Grid item size={9} className="px-2">
          <Paper className="h-[calc(100vh-64px)] w-full">
            {activeConversation ? (
              <ChatWindow conversation={activeConversation} socket={socket.socket} userId={userId}/>
            ) : (
              <Box className="h-full flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </Box>
            )}
          </Paper>
        </Grid>

        {/* <Grid item size={2} className="pl-2">
          <Paper className="h-full">
            <UserList socket={socket.socket}/>
          </Paper>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default ChatContainer;