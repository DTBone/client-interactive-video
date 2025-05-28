import React, { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Drawer, 
  useTheme, 
  IconButton, 
  Divider, 
  Typography,
  Avatar,
  Collapse
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  School as SchoolIcon, 
  Payment as PaymentIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  SupervisorAccount as InstructorIcon,
  Assessment as ReportIcon,
  Notifications as NotificationsIcon,
  MenuOpen as MenuOpenIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const drawerWidth = 280;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = ({ open, handleDrawerClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openUserSubMenu, setOpenUserSubMenu] = useState(false);
  const [openCourseSubMenu, setOpenCourseSubMenu] = useState(false);

  const handleUserSubMenuClick = () => {
    setOpenUserSubMenu(!openUserSubMenu);
  };

  const handleCourseSubMenuClick = () => {
    setOpenCourseSubMenu(!openCourseSubMenu);
  };

  // Get the admin user data from localStorage
  const adminUser = JSON.parse(localStorage.getItem('user')) || {};

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
      exact: true
    },
    {
      text: 'Account Manager',
      icon: <PeopleIcon/>,
      path: '/admin/accounts',
      exact: true
    },
    {
      text: 'Course Management',
      icon: <SchoolIcon />,
      subMenu: true,
      onClick: handleCourseSubMenuClick,
      open: openCourseSubMenu,
      subMenuItems: [
        {
          text: 'All Courses',
          path: '/admin/courses',
        },
        {
          text: 'Categories',
          path: '/admin/courses/categories',
        }
      ]
    },
    {
      text: 'Payment Management',
      icon: <PaymentIcon />,
      path: '/admin/payments',
    },
    {
      text: 'Reports & Analytics',
      icon: <ReportIcon />,
      path: '/admin/reports',
    },
    {
      text: 'Notifications',
      icon: <NotificationsIcon />,
      path: '/admin/notifications',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings',
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader sx={{ backgroundColor: theme.palette.primary.dark, borderBottom: '1px solid rgba(255, 255, 255, 0.12)', 
        mt: 8
       }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pl: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Portal
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      </DrawerHeader>
      
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <Avatar 
          src={adminUser?.profile?.picture} 
          alt={adminUser?.profile?.fullname || 'Admin'} 
          sx={{ width: 50, height: 50, mr: 2 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {adminUser?.profile?.fullname || 'Admin User'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            textWrap: 'nowrap',
            width: '80%',
           }}>
            {adminUser?.email || 'admin@example.com'}
          </Typography>
        </Box>
      </Box>

      <List component="nav" sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem 
              button 
              onClick={item.subMenu ? item.onClick : () => navigate(item.path)}
              sx={{
                mb: 0.5,
                backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                borderRadius: '8px',
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.subMenu && (item.open ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            
            {item.subMenu && (
              <Collapse in={item.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subMenuItems.map((subItem) => (
                    <ListItem 
                      button 
                      key={subItem.text}
                      onClick={() => navigate(subItem.path)}
                      sx={{
                        pl: 4,
                        mb: 0.5,
                        backgroundColor: isActive(subItem.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        borderRadius: '8px',
                      }}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 