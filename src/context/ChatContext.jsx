// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/prop-types */
// import { createContext, useContext, useState, useEffect } from 'react';
// import SocketService from '../Hooks/SocketService';

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const socket = SocketService.connect('http://localhost:3000');

//   useEffect(() => {
//     if (!socket.socket) return;

//     socket.on('conversation:new', ({ conversation }) => {
//       setConversations(prev => [conversation, ...prev]);
//     });

//     socket.on('message:new', ({ message, conversationId }) => {
//       // Cập nhật số tin nhắn chưa đọc
//       if (activeConversation?.id !== conversationId) {
//         setUnreadCounts(prev => ({
//           ...prev,
//           [conversationId]: (prev[conversationId] || 0) + 1
//         }));
//       }

//       // Cập nhật tin nhắn mới nhất của conversation
//       setConversations(prev =>
//         prev.map(conv =>
//           conv.id === conversationId
//             ? {
//                 ...conv,
//                 lastMessage: message,
//                 updatedAt: new Date()
//               }
//             : conv
//         )
//       );
//     });

//     return () => {
//       socket.off('conversation:new');
//       socket.off('message:new');
//     };
//   }, [socket, activeConversation]);

//   const value = {
//     conversations,
//     setConversations,
//     activeConversation,
//     setActiveConversation,
//     unreadCounts,
//     setUnreadCounts
//   };

//   return (
//     <ChatContext.Provider value={value}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };

// export { ChatProvider, useChat };