/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Badge, Box } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { formatDate } from '~/Utils/format.js';

function NotificationListModal({ open, notifications, onClose, onSelectNotification }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Notifications</DialogTitle>
      <DialogContent>
        {notifications && notifications.length > 0 ? (
          <List>
            {notifications.map((notification, idx) => (
              <ListItem button key={notification._id || idx} onClick={() => onSelectNotification(notification)} alignItems="flex-start">
                <ListItemAvatar>
                  <Badge color="secondary" variant={notification.read ? undefined : 'dot'}>
                    <Avatar>
                      <Notifications />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {notification.message}
                      </Typography>
                      <Box component="span" sx={{ display: 'block', color: 'text.secondary', fontSize: 12 }}>
                        {formatDate(notification.createdAt)}
                      </Box>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">No notifications.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NotificationListModal;
