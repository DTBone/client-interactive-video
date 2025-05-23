import { Button, Typography } from '@mui/material'
import React from 'react'

const PopularCoursesSection = () => {
    return (
        <div>
            <Typography variant='h5' fontWeight={600} color='text.primary' mb={2}>
                Popular Courses
            </Typography>
            <div>
                {/* Add your popular courses here */}
                <p>Course 1</p>
                <p>Course 2</p>
                <p>Course 3</p>
            </div>
            <Button variant='outlined' color='primary' sx={{ mt: 2 }}>
                Show 8 more
            </Button>
        </div>
    )
}

export default PopularCoursesSection
