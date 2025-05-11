import React from 'react';
import { Link } from 'react-router-dom';
import { LinearProgress, Tooltip, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import defaultImage from '~/assets/DefaultImage/course.jpg';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';

// Gradient progress bar styled component
const StyledProgressBar = styled(LinearProgress)(({ theme, value }) => ({
    height: 8,
    borderRadius: 4,
    '& .MuiLinearProgress-bar': {
        borderRadius: 4,
        background: `linear-gradient(90deg, 
            ${value < 30 ? '#3B82F6' : value < 70 ? '#10B981' : '#8B5CF6'} 0%, 
            ${value < 30 ? '#60A5FA' : value < 70 ? '#34D399' : '#A78BFA'} 100%)`
    },
    backgroundColor: '#E2E8F0'
}));

const Course = ({ props }) => {
    const course = props;
    const navigate = useNavigate();
    // Calculate days left if deadline exists
    const calculateDaysLeft = () => {
        if (!course?.deadline) return null;
        const deadline = new Date(course.deadline);
        const today = new Date();
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };
    
    const daysLeft = calculateDaysLeft();
    
    const handleBtnClick = (event) => {
        const id = event.target.id;
        if (id === "go-to-course") {
            navigate(`/course/${course?.id}`);
        } else if (id === "view-certificate") {
            console.log("View certificate");
        } else if (id === "rate-course") {
            console.log("Rate course");
        }
    };

    // Function to truncate title if it's too long
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex flex-col md:flex-row h-full">
                {/* Course Image Section - Fixed dimensions */}
                <div className="relative w-full md:w-60 h-56 md:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img 
                        src={course?.photo || defaultImage}
                        alt={course?.title}
                        className="w-full h-full object-cover"
                        style={{ aspectRatio: '16/9' }}
                    />
                    {course?.level && (
                        <Chip 
                            label={course.level}
                            size="small"
                            className="absolute top-3 left-3 z-20"
                            sx={{ 
                                bgcolor: 'rgba(0,0,0,0.7)', 
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                            }}
                        />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20 md:hidden">
                        <h3 className="text-lg font-bold text-white truncate">{truncateText(course?.title, 40)}</h3>
                    </div>
                </div>
                
                {/* Course Info Section */}
                <div className="flex-1 p-5 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 hidden md:block">{course?.title}</h3>
                        
                        {course?.instructor && (
                            <p className="text-gray-500 text-sm mb-4 flex items-center">
                                <span className="inline-block h-7 w-7 rounded-full bg-blue-100 text-blue-500 mr-2 flex items-center justify-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                                        <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z" fill="currentColor"/>
                                    </svg>
                                </span>
                                <span className="font-medium">{course?.instructor.profile?.fullname}</span>
                            </p>
                        )}
                        
                        {/* Progress indicator */}
                        <div className="mb-5">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Course Progress</span>
                                <span className="text-blue-600 font-semibold">{course?.progress?.overallPercentage || 0}%</span>
                            </div>
                            <StyledProgressBar 
                                variant="determinate" 
                                value={course?.progress?.overallPercentage || 0}
                            />
                        </div>
                        
                        {/* Course stats with icons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mt-auto">
                            {course?.totalLessons && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <MenuBookIcon sx={{ fontSize: 18, marginRight: '6px', color: '#4B5563' }} />
                                    <span className="font-medium mr-1">Lessons:</span>
                                    <span>{course?.lessonsCompleted || 0}/{course?.totalLessons}</span>
                                </div>
                            )}
                            
                            {course?.duration && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <AccessTimeIcon sx={{ fontSize: 18, marginRight: '6px', color: '#4B5563' }} />
                                    <span className="font-medium mr-1">Duration:</span>
                                    <span>{course?.duration}</span>
                                </div>
                            )}
                            
                            {daysLeft !== null && (
                                <div className={`flex items-center text-sm ${daysLeft < 7 ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                                    <EventIcon sx={{ fontSize: 18, marginRight: '6px', color: daysLeft < 7 ? '#EF4444' : '#4B5563' }} />
                                    <span className="font-medium mr-1">Deadline:</span>
                                    <span>{daysLeft} days left</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 md:p-5 md:w-56 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-gray-100">
                    {course?.progress?.status === "in-progress" ? (
                        <button
                            id="go-to-course"
                            onClick={handleBtnClick}
                            className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                        >
                            Continue Learning
                        </button>
                    ) : (
                        <div className="flex flex-col items-center w-full gap-3">
                            <button
                                id="view-certificate"
                                onClick={handleBtnClick}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-md font-medium hover:shadow-lg transition-all duration-300 shadow-md transform hover:scale-105 active:scale-95"
                            >
                                View Certificate
                            </button>
                            
                            <Tooltip title="Rate this course" arrow placement="top">
                                <button
                                    id="rate-course"
                                    onClick={handleBtnClick}
                                    className="flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors duration-300 transform hover:scale-110 mt-1"
                                >
                                    <span className="text-lg">⭐</span>
                                    <span className="text-sm font-medium">Rate Course</span>
                                </button>
                            </Tooltip>
                        </div>
                    )}
                </div>
                </div>
                
                {/* Action Button Section */}
                
            </div>
        </div>
    );
};

export default Course;
