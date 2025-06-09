import * as React from "react";
import {
  Box,
  Tab,
  Paper,
  Typography,
  IconButton,
  Stack,
  Divider,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Description,
  AccessTime,
  CalendarToday,
} from "@mui/icons-material";

import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLectureById } from "~/store/slices/Quiz/action";
import { useOutletContext } from "react-router-dom";
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { setSidebar } from "~/store/slices/ModuleItem/moduleItemSlice";
import NoteVideo from "./NoteVideo";
import { getModuleItemProgress } from "~/store/slices/Progress/action";
import Video from "../Components/VideoPlayer/Video";
import { preloadInteractiveQuestion } from "~/store/slices/ModuleItem/action";
import { useVideoQuestionPreloader } from "../Hooks/usePreloadVideo";

const Lecture = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const progress = useSelector((state) => state.progress.progress);
  const moduleItemProgress = useSelector(
    (state) => state.progress.moduleItemProgress
  );
  const isExpandedRedux = useSelector((state) => state.moduleItem.isExpanded);
  // console.log('isExpandedRedux', isExpandedRedux);
  // React.useEffect(() => {
  //     console.log('isExpandedRedux', isExpandedRedux);
  // }, [isExpandedRedux])

  const lectureId = location.state?.item?.video;
  //console.log('location', location.state.item);
  //   const moduleItemId = useParams().itemId;
  //   console.log("moduleItemId", moduleItemId);
  //   React.useEffect(() => {
  //     if (moduleItemId) {
  //       dispatch(getModuleItemProgress({ moduleItemId }));
  //     }
  //   }, [moduleItemId, dispatch]);

  const { onQuizSubmit } = useOutletContext();
  const [value, setValue] = React.useState("1");
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [lecture, setLecture] = React.useState({});
  const [alert, setAlert] = React.useState("");

  const [openNote, setOpenNote] = React.useState(false);

  console.log("progress", progress);

  const getLecture = async () => {
    const result = await dispatch(getLectureById(lectureId._id));
    if (result.payload.success) {
      setLecture({ ...result.payload.data, title: location.state.item.title });
      setIsCompleted(progress.status == "completed");
    } else {
      console.log("Failed to get lecture");
    }
  };

  React.useEffect(() => {
    getLecture();
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Convert seconds to HH:MM:SS format
  const formatDuration = (seconds) => {
    console.log("seconds", seconds);
    seconds = Math.floor(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOpenNote = () => {
    console.log("Open note");
    // dispatch(setSidebar(!isExpandedRedux));
    setOpenNote(!openNote);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-start">
      <div className="w-full max-w-6xl mx-auto">
        <Box
          sx={{
            width: "100%",
            height: "100%",
            typography: "body1",
            backgroundColor: "transparent",
          }}
        >
          <div className="w-full max-w-4xl">
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <Video
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onQuizSubmit={onQuizSubmit}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center">
            <Typography variant="h5" sx={{ p: 2, fontWeight: "bold" }}>
              {lecture?.title || "Video"}
            </Typography>

            {/* <EditNoteIcon
              sx={{ fontSize: 30, color: "#1976d2", marginRight: "16px" }}
              onClick={handleOpenNote}
              className="cursor-pointer"
              titleAccess="Open note"
            /> */}
          </div>

          <div className="flex flex-col h-full mt-4">
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleChange}>
                  {/* <Tab label="Note" value="1" /> */}
                  <Tab label="Infomation" value="1" />
                </TabList>
              </Box>

              {/* <TabPanel value="1" sx={{ p: 0 }}>
                            <div className=" mt-2 ">
                                <NoteVideo />
                            </div>
                        </TabPanel> */}

              <TabPanel value="1">
                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Description /> Description
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {lecture.description}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <AccessTime /> Time: {formatDuration(lecture.duration)}{" "}
                      minutes
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <CalendarToday /> Created day:{" "}
                      {formatDate(lecture.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </TabPanel>
            </TabContext>

            <div className="flex flex-col overflow-y-scroll w-full">
              <Divider
                sx={{
                  backgroundColor: "#1976d2",
                  height: "auto",
                  width: "8px",
                  marginTop: "16px",
                  marginBottom: "16px",
                }}
                // orientation="vertical" flexItem
              />
            </div>
          </div>
        </Box>
        <Snackbar
          open={Boolean(alert)}
          autoHideDuration={5000}
          onClose={() => setAlert("")}
        >
          <Alert
            onClose={() => setAlert("")}
            severity={"success"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alert}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Lecture;
