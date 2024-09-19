/* eslint-disable react/prop-types */
// import styles from './Course.module.scss';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
function Course( { course } ) {
    return ( 
        <Card sx={{ width: 400, height: 400, border: '1px #2ECAFF solid', borderRadius: 4, padding: 2, display:'flex', flexDirection:'column', justifyContent:'start' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image={course.image}
          alt="green iguana"
          sx={{
            borderRadius: 2,
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {course.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {course.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ alignSelf:'start' }}>
        <Button size="small" color="primary" >
          Start now
        </Button>
      </CardActions>
    </Card>
     );
}

export default Course;