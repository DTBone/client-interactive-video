import { PlayArrow } from '@mui/icons-material'
import { Box, Button, Card, CardActions, CardContent, CardMedia, LinearProgress, Typography } from '@mui/material'
import React from 'react'

const CourseCardWithProgress = ({ course }) => {
    return (
        <Card sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6, // Tăng bóng đổ khi hover
            },
        }}>
            <CardMedia
                component="img"
                height="140"
                image={course.photo}
                alt={course.title}
                sx={{
                    height: "180px", // Chiều cao cố định
                    objectFit: "cover", // Đảm bảo ảnh phủ kín không gian mà không bị méo
                    objectPosition: "center", // Căn giữa ảnh
                }}
            />
            <CardContent>
                <Typography variant="h6" noWrap>{course.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <Typography variant="body2">
                        {course.progress?.overallPercentage} %
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={course.progress?.overallPercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                />
            </CardContent>
            {/* <CardActions>
                <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    startIcon={<PlayArrow />}
                >
                    Continue Study
                </Button>
            </CardActions> */}
        </Card>
    )
}

export default CourseCardWithProgress
