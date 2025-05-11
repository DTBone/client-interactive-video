/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { Avatar, Chip, Stack } from '@mui/material';
import { FavoriteBorder, FlagOutlined, Share, SubscriptionsOutlined, ThumbsUpDown } from '@mui/icons-material';

function Course({ course }) {
  const navigate = useNavigate();

  return (
    <Box
    sx={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '300px',
      borderRadius: 2.5,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      backgroundColor: 'white',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      "&:hover .hover-content": {
            opacity: 1,
            transform: 'translateY(-30px)',
            transition: 'all ease 0.3s',
          },
          ":hover .course-card": {
            opacity: 0,
            transition: 'all ease 0.3s',
          }
      
    }}
    >
      <Card
      className='course-card'
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '300px',
          backgroundColor: 'transparent',
          borderRadius: 2.5,
          padding: 1.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          zIndex: 1,
          boxShadow: 'none',
          transition: 'all ease 0.3s',
          
        }}
        // onClick={() => {
        //   navigate(`/course/${course._id}`);
        // }}
        >
        <CardActionArea
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '90%',
            opacity: 1,
          }}
        >
          <CardMedia
            component="img"
            image={course.photo === 'no-photo.jpg' ? 'https://res.cloudinary.com/drhf9fpvf/image/upload/v1728913682/logo_codechef_hzrtyf.png' : course.photo}
            alt="codechef"
            sx={{
              borderRadius: 4,
              minHeight: 0.75,
              marginBottom: '20px',
              overflow: 'hidden',
              objectFit: 'cover', 
            }}
          />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              height: '100%',
              padding: 0,
              width: '100%',
            }}
          >
            <Chip label={course?.level} color="info" sx={{
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: 3,
              height: 25,
            }} />
            <Typography gutterBottom variant="h5" component="div"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                  color: 'text.secondary',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                
              }}
            >
              {course?.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 0
              }}
            >
              <Rating
                value={course?.averageRating || 0}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  color: 'text.secondary'
                }}
              >
                ({course?.averageRating?.toFixed(1) || '0.0'})
              </Typography>
            </Box>
            <Typography gutterBottom variant="h5" component="div"
              color='error'
              sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                mt: 1
              }}
            >
              {course?.price === 0 ? 'Free' : `${course?.price} ₫`}
            </Typography>
          </CardContent>
          </CardActionArea>
          
        </Card>
          {/* Hover content */}
        <Box 
          className="hover-content"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            opacity: 0,
            position: 'absolute',
            transition: 'all ease 0.3s',
            top: '50px',
            left: 0,
            padding: 1.5,
            width: '100%',
            zIndex: 2,
          }}>
            {/* Author */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 1,
              flexDirection: 'row',
              height: 40,
            }}>
              <Avatar src={course?.instructor?.profile?.photo} alt="author" width={40} height={40} className="rounded-full" />
              <Typography variant="body1" color="black" sx={{
                fontWeight: 'bold'}}>
                By {course?.instructor?.profile?.fullname}
                <Typography variant="body2" color="textSecondary">
                  {course?.instructor?.email}
                  </Typography>
              </Typography>
            </Box>
            {/* Title */}
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              mt: 2,
              flexDirection: 'row',
              minHeight: '140px',
            }}>
              <Typography variant="h5" color="primary" sx={{
                fontWeight: 'bold'}}>
                {course?.title}
                <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 5,
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {course?.description}
            </Typography>
              </Typography>
            
            </Box>
            {/* Lessons Count and Time */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mt: 2,
              flexDirection: 'row',
              
            }}>
              <Stack direction="row" spacing={1}>
                <FlagOutlined color="primary" />
                <Typography variant="body1" color="black" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {course?.level}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <SubscriptionsOutlined color="primary" />
                <Typography variant="body1" color="black" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {course?.modules?.reduce((a, b) => a+=b.moduleItems?.length, 0)} lessons
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <ThumbsUpDown color="primary" />
                <Typography variant="body1" color="black" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {course?.averageRating?.toFixed(1) || '0.0'} ⭐ ({course?.courseReviews?.length})
                </Typography>
              </Stack>
            </Box>
            {/* Button */}
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  width: '100%',
                  borderRadius: 2.5,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  padding: '0.5rem',
                  textTransform: 'uppercase',
                }}
                onClick={() => {
                  navigate(`/course/${course._id}`);
                }}
              >
                Start Learning Now
              </Button>
              <Stack direction="row" spacing={1} justifyContent={'space-between'}
                sx={{
                  mt: 2,
                  width: '100%',
                  gap: 1,
                }}
              >
                <FavoriteBorder color="primary" 
                sx={{
                  transition: 'all ease 0.3s',
                  
                  ":hover": {
                    scale: 1.1,
                    cursor: 'pointer',
                  }
                }}/>
                <Share color="primary" 
                sx={{
                  transition: 'all ease 0.3s',
                  
                  ":hover": {
                    scale: 1.1,
                    cursor: 'pointer',
                  }
                }}
                />
              </Stack>
          </Box>
    </Box>
  );
}

export default Course;