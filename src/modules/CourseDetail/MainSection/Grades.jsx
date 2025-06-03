import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  Box,
  Grid,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  AccessTime,
  Code,
  CheckCircle,
  PlayArrow,
  Schedule,
  TrendingUp,
  Assignment,
  Quiz,
  Launch,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getGradeByCourseId } from "~/store/slices/Course/action";

const getStatusConfig = (status) => {
  switch (status) {
    case "completed":
      return {
        color: "success",
        icon: <CheckCircle />,
        label: "Completed",
        bgColor: "rgba(76, 175, 80, 0.1)",
        textColor: "#4CAF50",
      };
    case "in-progress":
      return {
        color: "warning",
        icon: <Schedule />,
        label: "In Progress",
        bgColor: "rgba(255, 152, 0, 0.1)",
        textColor: "#FF9800",
      };
    case "not-started":
    default:
      return {
        color: "default",
        icon: <PlayArrow />,
        label: "Not Started",
        bgColor: "rgba(158, 158, 158, 0.1)",
        textColor: "#9E9E9E",
      };
  }
};

const getTypeConfig = (type) => {
  switch (type) {
    case "quiz":
      return {
        icon: <Quiz />,
        color: "#FF6B35",
        bgColor: "rgba(255, 107, 53, 0.1)",
        label: "Quiz",
      };
    case "programming":
      return {
        icon: <Code />,
        color: "#3498DB",
        bgColor: "rgba(52, 152, 219, 0.1)",
        label: "Programming",
      };
    default:
      return {
        icon: <Assignment />,
        color: "#9B59B6",
        bgColor: "rgba(155, 89, 182, 0.1)",
        label: "Assignment",
      };
  }
};

const Grades = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseGrade } = useSelector((state) => state.course);
  console.log("courseGrade", courseGrade);

  useEffect(() => {
    dispatch(getGradeByCourseId({ courseId: courseId }));
  }, [courseId, dispatch]);

  const handleItemClick = (item) => {
    const route = `/learns/lessons/${item.Type}/${item._id}`;
    navigate(route);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not completed";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOverallStats = () => {
    if (!courseGrade || !Array.isArray(courseGrade))
      return { completed: 0, total: 0, average: 0 };

    const completed = courseGrade.filter(
      (item) => item.status === "completed"
    ).length;
    const total = courseGrade.length;
    const average =
      courseGrade.reduce((sum, item) => sum + item.completionPercentage, 0) /
      total;

    return { completed, total, average: Math.round(average) };
  };

  const stats = getOverallStats();

  if (!courseGrade || !Array.isArray(courseGrade)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="text.secondary">
          Loading grades...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1976d2" }}
        >
          Course Progress & Grades
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Track your progress across all assignments and quizzes. Click on any
          item to access the content.
        </Typography>

        {/* Overview Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: "rgba(76, 175, 80, 0.1)" }}>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircle sx={{ color: "#4CAF50", fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {stats.completed}/{stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: "rgba(33, 150, 243, 0.1)" }}>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp sx={{ color: "#2196F3", fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {stats.average}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Progress
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: "rgba(255, 152, 0, 0.1)" }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Assignment sx={{ color: "#FF9800", fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {courseGrade.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Grades Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "& th": {
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  py: 2,
                },
              }}
            >
              <TableCell sx={{ bgcolor: "#1976d2", color: "white !important" }}>
                #
              </TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "white !important" }}>
                Type
              </TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "white !important" }}>
                Title
              </TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "white !important" }}>
                Status
              </TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "white !important" }}>
                Progress
              </TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "white !important" }}>
                Completed At
              </TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "white !important" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseGrade.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              const typeConfig = getTypeConfig(item.Type);

              return (
                <TableRow
                  key={item._id}
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(25, 118, 210, 0.04)",
                      cursor: "pointer",
                    },
                    "&:nth-of-type(even)": {
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  {/* Index */}
                  <TableCell>
                    <Typography variant="body1" fontWeight={600}>
                      {index + 1}
                    </Typography>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          bgcolor: typeConfig.bgColor,
                          color: typeConfig.color,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {typeConfig.icon}
                      </Avatar>
                      <Chip
                        label={typeConfig.label}
                        size="small"
                        sx={{
                          bgcolor: typeConfig.bgColor,
                          color: typeConfig.color,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </TableCell>

                  {/* Title */}
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        color: "#1976d2",
                        "&:hover": { textDecoration: "underline" },
                        cursor: "pointer",
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      icon={statusConfig.icon}
                      label={statusConfig.label}
                      color={statusConfig.color}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        bgcolor: statusConfig.bgColor,
                      }}
                    />
                  </TableCell>

                  {/* Progress */}
                  <TableCell sx={{ minWidth: 120 }}>
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={0.5}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {item.completionPercentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.completionPercentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(0,0,0,0.1)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            background:
                              item.completionPercentage === 100
                                ? "linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)"
                                : item.completionPercentage > 0
                                  ? "linear-gradient(90deg, #FF9800 0%, #FFC107 100%)"
                                  : "linear-gradient(90deg, #9E9E9E 0%, #BDBDBD 100%)",
                          },
                        }}
                      />
                    </Box>
                  </TableCell>

                  {/* Completed At */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(item.completedAt)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Action */}
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                      sx={{
                        color: "#1976d2",
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.1)",
                        },
                      }}
                    >
                      <Launch />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {courseGrade.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          textAlign="center"
        >
          <Assignment sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No graded items found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete assignments and quizzes to see your progress here.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Grades;
