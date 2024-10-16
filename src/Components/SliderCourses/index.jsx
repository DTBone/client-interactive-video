/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import Course from "./components/Course";
import "~/index.css"; // Tailwind CSS sẽ quản lý mọi thứ
import { Swiper, SwiperSlide } from 'swiper/react';
import './SliderCourses.css';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { useEffect, useState } from "react";
import courseService from "~/services/api/courseService";


function SliderCourses({ user, title }) {

  const [courses, setCourses] = useState([]);
  console.log(courses);
  const userId = user._id;
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        var response = await courseService.getCoursesByStudentId(userId);
        if (response.length < 5) {
          response = [...response, ...response];
        }
        setCourses(response);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };
    fetchCourses();
  }, [userId, setCourses]);

  return (
    <div className="w-5/6 p-0 flex flex-col items-center justify-center relative">
      <div className="w-full">
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            color: "#000",
          }}
        >
          {title}
        </Typography>
      </div>

      {/* Slider */}
      <div className="w-full flex flex-row items-center justify-center">
        <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
        >
          {courses?.map((course, index) => (
            <SwiperSlide
            style={{
              width: '33%',
            }} key={index}>
              <Course course={course} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}



export default SliderCourses;
