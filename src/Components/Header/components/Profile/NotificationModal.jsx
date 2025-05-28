/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Box, Chip } from '@mui/material';
import { formatDate } from '~/Utils/format.js';

function NotificationModal({ selectedNotification, handleCloseViewDialog }) {
    return ( 
        <Dialog
        open={!!selectedNotification}
        onClose={handleCloseViewDialog}
        aria-labelledby="notification-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle id="notification-dialog-title">
              {selectedNotification.title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(selectedNotification.createdAt)}
                </Typography>
                <Chip 
                  label={selectedNotification?.type?.charAt(0)?.toUpperCase() + selectedNotification?.type?.slice(1)} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
              <DialogContentText>
                {selectedNotification.message}
              </DialogContentText>
              {selectedNotification.htmlContent && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    HTML Content:
                  </Typography>
                  <Box dangerouslySetInnerHTML={{ __html: selectedNotification.htmlContent }} />
                </Box>
              )}
              {selectedNotification.link && selectedNotification.link !== '#' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Link:
                  </Typography>
                  <a href={selectedNotification.link} target="_blank" rel="noopener noreferrer">
                    {selectedNotification.link}
                  </a>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
     );
}

export default NotificationModal;