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

function Course({ course }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '370px',
        border: '1px #2ECAFF solid',
        transition: 'all 0.3s',
        borderRadius: 4,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        ":hover": {
          scale: 1.05,
          transition: 'all 0.3s',
        }
      }}
      onClick={() => {
        navigate(`/course/${course._id}`);
      }}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '85%',
          marginBottom: '20px',
        }}
      >
        <CardMedia
          component="img"
          image={course.photo === 'no-photo.jpg' ? 'https://res.cloudinary.com/drhf9fpvf/image/upload/v1728913682/logo_codechef_hzrtyf.png' : course.photo}
          alt="codechef"
          sx={{
            borderRadius: 2,
            minHeight: 0.6,
            padding: '5px',
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {course?.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {course?.description}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1
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
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Start now
        </Button>
      </CardActions>
    </Card>
  );
}

export default Course;