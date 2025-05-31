import { Box, Typography, Card, CardContent, Grid, Alert } from '@mui/material';
import { Assessment as AssessmentIcon } from '@mui/icons-material';

const ReportsAnalytics = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reports & Analytics
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This section is under development and will provide detailed analytics and reports about platform usage, sales, and user activity.
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Platform Usage Analytics</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Coming soon: User engagement metrics, active users, session duration, and more.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue Reports</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Coming soon: Detailed revenue breakdowns, sales forecasts, and payment analytics.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Course Performance</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Coming soon: Course completion rates, engagement metrics, and instructor performance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">User Demographics</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Coming soon: User location, age distribution, device usage, and more demographic data.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsAnalytics; 