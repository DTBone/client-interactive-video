import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCourseByInstructor } from '~/store/slices/Course/action';
import { getStudentEnrollCourse } from '~/store/slices/StudentEnrollCourse/action';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar
} from '@mui/material';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as NotStartedIcon
} from '@mui/icons-material';
import StudentDetailsModal from './StudentDetailsModal';

const DetailedStatistic = () => {
    const courses = useSelector((state) => state.course.courses);
    const dispatch = useDispatch();
    const courseId = useParams().courseId;
    const [course, setCourse] = useState();
    const { students } = useSelector(state => state.student)
    const [selectedStudent, setSelectedStudent] = useState(null);


    useEffect(() => {
        dispatch(getCourseByInstructor())
    }, [dispatch])
    useEffect(() => {
        const fetchData = () => {
            const course1 = courses.find(course => course._id === courseId)
            setCourse(course1)

        }
        fetchData()
        console.log("course", course)
    }, [courseId])
    useEffect(() => {
        const fetchData = async () => {
            console.log("courseId", courseId);
            await dispatch(getStudentEnrollCourse({ courseId }));
        }
        fetchData()
    }, [courseId]);


    const totalStudents = students?.length;
    const completedStudents = students?.filter(
        student => student?.progress.status === 'completed'
    ).length;
    const completionPercentage = Math.round(
        (completedStudents / totalStudents) * 100
    );

    console.log("students", students)
    const handleStudentClick = (student) => {
        // Find corresponding progress data

        setSelectedStudent(student);
    };


    const handleCloseModal = () => {
        setSelectedStudent(null);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-6 bg-white shadow-md rounded-lg p-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Course Progress Overview
                </h2>
                <div className="flex space-x-4">
                    <Chip
                        label={`Total Students: ${totalStudents}`}
                        color="primary"
                        variant="outlined"
                    />
                    <Chip
                        label={`Completed: ${completedStudents} (${completionPercentage}%)`}
                        color="success"
                        variant="outlined"
                    />
                </div>
            </div>

            <TableContainer component={Paper} className="shadow-md">
                <Table>
                    <TableHead className="bg-gray-200">
                        <TableRow>
                            <TableCell className="font-bold">Student</TableCell>
                            <TableCell className="font-bold">Email</TableCell>
                            <TableCell className="font-bold">Progress Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students?.map((student) => (
                            <TableRow
                                key={student.user._id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleStudentClick(student)}
                            >
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <Avatar
                                            alt={student.user.username}
                                            className="mr-2"
                                        >
                                            {student.user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        {student.user.username}
                                    </div>
                                </TableCell>
                                <TableCell>{student.user.email}</TableCell>
                                <TableCell>
                                    {student.progress.status === 'completed' ? (
                                        <Chip
                                            label="Completed"
                                            color="success"
                                            icon={<CompletedIcon />}
                                        />
                                    ) : (
                                        <Chip
                                            label="Not Started"
                                            color="default"
                                            icon={<NotStartedIcon />}
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Student Details Modal */}
            <StudentDetailsModal
                open={!!selectedStudent}
                onClose={handleCloseModal}
                studentData={selectedStudent}
            />
        </div>
    )
}

export default DetailedStatistic
