import { useState, useEffect, useCallback, useRef } from "react";
import { Typography, Box, useMediaQuery, useTheme, Button, alpha, IconButton } from "@mui/material";
import Course from "./components/Course";
import "~/index.css";
import { useNavigate } from "react-router-dom";
import SchoolIcon from '@mui/icons-material/School';
import ExploreIcon from '@mui/icons-material/Explore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * Responsive course slider component with custom animations
 * @param {Object} props - Component props
 * @param {Array} props.course - Array of course objects
 * @param {string} props.title - Title of the slider
 * @param {string} props.emptyMessage - Message to show when no courses
 * @param {number} props.columns - Number of columns to show on desktop (default: 3)
 * @param {boolean} props.autoplay - Enable autoplay
 * @param {boolean} props.showExploreButton - Show explore courses button when empty
 */
function SliderCourses({ 
  course = [], 
  title, 
  emptyMessage = "No courses available",
  columns = 3,
  autoplay = true,
  showExploreButton = true
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef();
  const sliderRef = useRef(null);
  
  // Calculate slides per view based on screen size
  const slidesPerView = isMobile ? 1 : isTablet ? Math.min(2, courses.length) : Math.min(columns, courses.length);
  
  useEffect(() => {
    // Ensure courses array is valid
    if (Array.isArray(course)) {
      setCourses(course);
    } else {
      setCourses([]);
    }
  }, [course]);

  // Handle automatic sliding
  useEffect(() => {
    if (autoplay && courses.length > slidesPerView) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoplay, courses.length, slidesPerView, currentIndex]);

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (isTransitioning || courses.length <= slidesPerView) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => {
      if (prevIndex >= courses.length - slidesPerView) {
        return 0;  // Loop back to start
      }
      return prevIndex + 1;
    });
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [courses.length, isTransitioning, slidesPerView]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || courses.length <= slidesPerView) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => {
      if (prevIndex <= 0) {
        return Math.max(0, courses.length - slidesPerView);  // Loop to end
      }
      return prevIndex - 1;
    });
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [courses.length, isTransitioning, slidesPerView]);

  // Calculate pagination dots
  const totalDots = Math.max(0, courses.length - slidesPerView + 1);
  const dots = Array.from({ length: totalDots }, (_, i) => i);

  return (
    <Box 
      sx={{
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        px: { xs: 2, md: 4 },
        py: 4,
        position: 'relative',
        borderRadius: 3,
        background: theme => alpha(theme.palette.primary.light, 0.05),
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Title with decorative element */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'center', md: 'flex-end' },
        mb: 4,
        position: 'relative'
      }}>
        <Box
          sx={{
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: { xs: 'calc(50% - 20px)', md: 0 },
              width: 40,
              height: 4,
              bgcolor: 'primary.main',
              borderRadius: 2
            }
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? 'common.white' : '#1a1a2e',
              textAlign: { xs: "center", md: "left" },
              textTransform: 'capitalize',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>
        </Box>
        
        {courses.length > 0 && (
          <Button 
            variant="outlined"
            color="primary"
            size="small"
            endIcon={<ExploreIcon />}
            onClick={() => navigate(`/homeuser?userid=${JSON.parse(localStorage.getItem('user'))._id}`)}
            sx={{ 
              mt: { xs: 2, md: 0 },
              borderRadius: 5,
              px: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)'
            }}
          >
            View All Courses
          </Button>
        )}
      </Box>

      {/* Custom Slider or Empty State */}
      {courses.length > 0 ? (
        <Box sx={{ width: '100%', position: 'relative' }}>
          {/* Main slider container */}
          <Box
            ref={sliderRef}
            sx={{
              display: 'flex',
              overflowX: 'hidden',
              position: 'relative',
              minHeight: '400px',
              width: '100%',
              mt: 3,
              mb: 5,
              px: { xs: 0, md: 2 }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                transition: 'transform 0.5s ease',
                transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
                width: '100%',
                gap: 3
              }}
            >
              {courses.map((course, index) => (
                <Box
                  key={course._id || index}
                  sx={{
                    flexShrink: 0,
                    width: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * 24 / slidesPerView}px)`,
                    height: '100%'
                  }}
                >
                  <Course course={course} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Navigation buttons - only show if needed */}
          {courses.length > slidesPerView && (
            <>
              <IconButton
                onClick={prevSlide}
                disabled={isTransitioning}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: { xs: -5, md: 10 },
                  transform: 'translateY(-50%)',
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: 'background.paper', opacity: 0.9 },
                  zIndex: 2,
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 }
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              
              <IconButton
                onClick={nextSlide}
                disabled={isTransitioning}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: { xs: -5, md: 10 },
                  transform: 'translateY(-50%)',
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: 'background.paper', opacity: 0.9 },
                  zIndex: 2,
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 }
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </>
          )}

          {/* Custom pagination dots */}
          {totalDots > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 1,
                mb: 2
              }}
            >
              {dots.map((dot) => (
                <Box
                  key={dot}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentIndex(dot);
                      setTimeout(() => setIsTransitioning(false), 500);
                    }
                  }}
                  sx={{
                    width: dot === currentIndex ? 24 : 8,
                    height: 8,
                    borderRadius: dot === currentIndex ? 4 : '50%',
                    bgcolor: dot === currentIndex ? 'primary.main' : alpha(theme.palette.primary.main, 0.3),
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, dot === currentIndex ? 1 : 0.5),
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 3,
            borderRadius: 3,
            border: '2px dashed',
            borderColor: alpha(theme.palette.primary.main, 0.3),
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            textAlign: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: alpha(theme.palette.primary.main, 0.5),
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }
          }}
        >
          <SchoolIcon 
            sx={{ 
              fontSize: 80, 
              color: alpha(theme.palette.primary.main, 0.4), 
              mb: 2 
            }} 
          />
          <Typography 
            variant="h6" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            {emptyMessage}
          </Typography>
          
          {showExploreButton && (
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ 
                mt: 2,
                borderRadius: 6,
                px: 4,
                py: 1,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
              }}
              endIcon={<ExploreIcon />}
              onClick={() => navigate(`/homeuser?userid=${JSON.parse(localStorage.getItem('user'))._id}`)}

            >
              Explore Courses
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}

export default SliderCourses;
