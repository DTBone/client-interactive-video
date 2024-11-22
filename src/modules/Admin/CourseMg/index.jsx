import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material'
import { Check, Close, Delete, Edit, FactCheck, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourse } from '~/store/slices/Course/action'
import ApproveCourseModal from "~/modules/Admin/CourseMg/ApproveModal";

const CourseManager = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openApprove, setOpenApprove] = useState(false);
  const [courseData, setCourseData] = useState(null);

  // Sample data from your JSON
  const [courses, setCourses] = useState(useSelector(state => state.course.courses))

  useEffect(() => {
    const getCourse = async () => {
        const result = await dispatch(getAllCourse());
        if(getAllCourse.fulfilled.match(result)) {
            setCourses(result.payload.data);
        }
        else
        {
            console.log("error")
        }
    }
    if(courses.length === 0) {
      getCourse();
    }
  }, [dispatch, courses, openApprove])

  // Filter and search logic
  const filteredCourses = courses.length > 0 ? courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  }) : null;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'unpublished':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleApprove = (courseData) => {
    setOpenApprove(true);
    setCourseData(courseData);
  }

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6">
        Course Management
      </Typography>

      {/* Filters and Search */}
      <Box className="flex flex-wrap gap-4 mb-6">
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} className="mr-2" />
          }}
          className="w-64"
        />

        <FormControl size="small" variant="outlined" className="w-48">
          <InputLabel>Level</InputLabel>
          <Select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            label="Level"
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="beginner">Beginner</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" variant="outlined" className="w-48">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="unpublished">Unpublished</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} className="mb-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Enrollment</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses ? filteredCourses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={course.level}
                      className={`${getLevelColor(course.level)}`}
                    />
                  </TableCell>
                  <TableCell>
                    ${course.price}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={course.status}
                      className={`${getStatusColor(course.status)}`}
                    />
                  </TableCell>
                  <TableCell>{course.enrollmentCount}</TableCell>
                  <TableCell>
                    {course.isApproved ? (
                      <Check className="text-green-600" />
                    ) : (
                      <Close className="text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box className="flex gap-2">
                      {!course.isApproved ? (
                        <IconButton onClick={() => handleApprove(course)} size="small" className="text-blue-600">
                        <Tooltip title="Approve"><FactCheck size={20} /></Tooltip>
                      </IconButton>
                      ) : ''}
                      {openApprove ? (<ApproveCourseModal courseData={course} setOpen={setOpenApprove} open={openApprove} />) : ''}
                      <IconButton size="small" className="text-blue-600">
                      <Tooltip title="Edit"><Edit size={20} /></Tooltip>
                      </IconButton>
                      <IconButton size="small" className="text-red-600">
                      <Tooltip title="Delete"><Delete size={20} /></Tooltip>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              )) : ''}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredCourses?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default CourseManager;