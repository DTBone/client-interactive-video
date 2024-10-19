/* eslint-disable react/prop-types */
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Course from '~/components/SliderCourses/components/Course';

const CourseList = ({ title, initialCourses, handleClick }) => {
  const [count, setCount] = useState(1);
  const [courses, setCourses] = useState(initialCourses);//Ban đầu truyền vô 8 courses, dư ra 4 khóa để show more
  useEffect(() => {
    setCourses(initialCourses.slice(0, 4 * count));//Lấy 4 courses đầu tiên
  }, [initialCourses, count]);
  
  const handleShowLess = () => {
    setCount(1);
    setCourses(initialCourses.slice(0, 4));
  };
  const handleShowMore = () => {
    setCount(count + 1);
    // Nếu initialCourses không đủ khóa học (ít hơn count * 4 + 4) thì gọi hàm handleClick để fetch thêm
    if(initialCourses.length < count * 4 + 4) {
      handleClick();
    }
  }
  return (
    <div className='h-full w-full mt-5 flex flex-col'>
      <Typography variant='h3'>{title}</Typography>
      <div className='flex flex-row flex-wrap items-start' style={{ height: 'auto' }}>
        {courses?.map((course) => (
          <div key={course.id} className='w-1/4 p-2' style={{height: '450px'}}>
            <Course course={course} key={course.id} />
          </div>
        ))}
      </div>
        <Button
          variant='contained'
          onClick={count <= 3 ? handleShowMore : handleShowLess}
          sx={{ width: '150px', mt: '10px' }}
        >
          {count <= 3 ? 'Show more' : 'Show less'}
        </Button>
    </div>
  );
};

export default CourseList;
