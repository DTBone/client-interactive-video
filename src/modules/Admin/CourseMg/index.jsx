import { useEffect, useState } from "react";
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
  Tooltip,
  Badge,
  Alert,
} from "@mui/material";
import {
  Cancel,
  Check,
  Delete,
  FactCheck,
  Search,
  Visibility,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { getAllCourse } from "~/store/slices/Course/action";
import ReviewCourseModal from "~/modules/Admin/CourseMg/ReviewModal";
import { formatCurrency } from "~/Utils/format";

const CourseManager = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterApproval, setFilterApproval] = useState("all");
  const [openReview, setOpenReview] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(
          getAllCourse({
            page: page + 1,
            limit: rowsPerPage,
            search: searchTerm,
            level: filterLevel,
            status: filterStatus,
            approval: filterApproval,
          })
        );
        if (getAllCourse.fulfilled.match(result)) {
          setCourses(result.payload.data);
          setTotal(result.payload.total || result.payload.count || 0);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        setError("Error loading courses: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [
    dispatch,
    page,
    rowsPerPage,
    searchTerm,
    filterLevel,
    filterStatus,
    filterApproval,
    openReview,
  ]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "success";
      case "intermediate":
        return "primary";
      case "advanced":
        return "error";
      default:
        return "primary";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "unpublished":
        return "warning";
      default:
        return "primary";
    }
  };

  const handleReviewCourse = (courseData) => {
    setOpenReview(true);
    setCourseData(courseData);
  };

  const pendingReviewCount = courses.filter(
    (course) => !course.isApproved
  ).length;

  return (
    <Box className="p-6">
      <Box className="mb-6 flex justify-between items-center">
        <Typography variant="h4">Course Management</Typography>

        <Badge
          badgeContent={pendingReviewCount}
          color="warning"
          max={99}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Chip
            label="Pending Reviews"
            color="primary"
            variant={filterApproval === "pending" ? "filled" : "outlined"}
            onClick={() =>
              setFilterApproval(
                filterApproval === "pending" ? "all" : "pending"
              )
            }
            className="ml-2"
          />
        </Badge>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Box className="flex flex-wrap gap-4 mb-6">
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: <Search size={20} className="mr-2" />,
          }}
          className="w-64"
        />

        <FormControl size="small" variant="outlined" className="w-48">
          <InputLabel>Level</InputLabel>
          <Select
            value={filterLevel}
            onChange={(e) => {
              setFilterLevel(e.target.value);
              setPage(0);
            }}
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
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(0);
            }}
            label="Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="unpublished">Unpublished</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" variant="outlined" className="w-48">
          <InputLabel>Approval</InputLabel>
          <Select
            value={filterApproval}
            onChange={(e) => {
              setFilterApproval(e.target.value);
              setPage(0);
            }}
            label="Approval"
          >
            <MenuItem value="all">All Courses</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending Review</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} className="mb-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              {/* <TableCell>Enrollment</TableCell> */}
              <TableCell>Approved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" className="py-8">
                  <Typography>Loading courses...</Typography>
                </TableCell>
              </TableRow>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    {course.instructor?.profile?.fullname || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={course.level}
                      color={getLevelColor(course.level)}
                    />
                  </TableCell>
                  <TableCell>
                    {course.price === 0
                      ? "Free"
                      : `${formatCurrency(course.price)}`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={course.status}
                      color={getStatusColor(course.status.toLowerCase())}
                    />
                  </TableCell>
                  {/* <TableCell>{course.enrollmentCount}</TableCell> */}
                  <TableCell>
                    {course.isApproved ? (
                      <Chip
                        icon={<Check />}
                        label="Approved"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<Cancel />}
                        label="Pending"
                        color="warning"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box className="flex gap-2">
                      <IconButton
                        onClick={() => handleReviewCourse(course)}
                        size="small"
                        className="text-blue-600"
                      >
                        <Tooltip
                          title={
                            course.isApproved ? "View Details" : "Review Course"
                          }
                        >
                          <FactCheck size={20} />
                        </Tooltip>
                      </IconButton>
                      <IconButton size="small" className="text-blue-600">
                        <Tooltip title="View Course">
                          <Visibility size={20} />
                        </Tooltip>
                      </IconButton>
                      <IconButton size="small" className="text-red-600">
                        <Tooltip title="Delete">
                          <Delete size={20} />
                        </Tooltip>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" className="py-8">
                  <Typography>No courses found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Review Course Modal */}
      {openReview && courseData && (
        <ReviewCourseModal
          courseData={courseData}
          setOpen={setOpenReview}
          open={openReview}
        />
      )}
    </Box>
  );
};

export default CourseManager;
