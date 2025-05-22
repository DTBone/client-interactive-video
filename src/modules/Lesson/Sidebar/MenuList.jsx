/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomMenuItemButton from "../Button/CustomMenuItemButton";
import IconComponent from "~/Components/Common/Button/IconComponent";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getModuleItemProgress, getModuleProgress, getProgress } from "~/store/slices/Progress/action";

const MenuList = ({ module, onQuizSubmit }) => {
  // Add state to track module item statuses
  const [moduleItemStatuses, setModuleItemStatuses] = useState({});

  const { itemId } = useParams();
  const location = useLocation();
  console.log("location", location);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(itemId);
  const [showDialog, setShowDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(
    module?.moduleItems?.find((item) => item.quiz === itemId) || null
  );
  const [itemSelected, setItemSelected] = useState(null);
  const dispatch = useDispatch();

  const [status, setStatus] = useState("loading");

  // Get the module item progress from Redux store
  const { loading, error, moduleItemProgress } = useSelector(
    (state) => state.progress
  );
const moduleProgress = useSelector((state) => state.module.currentModule?.data?.progress);
console.log("moduleProgress", moduleProgress);
  const course = useSelector((state) => state.course.currentCourse);
//console.log("course", course);
console.log("module", module);
  //     const moduleItemId = useParams().itemId;
  //     console.log("moduleItemId", moduleItemId);
  //     React.useEffect(() => {
  //       if (moduleItemId) {
  //         dispatch(getModuleItemProgress({ moduleItemId }));
  //         console.log("modeleItemProgresses", moduleItemProgress);
  //       }
  //     }, [moduleItemId, dispatch]);
  // console.log('module', module)

  useEffect(() => {
    if (currentItem?.type === "quiz" && currentItem?.status === "completed") {
      // Update the completion status in the menu
      const updatedModuleItems = module?.moduleItems?.map((item) => {
        if (item.quiz === currentItem.quiz) {
          return { ...item, status: "completed" };
        }
        return item;
      });
    }
  }, [currentItem, module?.moduleItems, module, itemId]);

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

  // Update local state when moduleItemProgress changes
  useEffect(() => {
    if (moduleItemProgress ) {
      updateModuleItemStatus(
        moduleItemProgress.moduleItemId,
        moduleItemProgress.completionPercentage
      );
      console.log(
        "Module item progress updated:",
        moduleItemProgress,
        moduleItemProgress.moduleItemId,
        moduleItemProgress.completionPercentage
      );
    }
  }, [moduleItemProgress]);

  // Load all module item statuses
  const loadAllModuleItemStatuses = async () => {
    const statusPromises = module.moduleItems.map(async (item) => {
      try {
        // Dispatch action for each module item
        await dispatch(getModuleItemProgress({ moduleItemId: item?._id }));
        // The actual status will be updated in the useEffect when moduleItemProgress changes
        //await dispatch(getModuleProgress(course._id));
        await dispatch(getProgress({ courseId: course._id }));
      } catch (error) {
        console.error(`Error loading status for item ${item?._id}:`, error);
      }
    });

    await Promise.all(statusPromises);
  };

  // Update specific module item status in state
  const updateModuleItemStatus = (itemId, completionPercentage) => {
    let status = "unknown";

    if (completionPercentage === 0) {
      status = "not-started";
    } else if (completionPercentage === 100) {
      status = "completed";
    } else {
      status = "in-progress";
    }

    setModuleItemStatuses((prev) => ({
      ...prev,
      [itemId]: status,
    }));
};

// Function to get status for a specific module item
const getModuleItemStatus = (itemId) => {
      return moduleProgress?.moduleItemProgresses?.find(
        (item) => item.moduleItemId === itemId
      )?.status;
    
  };

  return (
    <div className="flex flex-col items-start ml-4 pr-2">
      <Typography
        sx={{ fontWeight: "bold", fontSize: "medium", paddingLeft: "32px" }}
      >
        {`${module?.title} (${moduleProgress?.completionPercentage || "0"}%)`}
      </Typography>
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

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="leave-quiz-dialog-title"
      >
        <DialogTitle id="leave-quiz-dialog-title">Leave Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You haven't completed the quiz yet. All your answers will be lost if
            you leave.
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
