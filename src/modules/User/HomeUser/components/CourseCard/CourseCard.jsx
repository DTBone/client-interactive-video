import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "#4caf50"; // Green
      case "intermediate":
        return "#ff9800"; // Orange
      case "advanced":
        return "#f44336"; // Red
      default:
        return "#2196f3"; // Blue
    }
  };
  const navigate = useNavigate();
  const formatLevel = (level) => {
    if (!level) return "N/A";
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  };
  const handleCourseClick = () => {
    // Handle course click event here
    console.log("Course clicked:", course._id);
    navigate(`/course/${course._id}`);
  };
  return (
    <div>
      <Card
        onClick={handleCourseClick}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 6, // Tăng bóng đổ khi hover
            "& .MuiChip-root": {
              // Ensure chip always stays at the same position relative to card
              transform: "scale(0.952)", // 1/1.05 to counteract card scaling
            },
          },
        }}
      >
        <Chip
          label={formatLevel(course.level)}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 10, // Ensure chip is above other elements
            backgroundColor: getLevelColor(course.level),
            color: "white",
            fontWeight: "bold",
            fontSize: "0.7rem",
            opacity: 1, // Ensure it's fully visible
            visibility: "visible", // Ensure it's visible
          }}
        />
        <CardMedia
          component="img"
          height="140"
          image={course.photo}
          alt={course.title}
          sx={{
            height: "180px", // Chiều cao cố định
            objectFit: "cover", // Đảm bảo ảnh phủ kín không gian mà không bị méo
            objectPosition: "center", // Căn giữa ảnh
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap>
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {course.instructor?.profile?.fullname || "Instructor not available"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Rating value={course.averageRating} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {course.averageRating ? course.averageRating.toFixed(1) : "N/A"}
            </Typography>
          </Box>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
            {course?.price === 0
              ? "Free"
              : `${course?.price?.toLocaleString() || "N/A"}₫`}
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{ ml: "auto" }}
            onClick={handleCourseClick}
          >
            Detail
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default CourseCard;
