import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import { AccessTime, Code } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getGradeProgress } from '~/store/slices/Progress/action';
const Grades = () => {
    const { courseId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleQuizClick = (moduleID) => {
        navigate(`/learns/lessons/quiz/${moduleID.toLowerCase().replace(/\s+/g, '/')}`);
    };
    const handleProgrammingClick = (problemId) => {
        navigate(`/learns/lessons/programming/${problemId.toLowerCase().replace(/\s+/g, '/')}`);
    }




    const { currentCourse } = useSelector((state) => state.course);

    const { grade } = useSelector(state => state.progress)


    const modules = currentCourse?.data?.modules || [];
    console.log("modules", modules);

    const extractModuleItems = (modules) => {
        const gradedQuizItems = modules.flatMap(module =>
            module.moduleItems.filter(item =>
                item.isGrade === true && item.type === 'quiz'
            )
        );

        const programmingItems = modules.flatMap(module =>
            module.moduleItems.filter(item =>
                item.type === 'programming'
            )
        );

        const gradedQuizIds = gradedQuizItems.map(item => item._id);
        const programmingItemIds = programmingItems.map(item => item._id);

        return {
            gradedQuizItems,
            programmingItems,
            gradedQuizIds,
            programmingItemIds
        };
    };

    // Usage
    const {
        gradedQuizItems,
        programmingItems,
        gradedQuizIds,
        programmingItemIds
    } = extractModuleItems(modules);
    const ids = [...gradedQuizIds, ...programmingItemIds];
    console.log('Graded Quizzes:', gradedQuizItems);
    console.log('Programming Items:', programmingItems);
    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching', ids, courseId);
            await dispatch(getGradeProgress({ courseId: courseId, ids: ids }));
        };
        fetchData();
    }, [courseId]);
    const [gradeList, setGradeList] = useState([]);
    useEffect(() => {
        console.log('Grade:', grade);
        setGradeList(grade);
    }, [grade]);


    const getResults = (id) => {
        if (Array.isArray(gradeList)) {
            return gradeList.find(item => item.moduleItemId === id);
        }
        return undefined; // Trả về undefined nếu gradeList không phải là mảng
    };


    return (
        <div className="pb-6 mb-6">
            <Typography variant='h4' className='font-bold pb-4'>Grades</Typography>
            <TableContainer component={Paper} className='shadow-lg'>
                <Table className='min-w-full'>
                    <TableHead className="mb-4">
                        <TableRow className="bg-transparent">
                            <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ marginBottom: "16px", paddingBottom: "16px" }}>
                        {[...gradedQuizItems, ...programmingItems].map((item, index) => {
                            // Find corresponding result from gradeList
                            const result = getResults(item._id);

                            return (
                                <TableRow key={index} className="hover:bg-gray-50">
                                    <TableCell className="flex items-center space-x-2">
                                        <div className="flex flex-row space-x-3">
                                            {item.icon === 'quiz' ? (
                                                <AccessTime className="text-yellow-500" />
                                            ) : (
                                                <Code className="text-blue-500" />
                                            )}
                                            <div>
                                                <div
                                                    onClick={() =>
                                                        item.type === 'quiz'
                                                            ? handleQuizClick(item._id)
                                                            : handleProgrammingClick(item._id)
                                                    }
                                                    className="text-blue-600 font-medium hover:underline"
                                                >
                                                    {item.title}
                                                </div>
                                                <div className="text-gray-500 text-sm">{item.type}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {result ? result.status : '--'}
                                    </TableCell>
                                    <TableCell>
                                        {result && result.completedAt ? new Date(result.completedAt).toLocaleString() : '--'}
                                    </TableCell>
                                    <TableCell>
                                        {result
                                            ? (
                                                item.type === 'quiz'
                                                    ? result.result?.quiz?.score ?? '--'
                                                    : result.result?.programming?.score ?? '--'
                                            )
                                            : '--'
                                        }
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Grades


