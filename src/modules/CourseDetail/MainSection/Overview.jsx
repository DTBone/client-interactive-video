import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Book,
  Clock,
  Star,
  Calendar,
  Users,
  CheckCircle,
  PlayCircle,
  Lock,
  Award,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCertificateByCourseId,
  getCourseByID,
} from "~/store/slices/Course/action";
import { getProgress } from "~/store/slices/Progress/action";
import {
  Typography,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
  Badge,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Circle } from "@mui/icons-material";

// Enum for module status
const MODULE_STATUS = {
  LOCKED: "locked",
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
}));

const Overview = () => {
  const { currentCourse } = useSelector((state) => state.course);
  const [isHovered, setIsHovered] = useState(false);
  const { checkProgress } = useSelector((state) => state.progress);
  const [courseProgress, setCourseProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  console.log("params", params);
  useEffect(() => {
    console.log("Effect running, courseId:", courseId);
    if (courseId) {
      dispatch(getProgress(courseId));
    }
  }, [courseId, currentCourse, dispatch]);

  const progressData = useSelector((state) => state.progress);
  // const courseCompletion = useSelector((state) => state.courseCompletion);
  useEffect(() => {
    if (progressData) {
      console.log("Progress data:", progressData);
      setCourseProgress(progressData.progress);
      //const completedModules = progressData?.progress.filter(item => item.status === 'completed').length;
      //const totalModules = progressData?.progress.length;
      setOverallProgress(
        progressData.courseCompletion.percentage
          ? Math.round(progressData.courseCompletion.percentage)
          : 0
      );
      console.log("progressData", progressData);
      console.log("overallProgress", overallProgress);
    }
  }, [progressData]);

  const data = currentCourse ? currentCourse : "";

  const handleCerClick = () => {
    console.log("Certificate Clicked");
    navigate(`/certificate/${courseId}`, {
      state: { courseId, course: currentCourse },
    });
  };

  const handleModuleClick = (module) => {
    navigate(`/learns/${courseId}/module/${module.index}`, {
      state: { module, course: currentCourse },
    });
  };

  const getModuleStatus = (moduleIndex) => {
    if (!courseProgress || courseProgress.length === 0)
      return MODULE_STATUS.NOT_STARTED;

    // Check if previous module is completed
    if (
      moduleIndex > 0 &&
      (!courseProgress[moduleIndex - 1] ||
        courseProgress[moduleIndex - 1].status !== "completed")
    ) {
      return MODULE_STATUS.LOCKED;
    }

    // Check current module status
    const moduleProgress = courseProgress[moduleIndex];
    if (!moduleProgress) return MODULE_STATUS.NOT_STARTED;

    if (moduleProgress.status === "completed") {
      return MODULE_STATUS.COMPLETED;
    } else if (moduleProgress.status === "in_progress") {
      return MODULE_STATUS.IN_PROGRESS;
    }

    return MODULE_STATUS.NOT_STARTED;
  };

  const getModuleIcon = (status) => {
    switch (status) {
      case MODULE_STATUS.COMPLETED:
        return <CheckCircle size={20} className="text-green-600" />;
      case MODULE_STATUS.IN_PROGRESS:
        return <PlayCircle size={20} className="text-yellow-500" />;
      case MODULE_STATUS.LOCKED:
        return <Lock size={20} className="text-gray-400" />;
      default:
        return <Circle size={20} className="text-blue-400" />;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!currentCourse) return null;

  // Calculate estimated completion time
  const totalLessons =
    data.modules?.reduce((acc, module) => acc + module.moduleItems.length, 0) ||
    0;
  const estimatedHours = Math.ceil(totalLessons * 0.5); // Assuming 30 mins per lesson

  // Format creation date
  const creationDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      {/* Certificate Button */}
      {overallProgress === 100 && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={handleCerClick}
              className={`
                relative 
                px-6 
                py-3 
                text-white 
                font-bold 
                rounded-lg 
                transition-all 
                duration-300 
                ease-in-out 
                bg-blue-600 
                hover:bg-blue-700 
                shadow-lg 
                hover:shadow-xl 
                ${isHovered ? "" : "animate-pulse"}
              `}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="flex items-center">
                <Award className="mr-2" size={20} />
                {isHovered ? "View Certificate" : "Certificate"}
                {isHovered && <ChevronRight size={16} className="ml-1" />}
              </span>
            </button>
          </motion.div>
        </Box>
      )}

      {/* Course Header Section */}
      <motion.div
        className="flex flex-col md:flex-row gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Course Image */}
        <motion.div className="md:w-1/3" variants={itemVariants}>
          <motion.img
            src={data?.photo}
            alt={data?.title}
            className="w-full h-60 object-cover rounded-lg shadow-md"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />

          {/* Progress Bar */}
          <Box mt={2} mb={1}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" fontWeight="medium">
                Course Progress
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {overallProgress}%
              </Typography>
            </Box>
            <ProgressBar
              variant="determinate"
              value={overallProgress}
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    overallProgress === 100 ? "#4caf50" : "#2196f3",
                },
              }}
            />
          </Box>

          {/* Course Stats */}
          <Box className="mt-4 bg-gray-50 rounded-lg p-4">
            <Typography variant="h6" className="font-semibold mb-3">
              Course Details
            </Typography>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-sm">Created: {creationDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span className="text-sm">~{estimatedHours} hours</span>
              </div>

              <div className="flex items-center gap-2">
                <Book size={16} className="text-blue-500" />
                <span className="text-sm">{totalLessons} lessons</span>
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                <span className="text-sm">
                  {data.enrollmentCount || 0} students
                </span>
              </div>
            </div>
          </Box>
        </motion.div>

        {/* Course Details */}
        <motion.div className="md:w-2/3 space-y-4" variants={itemVariants}>
          <Typography variant="h4" fontWeight="bold" className="text-gray-800">
            {data?.title}
          </Typography>

          {/* Course Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Chip
              icon={<Star className="text-yellow-500" size={16} />}
              label={`${data?.averageRating?.toFixed(2) || "0.00"} Rating`}
              variant="outlined"
              className="font-medium"
            />

            <Chip
              icon={<Book className="text-blue-500" size={16} />}
              label={`${data?.level || "Beginner"} Level`}
              variant="outlined"
              className="font-medium"
            />

            <Chip
              icon={<CheckCircle className="text-green-500" size={16} />}
              label={
                checkProgress
                  ? "Certificate Available"
                  : "Complete to Earn Certificate"
              }
              variant="outlined"
              color={checkProgress ? "success" : "default"}
              className="font-medium"
            />
          </div>

          <Divider />

          {/* Description */}
          <div className="mt-4">
            <Typography variant="h6" fontWeight="600" className="mb-2">
              Course Description
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700 leading-relaxed"
            >
              {data?.description || "No description available for this course."}
            </Typography>
          </div>

          {/* Skills You'll Gain */}
          <div className="mt-4">
            <Typography variant="h6" fontWeight="600" className="mb-2">
              Skills You'll Gain
            </Typography>
            <div className="flex flex-wrap gap-2">
              {data?.skills?.length > 0 ? (
                data.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    color="primary"
                    variant="outlined"
                    className="animate-fadeIn"
                  />
                ))
              ) : (
                <Typography variant="body2" className="text-gray-500 italic">
                  Skills information not available
                </Typography>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modules Section */}
      <motion.div
        className="mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography
          variant="h5"
          fontWeight="600"
          className="mb-4 flex items-center"
        >
          <Book className="mr-2" size={20} />
          Course Modules
          <Chip
            label={`${data?.modules?.length || 0} modules`}
            size="small"
            color="primary"
            className="ml-2"
          />
        </Typography>

        <div className="grid md:grid-cols-2 gap-5">
          {data?.modules.map((module, index) => {
            const moduleStatus = getModuleStatus(index);
            const isLocked = moduleStatus === MODULE_STATUS.LOCKED;

            return (
              <motion.div
                key={module._id}
                variants={itemVariants}
                whileHover={isLocked ? {} : { scale: 1.02 }}
                whileTap={isLocked ? {} : { scale: 0.98 }}
                onClick={() => !isLocked && handleModuleClick(module)}
                className={`${!isLocked ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <StyledCard
                  variant="outlined"
                  className={`
                    relative overflow-hidden
                    ${moduleStatus === MODULE_STATUS.COMPLETED ? "border-l-4 border-l-green-500" : ""}
                    ${moduleStatus === MODULE_STATUS.IN_PROGRESS ? "border-l-4 border-l-yellow-500" : ""}
                    ${moduleStatus === MODULE_STATUS.NOT_STARTED ? "border-l-4 border-l-blue-400" : ""}
                    ${moduleStatus === MODULE_STATUS.LOCKED ? "border-l-4 border-l-gray-300 opacity-70" : ""}
                  `}
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white p-3 rounded-full shadow">
                        <Lock size={24} className="text-gray-500" />
                      </div>
                    </div>
                  )}

                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {moduleStatus === MODULE_STATUS.COMPLETED && (
                          <CheckCircle size={20} className="text-green-600" />
                        )}
                        {moduleStatus === MODULE_STATUS.IN_PROGRESS && (
                          <PlayCircle size={20} className="text-yellow-500" />
                        )}
                        {moduleStatus === MODULE_STATUS.NOT_STARTED && (
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          >
                            <Circle size={20} className="text-blue-400" />
                          </motion.div>
                        )}
                        {moduleStatus === MODULE_STATUS.LOCKED && (
                          <Lock size={20} className="text-gray-400" />
                        )}

                        <Badge
                          color={
                            moduleStatus === MODULE_STATUS.COMPLETED
                              ? "success"
                              : moduleStatus === MODULE_STATUS.IN_PROGRESS
                                ? "warning"
                                : moduleStatus === MODULE_STATUS.NOT_STARTED
                                  ? "info"
                                  : "default"
                          }
                          variant="dot"
                        >
                          <Typography
                            variant="h6"
                            className="font-medium text-gray-800"
                          >
                            Module {module.index}: {module.title}
                          </Typography>
                        </Badge>
                      </div>

                      <Tooltip title="Estimated time">
                        <div className="flex items-center text-gray-500">
                          <Clock size={16} className="mr-1" />
                          <span className="text-sm">
                            {Math.ceil(module.moduleItems.length * 0.5)}h
                          </span>
                        </div>
                      </Tooltip>
                    </div>

                    <Typography variant="body2" className="text-gray-600 mb-3">
                      {module.description || "No description available"}
                    </Typography>

                    <div className="flex justify-between items-center">
                      <Chip
                        size="small"
                        label={`${module.moduleItems.length} ${module.moduleItems.length !== 1 ? "Lessons" : "Lesson"}`}
                        className="bg-gray-100"
                      />

                      {!isLocked && (
                        <Typography
                          variant="body2"
                          color="primary"
                          className="flex items-center"
                        >
                          {moduleStatus === MODULE_STATUS.COMPLETED
                            ? "Review"
                            : "Start"}
                          <ChevronRight size={16} />
                        </Typography>
                      )}
                    </div>
                  </CardContent>
                </StyledCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Overview;
