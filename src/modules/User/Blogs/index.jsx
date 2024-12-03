import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  IconButton,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import { useDispatch } from 'react-redux';
import { getAllCourse } from '~/store/slices/Course/action.js';

// Sample data
const coursesExam = [
  {
    _id: "673f0a215ffbbd87d3f91640",
    courseId: "java_fundametal",
    title: "Java fundamentals",
    description: "Learn the basic of Java programming language through interactive coding tasks. Students gain extensive hands-on experience writing, compiling, and executing Java programs after finishing the course.",
    level: "beginner",
    price: 0,
    photo: "http://res.cloudinary.com/dgbp29tck/image/upload/v1732184753/java_qpyfdu.jpg",
    enrollmentCount: 0,
    tags: ["Java"],
    status: "published",
    averageRating: 3.857142857142857
  }
  // Add more sample courses here
];
const suggestedTags = [
    // Ngôn ngữ lập trình
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust',
    // Framework & Libraries
    'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Express.js',
    // Database
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    // Development Tools
    'Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'Google Cloud',
    // Mobile Development
    'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin',
    // Web Development
    'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS', 'TypeScript', 'WebPack', 'REST API', 'GraphQL',
    // Testing
    'Unit Testing', 'Integration Testing', 'Jest', 'Selenium', 'Cypress',
    // Development Concepts
    'OOP', 'Design Patterns', 'Data Structures', 'Algorithms', 'Clean Code', 'Microservices',
    'DevOps', 'Agile', 'TDD', 'CI/CD',
    // Security
    'Cybersecurity', 'Authentication', 'Authorization', 'OAuth', 'JWT',
    // Level
    'Beginner', 'Intermediate', 'Advanced',
    // Course Type
    'Frontend', 'Backend', 'Full Stack', 'Data Science', 'Machine Learning', 'AI',
    'Game Development', 'Mobile Development', 'Desktop Development'
];

const CourseDisplay = () => {
    const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentTag, setCurrentTag] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(coursesExam);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const getCourseByFilter = async (limit, page) => {
    try {
        setLoading(true);
        const param = {
            limit,
            page,
            search: searchTerm ? searchTerm : ''
        }
        const result = await dispatch(getAllCourse(param));

        if (getAllCourse.fulfilled.match(result)) {
            const newCourses = result.payload.data;
            setCourses(newCourses);
            return newCourses;
        }
        return [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error);
        setCourses([]);
        return [];
    } finally {
        setLoading(false);
    }
  }

  const handleTagChange = (event, newValue) => {
    if (newValue && !selectedTags.includes(newValue)) {
        setSelectedTags(prev => ([...prev, newValue]));
        setCurrentTag(null);
        setInputValue('');
    }
};

const handleDeleteTag = (tagToDelete) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToDelete));
};


  return (
    <Box sx={{ p: 3 }}>
      {/* Filters Section */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search Courses"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && getCourseByFilter(10, 1)}
          InputProps={{
            endAdornment: (
            <>
              <IconButton onClick={() => getCourseByFilter(10, 1)}>
                <SearchIcon />
              </IconButton>
              {selectedTags.map((tag, index) => {
                if (index < 5){
                      return (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          color="secondary" 
                          onDelete={() => handleDeleteTag(tag)}
                      />
                      )
                  }
                if (index === 5){
                    return (
                      <Chip 
                        key={tag} 
                        label="+" 
                        size="small" 
                        color="secondary" 
                        onDelete={() => handleDeleteTag(tag)}
                      />
                    )
                }
                else 
                    return;
              })}
              </>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Level</InputLabel>
          <Select
            value={selectedLevel}
            label="Level"
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="beginner">Beginner</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </Select>
        </FormControl>

        <Autocomplete
            value={currentTag}
            onChange={handleTagChange}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={suggestedTags.filter(tag =>
                !selectedTags.includes(tag)
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="small"
                    label="Add Tag"
                    placeholder="Type or select a tag"
                    fullWidth
                >
                    
                </TextField>
            )}
            freeSolo
            style={{ minWidth: 250 }}
        />
        
      </Stack>

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={course.photo}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description.length > 150 
                    ? `${course.description.substring(0, 150)}...` 
                    : course.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip 
                    label={course.level} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  {course.tags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  ))}
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Rating 
                    value={course.averageRating} 
                    precision={0.5} 
                    readOnly 
                    size="small"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PeopleIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {course.enrollmentCount}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {courses.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No courses found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CourseDisplay;