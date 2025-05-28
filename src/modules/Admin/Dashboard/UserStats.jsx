import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress,
  Chip,
  Divider,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { getStatUser } from '~/store/slices/Account/action';

const UserStats = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userId = JSON.parse(localStorage.getItem('user'))?._id;
        const result = await dispatch(getStatUser(userId));
        if (getStatUser.fulfilled.match(result)) {
          setUsers(result.payload.data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  // Calculate user stats
  const totalUsers = users.totalUsers;
  const students = users.students;
  const instructors = users.instructors;
  const admins = users.admins;
  
  const activeUsers = users.activeUsers
  
  const activeUserPercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Calculate new users in the last 30 days
  const newUsers = users.newUsers
  
  const newUserPercentage = totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0;

  return (
    <Card sx={{ mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <PeopleIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            User Statistics
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {/* Total Users Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Total Users
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {totalUsers}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {newUserPercentage > 0 && (
                        <Box component="span" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUpIcon fontSize="small" />
                          {newUserPercentage}% new in 30 days
                        </Box>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Students Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Students
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" color="info.main" fontWeight="bold">
                        {students}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {totalUsers > 0 && (
                        <Box component="span">
                          {Math.round((students / totalUsers) * 100)}% of total
                        </Box>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Instructors Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Instructors
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" color="warning.main" fontWeight="bold">
                        {instructors}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {totalUsers > 0 && (
                        <Box component="span">
                          {Math.round((instructors / totalUsers) * 100)}% of total
                        </Box>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Admins Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Admins
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" color="error.main" fontWeight="bold">
                        {admins}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {totalUsers > 0 && (
                        <Box component="span">
                          {Math.round((admins / totalUsers) * 100)}% of total
                        </Box>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                User Activity
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2">Active Users (30 days)</Typography>
                    <Typography variant="body2" fontWeight="bold">{activeUserPercentage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={activeUserPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'primary.main',
                      }
                    }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Chip 
                      icon={<GroupIcon />} 
                      label={`${activeUsers} active users`} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2">New Users (30 days)</Typography>
                    <Typography variant="body2" fontWeight="bold">{newUserPercentage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={newUserPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'success.main',
                      }
                    }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Chip 
                      icon={<SchoolIcon />} 
                      label={`${newUsers} new users`} 
                      size="small" 
                      variant="outlined" 
                      color="success"
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStats; 