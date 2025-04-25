import { useState, useEffect } from 'react';
import { 
    Box, Button, Chip, Divider, FormControl, Grid, IconButton, InputAdornment, 
    MenuItem, Pagination, Paper, Select, Stack, TextField, Typography 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import CourseItem from './Courses/CourseItem';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCurrentCourse } from '~/store/slices/Course/courseSlice';

const CoursePage = ({ courses }) => {    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage, setCoursesPerPage] = useState(6); // Set to 6 courses per page
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [approvalFilter, setApprovalFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    
    // Filtered and sorted courses
    const [filteredCourses, setFilteredCourses] = useState([]);
    
    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...courses];
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(course => 
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(course => course.status.toLowerCase() === statusFilter.toLowerCase());
        }
        
        // Apply approval filter
        if (approvalFilter !== 'all') {
            const isApproved = approvalFilter === 'approved';
            filtered = filtered.filter(course => course.isApproved === isApproved);
        }
        
        // Apply sorting
        switch (sortBy) {
            case 'recent':
                filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'enrollments':
                filtered.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            default:
                break;
        }
        
        setFilteredCourses(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [courses, searchTerm, statusFilter, approvalFilter, sortBy]);

    // Calculate the index of the first and last course items for the current page
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Handle page change    
     const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };
    
    const handleCoursesPerPageChange = (event) => {
        setCoursesPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };
    
    const checkFreeCourse = (price) => {
        return price === 0;
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setApprovalFilter('all');
        setSortBy('recent');
    };
    
    const handleCreateNewCourse = () => {
        dispatch(clearCurrentCourse());
        navigate('/course-management/new-course');
    };

    return (
        <Box className="p-2">
            {/* Header with stats and actions */}            <Paper elevation={0} className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h5" fontWeight={600} color="primary.main">
                        Course Management
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleCreateNewCourse}
                    >
                        Create New Course
                    </Button>
                </Box>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} md={3}>
                        <Paper elevation={1} className="p-3 text-center">
                            <Typography variant="h6" color="primary.main" fontWeight={700}>{courses.length}</Typography>
                            <Typography variant="body2">Total Courses</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <Paper elevation={1} className="p-3 text-center">
                            <Typography variant="h6" color="success.main" fontWeight={700}>
                                {courses.filter(c => c.status === 'published').length}
                            </Typography>
                            <Typography variant="body2">Published</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <Paper elevation={1} className="p-3 text-center">
                            <Typography variant="h6" color="warning.main" fontWeight={700}>
                                {courses.filter(c => !c.isApproved).length}
                            </Typography>
                            <Typography variant="body2">Pending Approval</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <Paper elevation={1} className="p-3 text-center">
                            <Typography variant="h6" color="text.secondary" fontWeight={700}>
                                {courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0)}
                            </Typography>
                            <Typography variant="body2">Total Students</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
            
            {/* Search and filters */}            <Paper elevation={0} className="mb-4 p-4">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="mb-4">
                    <TextField
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                displayEmpty
                                startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="published">Published</MenuItem>
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="unpublished">Unpublished</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                                value={approvalFilter}
                                onChange={(e) => setApprovalFilter(e.target.value)}
                                displayEmpty
                                startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="all">All Approvals</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                displayEmpty
                                startAdornment={<SortIcon fontSize="small" sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="recent">Most Recent</MenuItem>
                                <MenuItem value="alphabetical">A-Z</MenuItem>
                                <MenuItem value="enrollments">Enrollments</MenuItem>
                                <MenuItem value="price-high">Price: High to Low</MenuItem>
                                <MenuItem value="price-low">Price: Low to High</MenuItem>
                            </Select>
                        </FormControl>
                        
                        {(searchTerm || statusFilter !== 'all' || approvalFilter !== 'all' || sortBy !== 'recent') && (
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={clearFilters}
                                startIcon={<ClearIcon />}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </Box>
                </Stack>
                
                <Divider />
                
                <Box className="mt-2 flex justify-between items-center">
                    <Typography variant="body2" color="text.secondary">
                        {filteredCourses.length} courses found
                    </Typography>
                    {filteredCourses.length !== courses.length && (
                        <Chip 
                            label={`Filtering from ${courses.length} courses`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                        />
                    )}
                </Box>
            </Paper>
              {/* Course grid */}            {currentCourses.length > 0 ? (
                <Grid container spacing={3} className="mb-4">
                    {currentCourses.map((course, index) => (
                        <Grid item xs={12} sm={6} md={4} key={course._id || index}>
                            <CourseItem
                                isFree={checkFreeCourse(course.price)}
                                courseImg={course.photo}
                                courseName={course.title}
                                courseId={course._id}
                                course={course}
                                status={course.status}
                                approveBy={course.isApproved}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper elevation={0} className="p-8 text-center">
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No courses found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Try adjusting your filters or create a new course
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleCreateNewCourse}
                    >
                        Create New Course
                    </Button>
                </Paper>
            )}
              {/* Pagination */}
            {filteredCourses.length > coursesPerPage && (
                <Box className="flex flex-col items-center mt-4 mb-4">
                    <Pagination
                        count={Math.ceil(filteredCourses.length / coursesPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                        siblingCount={1}
                    />
                    
                    {/* <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            Courses per page:
                        </Typography>
                        <FormControl size="small" sx={{ width: 80 }}>
                            <Select
                                value={coursesPerPage}
                                onChange={handleCoursesPerPageChange}
                                displayEmpty
                            >
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                                <MenuItem value={16}>16</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                            </Select>
                        </FormControl>
                    </Box> */}
                </Box>
            )}
        </Box>
    );
};

export default CoursePage;