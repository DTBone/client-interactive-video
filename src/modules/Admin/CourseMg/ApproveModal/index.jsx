import { useState } from "react";
import { useDispatch } from "react-redux";
import { approveCourse, rejectCourse } from "~/store/slices/Course/action";
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  CheckCircle,
  Warning,
  AccessTime,
  MonetizationOn,
  Category,
  Assessment,
  Person,
  Description,
  Language,
  Launch,
  Preview,
  Cancel,
  VideoLibrary,
  FactCheck,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ReviewCourseModal({ open, setOpen, courseData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [messageBox, setMessageBox] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "success";
      case "intermediate":
        return "primary";
      case "advanced":
        return "error";
      default:
        return "default";
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleApprove = async () => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this course?"
    );
    if (confirmApprove) {
      setLoading(true);
      try {
        const result = await dispatch(
          approveCourse({
            courseId: courseData._id,
            feedback: feedback,
            isApproved: true,
          })
        );

        if (approveCourse.fulfilled.match(result)) {
          setMessageBox("Course approved successfully");
          setTimeout(() => {
            setOpen(false);
            setFeedback("");
          }, 2000);
        } else {
          setMessageBox("Failed to approve course");
        }
      } catch (error) {
        setMessageBox("Error approving course");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = async () => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this course?" + feedback
    );
    if (!feedback.trim()) {
      setMessageBox(
        "Please provide feedback to the instructor about why the course is being rejected"
      );
      return;
    }

    if (confirmReject) {
      setLoading(true);
      try {
        const result = await dispatch(
          approveCourse({
            courseId: courseData._id,
            feedback: feedback,
            isApproved: false,
          })
        );

        if (rejectCourse.fulfilled.match(result)) {
          setMessageBox("Course rejected successfully");
          setTimeout(() => {
            setOpen(false);
            setFeedback("");
          }, 2000);
        } else {
          setMessageBox("Failed to reject course");
        }
      } catch (error) {
        setMessageBox("Error rejecting course");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewCourse = () => {
    window.open(`/course/${courseData._id}`, "_blank");
  };

  const handlePreview = () => {
    window.open(`/courses/${courseData._id}/preview`, "_blank");
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="review-course-modal"
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: 0.5,
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 700 },
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <FactCheck color="primary" fontSize="large" />
            <Typography variant="h6">Course Review</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={courseData?.status?.toUpperCase()}
              color={courseData?.status === "published" ? "success" : "warning"}
            />
            <Chip
              label={courseData?.isApproved ? "APPROVED" : "PENDING"}
              color={courseData?.isApproved ? "success" : "warning"}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Course Details" icon={<Description />} />
          <Tab label="Content Preview" icon={<VideoLibrary />} />
        </Tabs>

        {/* Course Information */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {/* Title and Basic Info */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {courseData?.title}
              </Typography>
            </Grid>

            {/* Course Details */}
            <Grid item xs={12}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Instructor"
                    secondary={
                      courseData?.instructor?.profile?.fullname || "Unknown"
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Category />
                  </ListItemIcon>
                  <ListItemText
                    primary="Category"
                    secondary={courseData?.category?.name}
                  />
                  <Chip
                    label={courseData?.level}
                    color={getLevelColor(courseData?.level)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <AccessTime />
                  </ListItemIcon>
                  <ListItemText
                    primary="Duration"
                    secondary={`${courseData?.totalDuration || 0} hours`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <MonetizationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Price"
                    secondary={`${courseData?.price} VND`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  <ListItemText
                    primary="Language"
                    secondary={courseData?.language}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Assessment />
                  </ListItemIcon>
                  <ListItemText
                    primary="Content"
                    secondary={`${courseData?.totalLectures || 0} lectures • ${courseData?.totalQuizzes || 0} quizzes`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText
                    primary="Description"
                    secondary={courseData?.description}
                    secondaryTypographyProps={{
                      sx: {
                        maxHeight: 100,
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                      },
                    }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        )}

        {/* Content Preview */}
        {tabValue === 1 && (
          <Box sx={{ minHeight: "300px" }}>
            <Typography variant="h6" gutterBottom>
              Course Content
            </Typography>

            {courseData?.modules?.length > 0 ? (
              courseData.modules.map((module, index) => (
                <Box key={module._id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {index + 1}. {module.title}
                  </Typography>
                  <List dense>
                    {module.items?.map((item, itemIndex) => (
                      <ListItem key={item._id}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          {item.type === "video" ? (
                            <VideoLibrary fontSize="small" />
                          ) : (
                            <FactCheck fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${itemIndex + 1}. ${item.title}`}
                          secondary={
                            item.type === "video"
                              ? `${item.duration || 0} min`
                              : "Quiz"
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))
            ) : (
              <Alert severity="info">No content available for preview.</Alert>
            )}
          </Box>
        )}

        {/* Feedback Section */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={
              courseData?.isApproved
                ? "Feedback"
                : "Review Feedback (Required for rejection)"
            }
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add your review comments or feedback for the instructor..."
            required={!courseData?.isApproved}
            error={!feedback.trim() && tabValue === 0}
            helperText={
              !feedback.trim() && tabValue === 0
                ? "Feedback is required for course rejection"
                : ""
            }
          />
        </Grid>

        {/* Message Box */}
        {messageBox && (
          <Box sx={{ mt: 2 }}>
            <Alert
              severity={
                messageBox.includes("successfully") ? "success" : "error"
              }
              onClose={() => setMessageBox("")}
            >
              {messageBox}
            </Alert>
          </Box>
        )}

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box
            display="flex"
            gap={2}
            justifyContent="flex-end"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={handlePreview}
            >
              Preview Course
            </Button>
            <Button
              variant="outlined"
              startIcon={<Launch />}
              onClick={handleViewCourse}
            >
              View Course
            </Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            {!courseData?.isApproved && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={handleReject}
                  disabled={loading || !feedback.trim()}
                >
                  Reject Course
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckCircle />}
                  onClick={handleApprove}
                  disabled={loading}
                >
                  Approve Course
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ReviewCourseModal;
