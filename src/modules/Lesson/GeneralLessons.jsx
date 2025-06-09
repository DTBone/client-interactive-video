import Grid from "@mui/material/Grid";
import HeaderCourse from "~/Components/Common/Header/HeaderCourse";
import SideBar from "./Sidebar/SideBar";
import { Divider } from "@mui/material";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Breadcrumb from "~/Components/Common/Breadcrumbs/Breadcrumb";
import React, { useEffect, useState } from "react";
import CustomScrollbar from "~/Components/Common/CustomScrollbar";
import { useDispatch, useSelector } from "react-redux";
import Module from "./../CourseDetail/MainSection/Modules/Module";
import Header from "~/Components/Header";
import { setSidebar } from "~/store/slices/ModuleItem/moduleItemSlice";

const GeneralLessons = () => {
  const dispatch = useDispatch();
  const isExpandedRedux = useSelector((state) => state.moduleItem.isExpanded);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    dispatch(setSidebar(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    setIsExpanded(isExpandedRedux);
  }, [isExpandedRedux]);

  //const { currentCourse } = useSelector(state => state.course);
  const location = useLocation();
  const courseID = localStorage.getItem("courseId");
  const moduleID = localStorage.getItem("moduleId");
  const [isSubmitted, setIsSubmitted] = useState("");

  //console.log('module', moduleID);
  //console.log('course', courseID);
  const onQuizSubmit = (result) => {
    console.log("result", result);
    setIsSubmitted(result || false);
  };
  const handleSidebarButtonClick = () => {
    setIsExpanded(!isExpanded);
    //console.log('isExpanded', isExpanded);
    //setSidebarWidth(isExpanded ? 55 : 255);
  };
  useEffect(() => {
    // if (!currentCourse) {
    //     //dispatch(getCourseById({ courseId: courseId }));
    // }
    console.log("submit", isSubmitted);
  }, [isSubmitted]);
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
                    isSubmitted={isSubmitted}
                    isExpanded={isExpanded}
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
                <Outlet context={{ onQuizSubmit }} />
              </div>
            </CustomScrollbar>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GeneralLessons;
