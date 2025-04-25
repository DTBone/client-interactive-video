import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  useTheme
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Close,
  Help
} from '@mui/icons-material';

/**
 * A reusable confirmation alert dialog component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls dialog visibility
 * @param {Function} props.onClose - Callback when dialog is closed without confirmation
 * @param {Function} props.onConfirm - Callback when user confirms the action
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message content
 * @param {string} props.confirmText - Text for confirm button (default: "Confirm")
 * @param {string} props.cancelText - Text for cancel button (default: "Cancel")
 * @param {string} props.type - Type of alert: "warning", "error", "info", "success" (default: "warning")
 * @param {boolean} props.disableBackdropClick - If true, clicking backdrop won't close the dialog
 * @param {boolean} props.showCancelButton - Whether to show the cancel button (default: true)
 */
const ConfirmAlert = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  disableBackdropClick = false,
  showCancelButton = true
}) => {
  const theme = useTheme();

  // Define colors and icons based on alert type
  const alertConfig = {
    warning: {
      icon: <Warning fontSize="large" />,
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
    },
    error: {
      icon: <Error fontSize="large" />,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light,
    },
    info: {
      icon: <Info fontSize="large" />,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light,
    },
    success: {
      icon: <CheckCircle fontSize="large" />,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
    },
    default: {
      icon: <Help fontSize="large" />,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light,
    }
  };

  // Get configuration based on type
  const currentConfig = alertConfig[type] || alertConfig.default;

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (!disableBackdropClick) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={disableBackdropClick ? undefined : onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          minWidth: '350px',
          maxWidth: '450px',
        }
      }}
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'text.secondary',
        }}
      >
        <Close />
      </IconButton>

      {/* Title section with icon */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 3,
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: currentConfig.bgColor,
            color: currentConfig.color,
          }}
        >
          {currentConfig.icon}
        </Box>
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: 'center',
            p: 0,
            fontWeight: 'bold',
          }}
        >
          {title}
        </DialogTitle>
      </Box>

      <Divider sx={{ mt: 1 }} />

      {/* Message content */}
      <DialogContent sx={{ pt: 2 }}>
        <DialogContentText 
          id="alert-dialog-description"
          sx={{ 
            textAlign: 'center',
            color: 'text.primary' 
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      {/* Action buttons */}
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
        {showCancelButton && (
          <Button
            onClick={onClose}
            color="inherit"
            variant="outlined"
            sx={{
              minWidth: '100px',
              borderRadius: '8px',
            }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          color={type === 'default' ? 'primary' : type}
          variant="contained"
          autoFocus
          sx={{
            minWidth: '100px',
            borderRadius: '8px',
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmAlert;
