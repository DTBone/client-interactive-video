import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  ColorLens as ThemeIcon,
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { api } from '~/Config/api';

const SettingsAdmin = () => {
  const [settings, setSettings] = useState({
    homepage_banner: {
      listImageUrl: [], // Mảng các url ảnh
      link: '', // Link của banner
      title: '', // Tiêu đề của banner
    },
    notification: {
      emailNotification: true, // Bật/tắt thông báo email
      notificationSound: true, // Bật/tắt âm thanh thông báo
      browserNotification: true, // Bật/tắt popup thông báo
    },
      appearance: {
        theme: 'light', // Chọn chế độ sáng/tối
        language: 'en', // Ngôn ngữ
      },
      security: {
        twoFactorAuth: false, // Bật/tắt 2FA
        autoLogout: 30, // Thời gian tự động đăng xuất
      },
      email: {
        emailSignature: 'Best regards, \nAdmin Team', // Chữ ký email
        copyAdminOnEmail: true, // Bật/tắt gửi email đến admin
      },
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        console.log(response.data);
        setSettings(response.data);
      } catch (error) {
        toast.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // State cho slider preview
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const handleChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const response = await api.put('/settings', settings);
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success',
      });
    } catch (error) {
      toast.error('Error saving settings:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Thêm hàm xử lý upload nhiều ảnh
  const handleBannerImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            resolve({ url: ev.target.result, name: file.name });
          };
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((images) => {
      handleChange('homepage_banner', {
        ...settings.homepage_banner,
        listImageUrl: [...settings.homepage_banner.listImageUrl, ...images],
      });
      setCurrentSlide(settings.homepage_banner.listImageUrl.length); // chuyển đến ảnh đầu tiên vừa thêm
    });
  };

  // Xóa ảnh khỏi slider
  const handleRemoveBannerImage = (idx) => {
    const newImages = settings.homepage_banner.listImageUrl.filter((_, i) => i !== idx);
    handleChange('homepage_banner', {
      ...settings.homepage_banner,
      listImageUrl: newImages,
    });
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Chuyển slide
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? settings.homepage_banner.listImageUrl.length - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === settings.homepage_banner.listImageUrl.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          Admin Settings
        </Typography>
      </Box>
      {/* Banner Settings */}
      <Box sx={{ mb: 3, border: '1px solid #e0e0e0', p: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Banner Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              fullWidth
            >
              Upload Banner Images (Ratio 3:1)
              <input
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={handleBannerImagesUpload}
              />
              <Chip
              sx={{
                position: 'absolute',
                top: -15,
                right: -20,
                backgroundColor: 'red',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              label={`${settings.homepage_banner.listImageUrl.length} / 5`} />
            </Button>
            {/* Slider preview */}
            {settings.homepage_banner.listImageUrl.length > 0 && (
              <Box sx={{ mt: 2, position: 'relative', textAlign: 'center' }}>
                <img
                  src={settings.homepage_banner.listImageUrl[currentSlide]?.url}
                  alt={`Banner Preview ${currentSlide + 1}`}
                  style={{ width: '100%', borderRadius: 8, maxHeight: 180, objectFit: 'cover' }}
                />
                {/* Slide controls */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                  <Button size="small" onClick={handlePrevSlide} disabled={settings.homepage_banner.listImageUrl.length < 2}>&lt;</Button>
                  <Typography variant="body2" sx={{ mx: 1 }}>
                    {currentSlide + 1} / {settings.homepage_banner.listImageUrl.length}
                  </Typography>
                  <Button size="small" onClick={handleNextSlide} disabled={settings.homepage_banner.listImageUrl.length < 2}>&gt;</Button>
                </Box>
                {/* Remove button */}
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => handleRemoveBannerImage(currentSlide)}
                >
                  Remove This Image
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              label="Banner Title"
              fullWidth
              sx={{ mb: 2 }}
              value={settings.homepage_banner.title}
              onChange={(e) =>
                handleChange('homepage_banner', {
                  ...settings.homepage_banner,
                  title: e.target.value,
                })
              }
            />
            <TextField
              label="Banner Description"
              fullWidth
              multiline
              rows={3}
              value={settings.homepage_banner.description}
              onChange={(e) =>
                handleChange('homepage_banner', {
                  ...settings.homepage_banner,
                  description: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Notification Settings (Coming Soon)
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive notifications by email"
                  />
                  <Switch
                    edge="end"
                    checked={settings.notification.emailNotification}
                    onChange={() => handleToggle('notification.emailNotification')}
                    inputProps={{
                      'aria-labelledby': 'switch-email-notifications',
                    }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Browser Notifications" 
                    secondary="Show notifications in browser"
                  />
                  <Switch
                    edge="end"
                    checked={settings.notification.browserNotification}
                    onChange={() => handleToggle('notification.browserNotification')}
                    inputProps={{
                      'aria-labelledby': 'switch-browser-notifications',
                    }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Notification Sound" 
                    secondary="Play sound when notification arrives"
                  />
                  <Switch
                    edge="end"
                    checked={settings.notification.notificationSound}
                    onChange={() => handleToggle('notification.notificationSound')}
                    inputProps={{
                      'aria-labelledby': 'switch-notification-sound',
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Security Settings (Coming Soon)
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Two-Factor Authentication" 
                    secondary="Require second factor for login"
                  />
                  <Switch
                    edge="end"
                    checked={settings.security.twoFactorAuth}
                    onChange={() => handleToggle('security.twoFactorAuth')}
                    inputProps={{
                      'aria-labelledby': 'switch-2fa',
                    }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Auto Logout" 
                    secondary="Automatically logout after period of inactivity"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.security.autoLogout}
                      onChange={(e) => handleChange('security.autoLogout', e.target.value)}
                      size="small"
                    >
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                      <MenuItem value={0}>Never</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThemeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Appearance Settings (Coming Soon)
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Language" 
                    secondary="Select your preferred language"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.appearance.language}
                      onChange={(e) => handleChange('appearance.language', e.target.value)}
                      size="small"
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="zh">Chinese</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <ThemeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Theme" 
                    secondary="Choose light or dark theme"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.appearance.theme}
                      onChange={(e) => handleChange('appearance.theme', e.target.value)}
                      size="small"
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System Default</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Email Settings (Coming Soon)
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Email Signature" 
                    secondary="Added to the bottom of outgoing emails"
                  />
                </ListItem>
                <ListItem sx={{ display: 'block' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={settings.email.emailSignature}
                    onChange={(e) => handleChange('email.emailSignature', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Copy Admin on Emails" 
                    secondary="Send a copy of outgoing emails to admin"
                  />
                  <Switch
                    edge="end"
                    checked={settings.email.copyAdminOnEmail}
                    onChange={() => handleToggle('email.copyAdminOnEmail')}
                    inputProps={{
                      'aria-labelledby': 'switch-copy-admin',
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          size="large"
        >
          Save All Settings
        </Button>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsAdmin; 