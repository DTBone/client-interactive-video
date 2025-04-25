import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCourseByInstructor } from '~/store/slices/Course/action';
import { getStudentEnrollCourse } from '~/store/slices/StudentEnrollCourse/action';
import {
    Chip,
    Avatar,
    Typography, 
    Box,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Tabs,
    Tab,
    Divider,
    CircularProgress,
    Grid
} from '@mui/material';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as NotStartedIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    Timeline as TimelineIcon,
    Sort as SortIcon
} from '@mui/icons-material';
import StudentDetailsModal from './StudentDetailsModal';

const DetailedStatistic = () => {
    const courses = useSelector((state) => state.course.courses);
    const dispatch = useDispatch();
    const courseId = useParams().courseId;
    const [course, setCourse] = useState();
    const { students } = useSelector(state => state.student)
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(getCourseByInstructor())
    }, [dispatch])

    useEffect(() => {
        const fetchData = () => {
            const course1 = courses.find(course => course._id === courseId)
            setCourse(course1)
        }
        fetchData()
    }, [courseId, courses])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(getStudentEnrollCourse({ courseId }));
            setLoading(false);
        }
        fetchData()
    }, [courseId, dispatch]);

    const totalStudents = students?.length || 0;
    const completedStudents = students
        ?.filter(student =>
            student?.progress && student.progress.status === 'completed'
        )?.length || 0;
    const completionPercentage = totalStudents > 0 ? 
        Math.round((completedStudents / totalStudents) * 100) : 0;

    const filteredStudents = students?.filter(student => 
        student.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col overflow-auto">
            {/* Course Header */}
            <Box className="mb-6 bg-white shadow-md rounded-lg p-6 flex flex-col gap-2">
                <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
                    {course?.title || 'Course Progress Overview'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {course?.description}
                </Typography>
                <Box className="flex flex-wrap gap-4 mt-2">
                    <Chip
                        label={`Total Students: ${totalStudents}`}
                        color="primary"
                        variant="outlined"
                    />
                    <Chip
                        label={`Completed: ${completedStudents} (${completionPercentage}%)`}
                        color="success"
                        variant="outlined"
                    />
                    <Chip
                        label={`Incomplete: ${totalStudents - completedStudents}`}
                        color="warning"
                        variant="outlined"
                    />
                </Box>
                <Box className="flex flex-wrap gap-4 mt-2">
                    <Typography variant="body2" color="text.secondary">
                        Created: {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : '--'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Instructor: {course?.instructor?.username || '--'}
                    </Typography>
                </Box>
            </Box>

            {/* Navigation Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange} 
                    variant="fullWidth" centered textColor="primary" indicatorColor="primary">
                    <Tab label="Students" icon={<FilterIcon />} iconPosition="start" />
                    <Tab label="Course Analytics" icon={<PieChartIcon />} iconPosition="start" />
                </Tabs>
            </Paper>

            {/* Students List Tab */}
            {currentTab === 0 && (
                <Box className="bg-white shadow rounded-lg p-4">
                    <Box className="flex flex-wrap justify-between items-center mb-4">
                        <Typography variant="h6" fontWeight={600} color="primary">
                            Students List
                        </Typography>
                        <Box className="flex gap-2">
                            <TextField
                                placeholder="Search students..."
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ width: '250px' }}
                            />
                            <IconButton size="small">
                                <SortIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    {loading ? (
                        <Box className="flex justify-center p-6">
                            <CircularProgress />
                        </Box>
                    ) : filteredStudents?.length > 0 ? (
                        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto" style={{ maxHeight: '65vh' }}>
                            {filteredStudents?.map((student) => (
                                <Paper
                                    key={student.user._id}
                                    elevation={2}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                                    onClick={() => handleStudentClick(student)}
                                    sx={{
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                            borderLeft: '4px solid #1976d2'
                                        },
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    <Avatar
                                        alt={student.user.username}
                                        src={student.user.avatarUrl}
                                        sx={{ 
                                            width: 56, 
                                            height: 56, 
                                            boxShadow: 2, 
                                            border: '2px solid #1976d2',
                                            bgcolor: student?.progress?.status === 'completed' ? '#4caf50' : '#ff9800'
                                        }}
                                    >
                                        {student.user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box className="flex-1">
                                        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                            {student.user.username}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {student.user.email}
                                        </Typography>
                                        <Box className="flex items-center gap-2 mt-1">
                                            {student?.progress?.status === 'completed' ? (
                                                <Chip
                                                    label="Completed"
                                                    color="success"
                                                    size="small"
                                                    icon={<CompletedIcon fontSize="small" />}
                                                />
                                            ) : (
                                                <Chip
                                                    label="In Progress"
                                                    color="warning"
                                                    size="small"
                                                    icon={<NotStartedIcon fontSize="small" />}
                                                />
                                            )}
                                            <Typography variant="caption" color="text.secondary">
                                                {student?.progress?.percent ? `Progress: ${student.progress.percent}%` : 'No progress'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    ) : (
                        <Box className="p-6 text-center">
                            <Typography variant="body1" color="text.secondary">
                                No students found matching your search criteria.
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {/* Course Analytics Tab */}
            {currentTab === 1 && (
                <Box className="bg-white shadow rounded-lg p-4">
                    <Typography variant="h6" fontWeight={600} color="primary" mb={2}>
                        Course Analytics
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3, height: '100%', minHeight: 200 }}>
                                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                    Completion Rate
                                </Typography>
                                <Box className="flex flex-col items-center justify-center" sx={{ height: 200 }}>
                                    <Box position="relative" display="inline-flex">
                                        <CircularProgress 
                                            variant="determinate" 
                                            value={completionPercentage} 
                                            size={120} 
                                            thickness={6} 
                                            color="success"
                                        />
                                        <Box
                                            sx={{
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: 'absolute',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="h5" component="div" color="text.primary">
                                                {`${completionPercentage}%`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mt={2}>
                                        {completedStudents} of {totalStudents} students completed
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3, height: '100%', minHeight: 200 }}>
                                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                    Student Engagement
                                </Typography>
                                <Box className="flex items-center justify-center" sx={{ height: 200 }}>
                                    <Typography variant="body1" color="text.secondary" align="center">
                                        Detailed analytics with charts will be available soon.
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Student Details Modal */}
            <StudentDetailsModal
                open={!!selectedStudent}
                onClose={handleCloseModal}
                studentData={selectedStudent}
            />
        </div>
    )
}

export default DetailedStatistic
