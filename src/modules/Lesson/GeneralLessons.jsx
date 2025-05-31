import Grid from "@mui/material/Grid";
import SideBar from "./SideBar/SideBar";
import { Divider } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Breadcrumb from "~/Components/Common/Breadcrumbs/Breadcrumb";
import { useEffect, useState, useCallback } from "react";
import CustomScrollbar from "~/Components/Common/CustomScrollbar";
import { useDispatch, useSelector } from "react-redux";
import Header from "~/Components/Header";
import { setSidebar } from "~/store/slices/ModuleItem/moduleItemSlice";

const GeneralLessons = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isExpandedRedux = useSelector((state) => state.moduleItem.isExpanded);
  const [isExpanded, setIsExpanded] = useState(true);
  const courseID = localStorage.getItem("courseId");
  const moduleID = localStorage.getItem("moduleId");

  // Submission states for different content types
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isSupplementSubmitted, setIsSupplementSubmitted] = useState(false);
  const [isVideoSubmitted, setIsVideoSubmitted] = useState(false);
  const [isProgrammingSubmitted, setIsProgrammingSubmitted] = useState(false);

  // Memoized submission handlers for different content types
  const onQuizSubmit = useCallback((result) => {
    console.log("Quiz submission result:", result);
    setIsQuizSubmitted(result || false);
  }, []);

  const onSupplementSubmit = useCallback((result) => {
    console.log("Supplement submission result:", result);
    setIsSupplementSubmitted(result || false);
  }, []);

  const onVideoSubmit = useCallback((result) => {
    console.log("Video submission result:", result);
    setIsVideoSubmitted(result || false);
  }, []);

  const onProgrammingSubmit = useCallback((result) => {
    console.log("Programming submission result:", result);
    setIsProgrammingSubmitted(result || false);
  }, []);

  // Memoized sidebar handler
  const handleSidebarButtonClick = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Sync with Redux state
  useEffect(() => {
    dispatch(setSidebar(isExpanded));
  }, [dispatch, isExpanded]);

  useEffect(() => {
    setIsExpanded(isExpandedRedux);
  }, [isExpandedRedux]);

  // Reset all submission states when navigating to new lesson/content
  useEffect(() => {
    console.log("Resetting submission states for new content");
    setIsQuizSubmitted(false);
    setIsSupplementSubmitted(false);
    setIsVideoSubmitted(false);
    setIsProgrammingSubmitted(false);
  }, [location.pathname, location.state]);

  // Handle module progress updates from child components
  useEffect(() => {
    const handleProgressUpdate = (event) => {
      const { moduleItemId, status, type } = event.detail;
      console.log("Module progress update received:", {
        moduleItemId,
        status,
        type,
      });

      // Update specific submission state based on type
      switch (type) {
        case "quiz":
          setIsQuizSubmitted(status === "completed");
          break;
        case "video":
          setIsVideoSubmitted(status === "completed");
          break;
        case "supplement":
          setIsSupplementSubmitted(status === "completed");
          break;
        case "programming":
          setIsProgrammingSubmitted(status === "completed");
          break;
        default:
          break;
      }

      // Force sidebar refresh by dispatching Redux action if needed
      // This will help update the completion status indicators
    };

    window.addEventListener("moduleProgressUpdate", handleProgressUpdate);
    return () => {
      window.removeEventListener("moduleProgressUpdate", handleProgressUpdate);
    };
  }, []);

  // Log submission changes for debugging
  useEffect(() => {
    console.log("Submission states:", {
      quiz: isQuizSubmitted,
      supplement: isSupplementSubmitted,
      video: isVideoSubmitted,
      programming: isProgrammingSubmitted,
    });
  }, [
    isQuizSubmitted,
    isSupplementSubmitted,
    isVideoSubmitted,
    isProgrammingSubmitted,
  ]);

  // Aggregate submission state for sidebar
  const overallSubmissionState =
    isQuizSubmitted ||
    isSupplementSubmitted ||
    isVideoSubmitted ||
    isProgrammingSubmitted;

  // Context object with all submission handlers
  const contextValue = {
    onQuizSubmit,
    onSupplementSubmit,
    onVideoSubmit,
    onProgrammingSubmit,
    submissionStates: {
      quiz: isQuizSubmitted,
      supplement: isSupplementSubmitted,
      video: isVideoSubmitted,
      programming: isProgrammingSubmitted,
      overall: overallSubmissionState,
    },
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className=" ">
        <Header />
        <Divider />
      </header>
      <div className="flex h-full ">
        <Grid container className=" justify-between ">
          <Grid
            item
            xs={2}
            sm={3}
            md={4}
            lg={isExpanded ? 2.3 : 0.6}
            // sx={{
            //     width: isExpanded ? '19.5%' : '5%',
            //     transition: 'width 0.3s ease'
            // }}
            className="relative "
          >
            <CustomScrollbar className="">
              <div className="flex flex-row overflow-y-scroll h-[calc(100vh-1px)]">
                <div className=" mt-2 ">
                  <SideBar
                    handleSidebarButtonClick={handleSidebarButtonClick}
                    isSubmitted={overallSubmissionState}
                    isExpanded={isExpanded}
                    submissionStates={contextValue.submissionStates}
                  />
                </div>
                <Divider orientation="vertical" flexItem />
              </div>
            </CustomScrollbar>
          </Grid>

          <Grid
            item
            xs={12}
            sm={9}
            md={8}
            lg={isExpanded ? 9.7 : 11.4}
            // sx={{
            //     width: isExpanded ? '80.5%' : '95%',
            //     transition: 'width 0.3s ease'
            // }}
            className=" relative "
          >
            <section className="p-3 sticky top-0 z-10">
              <Breadcrumb courseId={courseID} moduleIndex={moduleID} />
            </section>
            <CustomScrollbar className="">
              <div className="bg-transparent overflow-y-scroll  h-[calc(100vh-150px)] pt-3 pl-3 pr-3 flex justify-center">
                <Outlet context={contextValue} />
              </div>
            </CustomScrollbar>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GeneralLessons;
