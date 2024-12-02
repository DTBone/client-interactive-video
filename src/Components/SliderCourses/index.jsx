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


function SliderCourses({ course, title }) {

  const [courses, setCourses] = useState(course || []);

  useEffect(() => {
    console.log(course);
  }, [course]);
  

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
          {course?.map((course, index) => (
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
