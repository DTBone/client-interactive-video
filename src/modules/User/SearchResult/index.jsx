import { useState } from 'react';
import {
  Box,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  Container,
  InputAdornment,
  Pagination,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

const SearchInterface = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  // Example data - in real app, this would come from API
  const searchResults = {
    success: true,
    page: 1,
    limit: 10,
    count: 1,
    data: [{
      _id: "6746c7e434c28012dd23fad9",
      courseId: "WEB-001",
      title: "Web Development (HTML, CSS, JS)",
      description: "Web Development (HTML, CSS, JS)",
      instructor: {
        _id: "67149a012b0afe90194e382c",
        email: "thanhbinhdang1411@gmail.com"
      },
      level: "beginner",
      price: 0,
      photo: "http://res.cloudinary.com/dgbp29tck/image/upload/v1732691940/jhep-coursera-course4_stq2oq.png",
      enrollmentCount: 0,
      tags: ["HTML", "CSS", "JavaScript"],
      status: "published",
      createdAt: "2024-11-27T07:19:00.862Z"
    }]
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Found {searchResults.count} course(s)
      </Typography>

      {/* Course Cards */}
      <Grid container spacing={3}>
        {searchResults.data.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={course.photo}
                alt={course.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {course.title}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <SchoolIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor.email}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <PriceCheckIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </Typography>
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    size="small"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {course.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Published: {formatDate(course.createdAt)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(searchResults.count / searchResults.limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default SearchInterface;