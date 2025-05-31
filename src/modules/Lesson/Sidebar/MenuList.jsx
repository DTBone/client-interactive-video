/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomMenuItemButton from "../Button/CustomMenuItemButton";
import IconComponent from "~/Components/Common/Button/IconComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  getModuleItemProgress,
  getProgress,
} from "~/store/slices/Progress/action";
import { getAllModules } from "~/store/slices/Module/action";
import { ArrowForward } from "@mui/icons-material";
import { useCallback } from "react";

const MenuList = ({ module }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(itemId);
  const [showDialog, setShowDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(
    module?.moduleItems?.find((item) => item.quiz === itemId) || null
  );
  const [itemSelected, setItemSelected] = useState(null);
  const dispatch = useDispatch();

  // Get the module item progress from Redux store
  const { moduleItemProgress } = useSelector((state) => state.progress);
  const moduleProgress = useSelector(
    (state) => state.module.currentModule?.data?.progress
  );
  const course = useSelector((state) => state.course.currentCourse);
  const allModules = useSelector((state) => state.module.modules);

  console.log("moduleProgress", moduleProgress);
  console.log("module", module);

  useEffect(() => {
    if (currentItem?.type === "quiz" && currentItem?.status === "completed") {
      // Update the completion status in the menu
      console.log("Quiz completed, updating status");
    }
  }, [currentItem, module?.moduleItems, module, itemId]);

  // Load all modules when component mounts
  useEffect(() => {
    if (course?._id && (!allModules || allModules.length === 0)) {
      dispatch(getAllModules(course._id));
    }
  }, [course?._id, dispatch, allModules]);

  const navigateToItem = (item) => {
    if (item) {
      let navigationpath = `/learns/lessons/${item.type}/${item._id}`;
      navigate(navigationpath, { state: { module, item } });
    }
  };

  const handleConfirmNavigation = () => {
    setShowDialog(false);
    setCurrentItem(itemSelected);
    setActiveButton(
      itemSelected.quiz ||
        itemSelected.programming ||
        itemSelected.reading ||
        itemSelected.video
    );
    navigateToItem(itemSelected);
  };

  const handleModuleItemClick = (item) => {
    console.log("Click module item");
    if (item) {
      let navigationpath = `/learns/lessons/${item.type}/${item._id}`;
      navigate(navigationpath, { state: { module, item } });
    }
  };

  // Load statuses for all module items when component mounts
  useEffect(() => {
    if (module?.moduleItems?.length > 0) {
      loadAllModuleItemStatuses();
    }
  }, [module]);

  // Update progress display when moduleItemProgress changes - REAL TIME UPDATE
  useEffect(() => {
    if (moduleItemProgress) {
      console.log(
        "Module item progress updated:",
        moduleItemProgress,
        moduleItemProgress.moduleItemId,
        moduleItemProgress.completionPercentage
      );
      // Refresh progress data to ensure real-time update
      setTimeout(() => {
        dispatch(getProgress({ courseId: course?._id }));
      }, 100);
    }
  }, [moduleItemProgress, course?._id, dispatch]);

  // Load all module item statuses
  const loadAllModuleItemStatuses = async () => {
    const statusPromises = module.moduleItems.map(async (item) => {
      try {
        await dispatch(getModuleItemProgress({ moduleItemId: item?._id }));
        await dispatch(getProgress({ courseId: course?._id }));
      } catch (error) {
        console.error(`Error loading status for item ${item?._id}:`, error);
      }
    });

    await Promise.all(statusPromises);
  };

  // Function to get status for a specific module item
  const getModuleItemStatus = (itemId) => {
    return moduleProgress?.moduleItemProgresses?.find(
      (item) => item.moduleItemId === itemId
    )?.status;
  };

  // Get next module for navigation
  const getNextModule = () => {
    if (!allModules || !module) return null;
    const currentIndex = allModules.findIndex(
      (m) => m._id === module._id || m.index === module.index
    );
    if (currentIndex !== -1 && currentIndex < allModules.length - 1) {
      return allModules[currentIndex + 1];
    }
    return null;
  };

  // Check if current module is completed (100%)
  const isCurrentModuleCompleted = () => {
    const completionPercentage = moduleProgress?.completionPercentage || 0;
    return completionPercentage === 100;
  };

  // Check if user can proceed to next module
  const canProceedToNextModule = () => {
    return isCurrentModuleCompleted() && getNextModule();
  };

  const handleNextModule = () => {
    const nextModule = getNextModule();
    if (
      nextModule &&
      nextModule.moduleItems &&
      nextModule.moduleItems.length > 0
    ) {
      // Navigate to first item of next module
      const firstItem = nextModule.moduleItems[0];
      navigate(`/learns/lessons/${firstItem.type}/${firstItem._id}`, {
        state: { module: nextModule, item: firstItem },
      });
    }
  };
  const fetch = useCallback(async () => {
    loadAllModuleItemStatuses();
    //dispatch(getModuleItemProgress({ moduleItemId: item?._id }));
    dispatch(getProgress({ courseId: course?._id }));
    console.log("moduleProgress fetch menuList", moduleProgress);
  }, [dispatch, module, course, moduleProgress]);

  useEffect(() => {
    fetch();
  }, [fetch, dispatch, module, course, moduleProgress]);

  return (
    <div
      className="flex flex-col items-start ml-4 pr-2"
      style={{ position: "relative", height: "100%" }}
    >
      <Typography
        sx={{ fontWeight: "bold", fontSize: "medium", paddingLeft: "32px" }}
      >
        {`${module?.title} (${moduleProgress?.completionPercentage || "0"}%)`}
      </Typography>

      <Box
        sx={{
          height: "calc(100vh - 100px)",
          overflow: "hidden",
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "60px",
        }}
      >
        {/* Scrollable content area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "8px", // space for scrollbar
          }}
        >
          {module?.moduleItems?.map((item, index) => (
            <CustomMenuItemButton
              key={index}
              fullWidth
              onClick={() => {
                setItemSelected(item);
                handleModuleItemClick(item);
                setActiveButton(item._id);
              }}
              isActive={activeButton === item._id}
              isCompleted={getModuleItemStatus(item._id) === "completed"}
              icon={<IconComponent icon={item.icon} />}
            >
              <Typography
                fontWeight="bold"
                fontSize="12px"
                sx={{ display: "inline", textTransform: "capitalize" }}
              >
                {item.contentType}
              </Typography>
              <Typography
                fontSize="12px"
                sx={{
                  display: "inline",
                  textTransform: "capitalize",
                  marginLeft: "8px",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                fontSize="10px"
                sx={{ textTransform: "lowercase" }}
                color="#5b6790"
              >
                {item.note}
              </Typography>
            </CustomMenuItemButton>
          ))}
        </div>

        {/* Fixed Button - Always visible at bottom, doesn't affect scroll */}
        {canProceedToNextModule() && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "white",
              borderTop: "1px solid #e0e0e0",
              padding: 1.5,
              zIndex: 1000,
              width: "100%",
              boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
              marginTop: "auto", // Push to bottom
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={handleNextModule}
              endIcon={<ArrowForward fontSize="small" />}
              sx={{
                justifyContent: "space-between",
                textTransform: "none",
                fontSize: "12px",
                color: "primary.main",
                borderColor: "primary.main",
                padding: "8px 12px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "white",
                },
              }}
            >
              <span>Next: {getNextModule()?.title}</span>
            </Button>
          </Box>
        )}

        {/* Progress indicator when module is not completed */}
        {!isCurrentModuleCompleted() && getNextModule() && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#f8f9fa",
              borderTop: "1px solid #e0e0e0",
              padding: 1.5,
              zIndex: 1000,
              width: "100%",
              marginTop: "auto",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "11px",
                color: "text.secondary",
                textAlign: "center",
                display: "block",
                marginBottom: 0.5,
              }}
            >
              Complete this module to unlock next module
            </Typography>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                height: "6px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${moduleProgress?.completionPercentage || 0}%`,
                  backgroundColor: "primary.main",
                  height: "100%",
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: "10px",
                color: "text.secondary",
                textAlign: "center",
                display: "block",
                marginTop: 0.5,
              }}
            >
              {moduleProgress?.completionPercentage || 0}% completed
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="leave-quiz-dialog-title"
      >
        <DialogTitle id="leave-quiz-dialog-title">Leave Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You haven&apos;t completed the quiz yet. All your answers will be
            lost if you leave.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            Stay
          </Button>
          <Button onClick={handleConfirmNavigation} color="error">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MenuList;
