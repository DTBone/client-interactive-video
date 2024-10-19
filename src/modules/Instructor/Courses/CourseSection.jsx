import { Grid, TextField, MenuItem, FormControlLabel, Switch, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import AddnewCourse from './AddnewCourse';
import EditCourse from './EditCourse';
import { useDispatch, useSelector } from 'react-redux';

import spinnerLoading from '~/assets/spinnerLoading.gif';
import ErrorModal from '~/Components/ErrorModal';
import { createCourse, getCourseByID, updateCourse } from '~/store/Course/Action';

const CourseSection = () => {
    const { courseId } = useParams();
    const course = useSelector((store) => store.course?.findCourse);
    const loading = useSelector((store) => store.course?.loading);
    const error = useSelector((store) => store.course?.error);
    const dispatch = useDispatch();
    console.log("course", course);

    useEffect(() => {
        if (courseId) {
            dispatch(getCourseByID(courseId));
        }
    }, [courseId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (courseId) {
            dispatch(updateCourse(course));
        } else {
            dispatch(createCourse(course));
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <img alt="Loading" src={spinnerLoading} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <ErrorModal errorMessage={error} />
            </div>
        );
    }
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <header className=' '>
                <HeaderCourse />
            </header>
            <div className="flex h-full px-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="w-full">
                    <Grid container spacing={3}>
                        {/* Course ID */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Course ID"
                                value={courseId || 'New Course'}
                                disabled
                            />
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Course Title"
                                name="title"
                                value={course?.title || ''}
                            // onChange={handleInputChange}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={course?.description || ''}
                            //onChange={handleInputChange}
                            />
                        </Grid>

                        {/* Instructor */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Instructor"
                                name="instructor"
                                value={course?.instructor || ''}
                            //onChange={handleInputChange}
                            />
                        </Grid>

                        {/* Level */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Level"
                                name="level"
                                value={course?.level || 'beginner'}
                            //onChange={handleInputChange}
                            >
                                <MenuItem value="beginner">Beginner</MenuItem>
                                <MenuItem value="intermediate">Intermediate</MenuItem>
                                <MenuItem value="advanced">Advanced</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Draft Status */}
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={!course?.isDraft}
                                    // onChange={(e) => handleSwitchChange({
                                    //     target: {
                                    //         name: 'isDraft',
                                    //         checked: !e.target.checked
                                    //     }
                                    // })}
                                    />
                                }
                                label="Public"
                            />
                        </Grid>

                        {/* Approval Status */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Approved By"
                                value={course?.approvedBy || 'Pending Approval'}
                                disabled
                            />
                        </Grid>

                        {/* Photo Upload */}
                        <Grid item xs={12}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="photo-upload"
                                type="file"
                            //onChange={handlePhotoUpload}
                            />
                            <label htmlFor="photo-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    className="w-full"
                                >
                                    Upload Photo
                                </Button>
                            </label>
                            {course?.photo && (
                                <div className="mt-2">
                                    {typeof course.photo === 'string' ? (
                                        <img
                                            src={course.photo}
                                            alt="Course"
                                            className="w-40 h-40 object-cover"
                                        />
                                    ) : (
                                        <div>Selected: {course.photo.name}</div>
                                    )}
                                </div>
                            )}
                        </Grid>

                        {/* Save Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? <CircularProgress size={24} /> : (courseId ? 'Update Course' : 'Create Course')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>

        </div >
    )
}

export default CourseSection
