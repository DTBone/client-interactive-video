import React from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import CSS của slick carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import component CourseCard đã tạo trước đó
import CourseCard from './CourseCard';


// Nút điều hướng tùy chỉnh
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIosIcon
      className={className}
      style={{
        ...style,
        display: 'block',
        color: '#333',
        fontSize: '24px',
        left: '-30px',
        zIndex: 1
      }}
      onClick={onClick}
    />
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIosIcon
      className={className}
      style={{
        ...style,
        display: 'block',
        color: '#333',
        fontSize: '24px',
        right: '-30px'
      }}
      onClick={onClick}
    />
  );
};
const CourseCarousel = ({  courses, slidesToShow = 4 }) => {
  // Cấu hình cho slider
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(slidesToShow, 3),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: Math.min(slidesToShow, 2),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Kiểm tra nếu không có khóa học
  if (!courses || courses.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        
        <Typography>Không có khóa học nào.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      {/* Tiêu đề cho carousel */}
      
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          {/* <Typography variant="h5">{title}</Typography> */}
          {courses.length > slidesToShow && (
            <Typography 
              variant="subtitle1" 
              color="primary" 
              sx={{ cursor: 'pointer' }}
              onClick={() => console.log('Xem tất cả khóa học')}
            >
              Show All
            </Typography>
          )}
        </Box>
      
      
      {/* Slider chứa các khóa học */}
      <Box sx={{ px: { xs: 0, sm: 1 } }}>
        <Slider {...settings}>
          {courses.map((course) => (
            <Box key={course.id} sx={{ p: 1 }}>
              <CourseCard course={course} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default CourseCarousel;
