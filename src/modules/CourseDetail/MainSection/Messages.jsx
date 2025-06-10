/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import {
    Send,
    User,
    Clock,
    MoreVertical,
    Circle
} from 'lucide-react';
import socketService from '~/Hooks/SocketService';
import { useSelector, useDispatch } from 'react-redux';
import { createConversation, getConversationByFilter, getMessagesByConversationId } from '~/store/slices/Conversation/action';
import { Box, Zoom } from '@mui/material';
import TypingIndicatorWithDots from '~/modules/Chat/TypingDot';

const Messages = () => {
    const { currentCourse } = useSelector((state) => state.course);
    console.log(currentCourse);
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    const [conversation, setConversation] = useState(null);
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            _id: 1,
            senderId: '67149a012b0afe90194e382c',
            content: 'Welcome to the Python Beginner course! Feel free to ask any questions.',
            createdAt: '2024-01-15T10:30:00Z',
            type: 'text'
        },
        // {
        //     _id: 2,
        //     senderId: userId,
        //     content: 'Can you explain more about list comprehensions?',
        //     createdAt: '2024-01-15T11:45:00Z',
        //     type: 'user'
        // }
    ]);
    const courseId = currentCourse?._id;
    const instructorId = currentCourse?.instructor._id;
    const [limit, setLimit] = useState(50);
    const [page, setPage] = useState(1);
    
    let socket = socketService.connect(`${import.meta.env.VITE_URL_SERVER}`);
    const scrollToBottom = () => {
        messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
      };
    const onTyping = () => {
        socket.emit('conversation:typing', conversation._id );
    }
    const onStopTyping = () => {
        socket.emit('conversation:stop_typing', conversation._id );
    }
    const createCon = async () => {
        const participants = [userId, instructorId];
        // Create conversation on server
        const data = await dispatch(createConversation({ participants, courseId }));
        if(data.meta.requestStatus === 'fulfilled') {
            setConversation(data.payload.data);
            getMessages(data.payload.data._id);
        }
    }
    const getMessages = async (conversationId) => {
        // Get messages from server
        const data = await dispatch(getMessagesByConversationId({ conversationId, limit, page}));
        if(data.meta.requestStatus === 'fulfilled') {
            setMessages((prev) => [...prev, ...data.payload.data]);
            setTimeout(scrollToBottom, 100);
        }
    }
    const getConversation = async () => {
        const participants = userId + "," + instructorId;
        // Get conversation from server
        const data = await dispatch(getConversationByFilter({ participants, courseId }));
        if(data.meta.requestStatus === 'fulfilled') {
            setConversation(data.payload.data[0]);
            console.log('Conversation: ', data.payload.data);
            getMessages(data.payload.data[0]._id);

        }
        else {
            console.log('Error: ', data.error);
            createCon();

        }
    
    }
    useEffect(() => { // Check conversation is existed or not
        getConversation();
             
    }, []);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!socket || !conversation) return;
        socket.emit('user:login', {
            userId,
            fullname: JSON.parse(localStorage.getItem('user'))?.profile.fullname,
            picture: JSON.parse(localStorage.getItem('user'))?.profile?.picture,
            role: 'student'
            });
        // Join conversation và lấy tin nhắn từ server
        socket.emit('conversation:join',  
          conversation._id
        );
        console.log('Join conversation', conversation._id);
    
        // Lắng nghe tin nhắn mới
        socket.on('conversation:new_message', (message) => {
          setMessages(prev => [...prev, message]);
          console.log('New message:', message);
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
          socket.emit('conversation:leave', {
            conversationId: conversation._id
          })
          socket.off('conversation:new_message');
          setMessages([]);
        };
      }, [conversation, socket]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // const message = {
            //     id: new Date().getTime(),
            //     sender: userId,
            //     content: newMessage,
            //     timestamp: new Date().toISOString(),
            //     type: 'text'
            // };
            setTimeout(scrollToBottom, 100);
            socket.emit('conversation:send_message', {
                conversationId: conversation._id,
                content: newMessage,
                });
            setNewMessage('');
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            {/* Messages Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <User className="w-6 h-6 text-blue-500" />
                    <h2 className="font-semibold text-gray-800">Course Discussions</h2>
                </div>
                <MoreVertical className="text-gray-500 cursor-pointer" />
            </div>

            {/* Messages List */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message?._id}
                        className={`flex ${message?.senderId?._id === userId
                            ? 'justify-end'
                            : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-lg ${message?.senderId?._id === userId
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm">
                                    {message?.senderId._id === userId ? 'You' : 'Instructor'}
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

            {/* Message Input */}
            <div className="p-4 border-t flex space-x-2 text-white">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    onFocus={onTyping}
                    onBlur={onStopTyping}
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default Messages;