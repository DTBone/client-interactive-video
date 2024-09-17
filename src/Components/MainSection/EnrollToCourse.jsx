import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import HeaderCourse from '../Common/Header/HeaderCourse'
import Breadcrumb from '../Common/Breadcrumbs/Breadcrumb'
import EnrollCourseBtn from '../Button/EnrollCourseBtn'

const EnrollToCourse = () => {
    const [enrollCourse, getState] = useState(true);
    return (
        <div className=''>
            <section className='ml-6 space-y-2'>
                <HeaderCourse />
                <Breadcrumb />
            </section>

            <section className="bg-[#f2f6fd] w-full h-3/4 mt-2 flex flex-row justify-center items-center ">
                <div className="flex-grow-[6]  ml-6 max-w-4xl ">
                    <div className='flex flex-col gap-4 justify-start items-start h-[400px]'>
                        <Typography
                            variant='h2'
                            className='text-start font-bold'
                            sx={{ fontWeight: 500, marginTop: "16px" }}
                            noWrap={false}>Course full name</Typography>
                        <Typography noWrap={false} >Course description:</Typography>
                        <Typography>Intrucstors:</Typography>

                        <div className='mt-auto mb-6'>
                            {enrollCourse ? (<div>
                                <Button variant='contained' sx={{ width: "18rem", height: "4rem", background: "#0048b0" }}>
                                    Go To COursse
                                </Button>
                                <span className="ml-4 text-sm text-gray-500">Allready go to course</span>
                            </div>) : (<EnrollCourseBtn />)}



                        </div>


                    </div>

                </div>
                <div className="flex-grow-[4]  bg-blue-600">Hello</div>

            </section>
        </div>
    )
}

export default EnrollToCourse
