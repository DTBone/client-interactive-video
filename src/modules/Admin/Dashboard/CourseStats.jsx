import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import { 
  School as SchoolIcon,
  VerifiedUser as VerifiedIcon,
  PendingActions as PendingIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { getAllCourse } from '~/store/slices/Course/action';
import { useNavigate } from 'react-router-dom';
import { api } from '~/Config/api';

const CourseStats = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const result = await api.get('/learns/admin/stats')
        if (result.status === 200) {
          console.log(result.data.data)
          setCourses(result.data.data);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [dispatch]);

  // Calculate course stats
  const totalCourses = courses.totalCourses;
  const publishedCourses = courses.publishedCourses;
  const unpublishedCourses = courses.unpublishedCourses;
  const pendingApprovals = courses.pendingCourses;

  // Calculate total enrollments across all courses
  const totalEnrollments = courses.totalEnrollments;

  // Get most popular courses (top 5 by enrollment)
  const popularCourses = courses.popularCourses;

  // Get pending approval courses
  const pendingCourses = courses.pendingCourses;

  return (
    <Card sx={{ mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <SchoolIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Course Statistics
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {/* Total Courses Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Total Courses
                    </Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {totalCourses}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between">
                      <Chip 
                        size="small" 
                        icon={<VerifiedIcon fontSize="small" />} 
                        label={`${publishedCourses.length} Published`} 
                        variant="outlined" 
                        color="success"
                      />
                      <Chip 
                        size="small" 
                        icon={<PendingIcon fontSize="small" />} 
                        label={`${unpublishedCourses.length} Unpublished`} 
                        variant="outlined" 
                        color="warning"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Total Enrollments Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Total Enrollments
                    </Typography>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      {totalEnrollments}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {totalCourses > 0 ? (
                        `Avg. ${Math.round(totalEnrollments / totalCourses)} per course`
                      ) : (
                        'No courses available'
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pending Approvals Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Pending Approvals
                    </Typography>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {pendingApprovals.length}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                  </CardContent>
                </Card>
              </Grid>

              {/* Average Rating Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Course Categories
                    </Typography>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {/* This would come from a categories API */}
                      8
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Button 
                      size="small" 
                      color="secondary" 
                      sx={{ mt: 0.5 }}
                      onClick={() => navigate('/admin/courses/categories')}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Manage Categories
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} mt={1}>
              {/* Popular Courses */}
              <Grid item xs={12} md={6}>
                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Popular Courses
                  </Typography>
                  <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    {popularCourses.length > 0 ? (
                      popularCourses.map((course) => (
                        <ListItem key={course._id} alignItems="flex-start" sx={{ py: 1 }}>
                          <Avatar 
                            alt={course.title} 
                            src={course.thumbnail} 
                            variant="rounded"
                            sx={{ mr: 2, width: 48, height: 48 }}
                          />
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                {course.title}
                              </Typography>
                            }
                            secondary={
                              <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                                <Typography component="span" variant="body2" color="text.primary">
                                  Enrollments: {course.enrollmentCount || 0}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={course.level} 
                                  color={
                                    course.level === 'beginner' ? 'success' :
                                    course.level === 'intermediate' ? 'primary' : 'error'
                                  }
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No courses available" />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Grid>

              {/* Pending Approval Courses */}
              <Grid item xs={12} md={6}>
                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Pending Approvals
                  </Typography>
                  <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    {pendingCourses.length > 0 ? (
                      pendingCourses.map((course) => (
                        <ListItem key={course._id} alignItems="flex-start" sx={{ py: 1 }}>
                          <Avatar 
                            alt={course.title} 
                            src={course.thumbnail} 
                            variant="rounded"
                            sx={{ mr: 2, width: 48, height: 48 }}
                          />
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                {course.title}
                              </Typography>
                            }
                            secondary={
                              <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                                <Typography component="span" variant="body2" color="text.primary">
                                  Instructor: {course.instructor?.profile?.fullname || 'Unknown'}
                                </Typography>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="warning"
                                  onClick={() => navigate(`/admin/courses/review/${course._id}`)}
                                >
                                  Review
                                </Button>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No pending approvals" />
                      </ListItem>
                    )}
                    {pendingApprovals > 3 && (
                      <ListItem>
                        <Button 
                          fullWidth 
                          size="small" 
                          onClick={() => navigate('/admin/courses/pending')}
                          endIcon={<ArrowForwardIcon />}
                        >
                          View All ({pendingApprovals})
                        </Button>
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseStats; 