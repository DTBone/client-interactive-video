import React from 'react';
import {
    Menu,
    MenuItem,
    Typography,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Box,
} from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import {api} from "~/Config/api.js";

const NotificationMenu = ({ anchorEl, open, onClose, notifications = [], setNotifications }) => {
    const navigate = useNavigate();
    const handleNotificationClick =async (notification) => {
        // Xử lý khi click vào notification
        // Đánh dấu notification đã đọc
        const result = await api.put(`/notifications/${notification._id}`, { read: true });
        if (result.data.success) {
            // Cập nhật lại danh sách notifications
            setNotifications((notifications) =>
                notifications.map((n) =>
                    n._id === notification._id ? { ...n, read: true } : n
                )
            );
        }
        if (notification.link) {
            navigate(notification.link);
        }
        onClose();
    };
    console.log('notifications', notifications)

    return (
        <Menu
            anchorEl={anchorEl}
            id="notification-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        maxHeight: 400,
                        width: 360,
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Typography variant="h6">Notifications</Typography>
            </Box>

            {notifications && notifications.length > 0 ? (
                notifications.map((notification) => (
                    <React.Fragment key={notification._id}>
                        <MenuItem
                            onClick={() => handleNotificationClick(notification)}
                            sx={{
                                py: 2,
                                px: 3,
                                backgroundColor: notification.read ? 'inherit' : 'action.hover',
                                '&:hover': {
                                    backgroundColor: 'action.selected',
                                },
                            }}
                        >
                            <ListItemAvatar>
                                {!notification.read && (
                                    <CircleIcon
                                        sx={{
                                            color: 'primary.main',
                                            fontSize: 12,
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                        }}
                                    />
                                )}
                                <Avatar>
                                    {notification.title?.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={notification.title}
                                secondary={
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {notification.message}
                                    </Typography>
                                }
                            />
                        </MenuItem>
                        <Divider />
                    </React.Fragment>
                ))
            ) : (
                <MenuItem disabled>
                    <Typography align="center" color="text.secondary">
                        No notifications
                    </Typography>
                </MenuItem>
            )}
        </Menu>
    );
};

export default NotificationMenu;