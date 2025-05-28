import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursebyUser } from "~/store/slices/Course/action";
import { Grid, Typography, Paper, Box } from '@mui/material';
import PropTypes from 'prop-types';
import CourseCardWithProgress from '../HomeUser/components/CourseCard/CourseCardWithProgress';

// Custom button component
const TabButton = ({ id, active, onClick, children }) => (
    <button
        id={id}
        onClick={onClick}
        className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            active 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
        }`}
    >
        {children}
    </button>
);

TabButton.propTypes = {
    id: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

const MyLearning = () => {
    const [activeTab, setActiveTab] = useState("progress");
    const { courses, loading } = useSelector((state) => state.course);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCoursebyUser());
    }, [dispatch]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const filteredCourses = courses?.filter(
        (course) => activeTab === "progress" 
            ? course.progress?.status === "in-progress" 
            : course.progress?.status === "complete"
    );

    return (
        <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Box mb={4}>
                <Typography variant="h3" fontWeight={700} color="primary.main" mb={1}>
                    My Learning Journey
                </Typography>
                <Typography color="text.secondary" fontSize={18}>
                    Track your progress and completed courses all in one place
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ borderRadius: 4, p: { xs: 2, md: 4 }, background: 'linear-gradient(90deg, #f8fafc 0%, #e3f2fd 100%)' }}>
                <Box display="flex" gap={2} mb={4}>
                    <TabButton 
                        id="progress" 
                        active={activeTab === "progress"} 
                        onClick={() => handleTabChange("progress")}
                    >
                        In Progress
                    </TabButton>
                    <TabButton 
                        id="completed" 
                        active={activeTab === "completed"} 
                        onClick={() => handleTabChange("completed")}
                    >
                        Completed
                    </TabButton>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </Box>
                ) : filteredCourses?.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        
                        <Typography variant="h6" mt={2} color="text.primary">No courses found</Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            {activeTab === "progress" 
                                ? "You don't have any courses in progress." 
                                : "You haven't completed any courses yet."}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredCourses.map((course) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                                <CourseCardWithProgress course={course} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

export default MyLearning;
