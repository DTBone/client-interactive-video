import React, { useState } from 'react';
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
import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';

const NotificationDetail = ({ notification, open, onClose }) => {
    const [error, setError] = useState(null);

    React.useEffect(() => {
        console.log('notification', notification);
        if (!notification || !open) return;
        setError(null);
    }, [notification, open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        minWidth: 660,
                        maxWidth: 760,
                        minHeight: 400,
                        maxHeight: 400,
                    },
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                {error && <Typography color="error">{error}</Typography>}
                {notification && (
                    <>
                        <Typography variant="h6">{notification.title}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">{notification.message}</Typography>
                        {notification.htmlContent && (
                            <Box dangerouslySetInnerHTML={{ __html: notification.htmlContent }} />
                        )}
                    </>
                )}
            </Box>
        </Dialog>
    );
};

NotificationDetail.propTypes = {
    notification: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

const NotificationMenu = ({ anchorEl, open, onClose, notifications = [], onSelectNotification }) => {
    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        if (onSelectNotification) onSelectNotification(notification);
        onClose();
    };

    const handleDetailClose = () => {
        setSelectedNotification(null);
        onClose(); // Đóng luôn menu khi đóng detail
    };

    return (
        <>
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
                            mt: 5,
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
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
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
            <NotificationDetail
                notification={selectedNotification}
                open={Boolean(selectedNotification)}
                onClose={handleDetailClose}
            />
        </>
    );
};

NotificationMenu.propTypes = {
    anchorEl: PropTypes.any,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    notifications: PropTypes.array,
    onSelectNotification: PropTypes.func,
};

export default NotificationMenu;