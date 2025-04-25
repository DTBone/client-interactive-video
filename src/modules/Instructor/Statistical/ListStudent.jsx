import React from "react";
import Grid from "@mui/material/Grid";
import HeaderCourse from "~/Components/Common/Header/HeaderCourse";
import { Button, Divider, Paper } from "@mui/material";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "~/Components/Common/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import CustomScrollbar from "~/Components/Common/CustomScrollbar";
import { useDispatch, useSelector } from "react-redux";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { clearCurrentCourse } from "~/store/slices/Course/courseSlice";
import Sidebar from "./Sidebar";
import Header from "~/Components/Header";

const ListStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const handleSidebarButtonClick = () => {
    setIsExpanded(!isExpanded);
    //console.log('isExpanded', isExpanded);
    //setSidebarWidth(isExpanded ? 55 : 255);
  };

  return (
    <div>
      <div className="h-screen flex flex-col overflow-hidden">
        <header className=" ">
          <Header />
          <Divider className="bg-gray-200" />
        </header>
        <div className="flex h-full ">
          <Grid container className=" justify-between ">
            <Grid
              item
              xs={2}
              sm={3}
              md={4}
              lg={isExpanded ? 2.1 : 0.6}
              // sx={{
              //     width: isExpanded ? '19.5%' : '5%',
              //     transition: 'width 0.3s ease'
              // }}
              className="relative "
            >
              <CustomScrollbar className="">
                <div className="flex flex-row overflow-y-scroll overflow-x-hidden h-[calc(94vh-20px)]">
                  <div className=" mt-2 ">
                    <Sidebar
                      handleSidebarButtonClick={handleSidebarButtonClick}
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
              lg={isExpanded ? 9.9 : 11.4}
              // sx={{
              //     width: isExpanded ? '80.5%' : '95%',
              //     transition: 'width 0.3s ease'
              // }}
              className=" relative "
            >
              <section>
                <Breadcrumb studentManager={true} />
              </section>
              <Paper
                elevation={3}
                className="flex-1 m-4 rounded-lg overflow-auto shadow-md transition-shadow duration-200 hover:shadow-lg"
              >
                <div className="bg-white w-full relative  h-[calc(100vh-150px)] ">
                  <Outlet />
                </div>
              </Paper>
              {/* <CustomScrollbar className=''>
                            </CustomScrollbar> */}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ListStudent;
