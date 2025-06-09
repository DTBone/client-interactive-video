import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import userService from "~/services/api/userService";
import ErrorModal from "~/pages/ErrorModal";
import '~/index.css';
import { useNavigate } from "react-router-dom";
import { 
  Box, Button, Container, Divider, Tab, Tabs, Typography, Avatar, 
  Paper, TextField, Grid, Card, CardContent, Chip, 
  LinearProgress,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SliderCourses from "~/Components/SliderCourses";
import ModalEditProfile from "./ModalEditProfile";
import TransactionHistory from "./PaymentHistory";
import { getAllCoursebyUser } from "~/store/slices/Course/action";
import { useSelector } from "react-redux";
import CourseList from "../HomeUser/components/CourseList";
import Course from '~/Components/SliderCourses/components/Course';

function Profile() {
    const path = window.location.pathname;
    const id = path.split('/').pop();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        username: '',
        email: '',
        profile: {
            fullname: '',
        },
        enrolled_courses: []
    });
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await userService.getUserById(id, token);
                setUser(response.data);
            } catch (error) {
                if(error.status === 401) {
                    try {
                        const response = await userService.getResetAccessToken();
                        localStorage.setItem('token', response.data.newToken);
                        fetchUser();
                    } catch (error) {
                        setError('You must login again to continue');
                        return error
                    }
                    return;
                }
                else {
                    setUser({
                        username: '',
                        email: '',
                        profile: {
                            fullname: '',
                        },
                        enrolled_courses: []
                    });
                    setError(error.message);
                    return;
                }
            }
        };
        
        if (id) {
            fetchUser();
        }
    }, [dispatch, id, navigate, error, open]);
    const { courses } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(getAllCoursebyUser());
        console.log('courses', courses);
    }, [courses])

    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };
    
    // Tính toán tiến độ học tập tổng thể
    const calculateOverallProgress = () => {
        if (!user.enrolled_courses || user.enrolled_courses.length === 0) return 0;
        
        const totalCompletedLessons = user.enrolled_courses.reduce((total, course) => 
            total + (course.progress || 0), 0);
            
        return Math.round(totalCompletedLessons / user.enrolled_courses.length);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <ErrorModal error={error}/>
            {open && <ModalEditProfile user={user} setOpen={setOpen}/>}
            
            {/* Header Card */}
            <Paper 
                elevation={3}
                sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    mb: 4,
                    position: 'relative'
                }}
            >
                {/* Cover Image */}
                <Box 
                    sx={{ 
                        height: 200, 
                        bgcolor: 'primary.light',
                        backgroundImage: `url(${user.profile.coverPhoto || 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                
                {/* Profile Info */}
                <Box sx={{ 
                    p: 3, 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    position: 'relative'
                }}>
                    {/* Avatar */}
                    <Avatar 
                        src={user.profile.picture || 'https://i.pinimg.com/564x/bc/43/98/bc439871417621836a0eeea768d60944.jpg'}
                        alt={user.username}
                        sx={{ 
                            width: 120, 
                            height: 120, 
                            border: '4px solid white',
                            boxShadow: 2,
                            mt: { xs: -8, md: -12 }
                        }}
                    />
                    
                    {/* User Info */}
                    <Box sx={{ 
                        ml: { xs: 0, md: 3 },
                        mt: { xs: 2, md: 0 },
                        flexGrow: 1,
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
                        <Typography variant="h4" fontWeight="bold">
                            {user.profile.fullname}
                        </Typography>
                        
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            @{user.username}
                        </Typography>
                        
                        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                            {user.profile.bio || "No bio available"}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Chip 
                                icon={<BadgeIcon />} 
                                label={`Role: ${user.role || 'Student'}`} 
                                variant="outlined" 
                                color="primary"
                            />
                            <Chip 
                                icon={<EmojiEventsIcon />} 
                                label={`Level: ${user.level || 'Beginner'}`} 
                                variant="outlined" 
                                color="secondary"
                            />
                            <Chip 
                                icon={<SchoolIcon />} 
                                label={`${user.enrolled_courses?.length || 0} Courses`} 
                                variant="outlined" 
                            />
                        </Box>
                    </Box>
                    
                    {/* Edit Button */}
                    <Button 
                        variant="contained" 
                        startIcon={<EditIcon />}
                        onClick={() => setOpen(true)}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Edit Profile
                    </Button>
                </Box>
            </Paper>
            
            {/* Tabs Navigation */}
            <Paper sx={{ borderRadius: 2, mb: 4 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleChangeTab} 
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<SchoolIcon />} label="My Courses" />
                    <Tab icon={<PersonIcon />} label="Personal Info" />
                    <Tab icon={<ReceiptIcon />} label="Payment History" />
                </Tabs>
            </Paper>
            
            {/* Tab Content */}
            <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                {/* My Courses Section */}
                <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            My Learning Journey
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" fontWeight="medium">
                                Overall Progress: {calculateOverallProgress()}%
                            </Typography>
                            <Box sx={{ width: 100 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={calculateOverallProgress()} 
                                    sx={{ height: 8, borderRadius: 2 }}
                                />
                            </Box>
                        </Box>
                    </Box>
                    
                    <SliderCourses 
                        title="Current Courses" 
                        course={courses?.filter(course => 
                            course.progress && course.progress.overallPercentage < 100
                        )} 
                        colunms={3}
                    />
                
                    
                    <Divider sx={{ my: 4 }} />
                    
                    <SliderCourses 
                        title="Completed Courses" 
                        course={courses?.filter(course => 
                            course.progress && course.progress.overallPercentage === 100
                        )} 
                        colunms={3}
                    />
                </Paper>
            </Box>
            
            <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                {/* Personal Info Section */}
                <Paper sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Personal Information
                    </Typography>
                    
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Contact Information
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <EmailIcon color="action" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Email Address
                                            </Typography>
                                            <Typography variant="body1">
                                                {user.email || 'Not provided'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                                        <PhoneIcon color="action" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Phone Number
                                            </Typography>
                                            <Typography variant="body1">
                                                {user.profile.phone || 'Not provided'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        About Me
                                    </Typography>
                                    
                                    <TextField
                                        disabled
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
                                        value={user.profile.bio || "No bio available"}
                                        sx={{ mt: 2 }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Account Information
                                    </Typography>
                                    
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Username
                                            </Typography>
                                            <Typography variant="body1">
                                                {user.username}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Account Type
                                            </Typography>
                                            <Typography variant="body1">
                                                {user.role || 'Student'}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Member Since
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(user.createdAt).toLocaleDateString() || 'Unknown'}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Last Login
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(user.lastLogin || Date.now()).toLocaleDateString() || 'Unknown'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            
            <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
                {/* Payment History Section */}
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Transaction History
                    </Typography>
                    <TransactionHistory userId={user._id} />
                </Paper>
            </Box>
        </Container>
    );
}

export default Profile;