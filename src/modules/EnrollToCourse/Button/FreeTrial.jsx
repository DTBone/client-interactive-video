/* eslint-disable react/prop-types */
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    IconButton,
    Grid,
    Divider,
    Chip,
    Stack,
    Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from 'react-router-dom';


const FreeTrial = ({ onClose, onSubmit, course }) => {
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const onPayment = () => {
        navigate(`/payment/${userId}`, { state: { course: course } });
    }
    
    const convertPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    const features = [
        {
            icon: <LockOpenIcon fontSize="large" sx={{ color: '#0056d2' }} />,
            title: 'Access all course content',
            description: 'Watch lectures, complete assignments, participate in discussion forums, and more.'
        },
        {
            icon: <AccessTimeIcon fontSize="large" sx={{ color: '#0056d2' }} />,
            title: 'Cancel anytime',
            description: 'No penalties - simply cancel before the trial ends if it\'s not right for you.'
        },
        {
            icon: <SchoolIcon fontSize="large" sx={{ color: '#0056d2' }} />,
            title: `${convertPrice(course.price)} VND to continue learning after trial ends`,
            description: 'Learn faster to save more.'
        },
        {
            icon: <WorkspacePremiumIcon fontSize="large" sx={{ color: '#0056d2' }} />,
            title: 'Certificate upon completion',
            description: 'Share on your resume, LinkedIn, and CV.'
        }
    ];

    return (
        <Paper elevation={5} sx={{ 
            maxWidth: 800, 
            m: 'auto', 
            p: 0, 
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            <Box sx={{ 
                bgcolor: '#f2f6fd', 
                p: 3, 
                display: 'flex',
                flexDirection: 'column'
            }}>
                <IconButton 
                    sx={{ 
                        position: 'absolute', 
                        right: 8, 
                        top: 8,
                        bgcolor: 'white',
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                
                <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                        <Stack spacing={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <AccessTimeIcon color="primary" />
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    7-Day Free Trial
                                </Typography>
                            </Box>
                            
                            <Typography variant="h4" gutterBottom fontWeight="bold">
                                {course.title}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Avatar
                                    alt={course?.instructor?.profile?.fullname}
                                    src={course?.instructor?.profile?.picture}
                                    sx={{ width: 32, height: 32 }}
                                />
                                <Typography variant="body2">
                                    Instructor: {course?.instructor?.profile?.fullname}
                                </Typography>
                            </Box>
                            
                            <Chip 
                                label="Start learning today" 
                                color="primary" 
                                variant="outlined"
                                sx={{ width: 'fit-content' }}
                            />
                        </Stack>
                    </Grid>
                    
                    <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box textAlign="center">
                            <Typography variant="h3" color="error" fontWeight="bold">
                                {convertPrice(course.price)} VND
                            </Typography>
                            <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                {convertPrice(course.price * 1.2)} VND
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                                Free for the first 7 days
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Benefits when you sign up for a trial:
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Box sx={{ 
                                display: 'flex',
                                gap: 2,
                                height: '100%',
                                p: 2,
                                borderRadius: 2,
                                bgcolor: '#f9f9f9'
                            }}>
                                <Box>
                                    {feature.icon}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        sx={{ 
                            py: 1.5, 
                            px: 4, 
                            borderRadius: 2,
                            fontWeight: 'bold',
                            flex: 2
                        }}
                        onClick={() => {
                            onSubmit();
                            user.enrolled_courses.push(course._id);
                            localStorage.setItem('user', JSON.stringify(user));
                        }}
                    >
                        Start Free Trial
                    </Button>
                    
                    {course.price > 0 && (
                        <Button 
                            variant="outlined" 
                            color="primary"
                            size="large"
                            sx={{ 
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                fontWeight: 'bold',
                                flex: 1
                            }}
                            onClick={onPayment}
                        >
                            Enroll Now
                        </Button>
                    )}
                </Box>
                
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
                    You will not be charged until the end of your 7-day trial period
                </Typography>
            </Box>
        </Paper>
    );
};

export default FreeTrial;