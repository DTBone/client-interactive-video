import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    Tooltip,
    LinearProgress
} from '@mui/material';
import {
    AccessTime,
    Code,
    CheckCircle,
    HourglassEmpty,
    Cancel
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getGradeProgress } from '~/store/slices/Progress/action';
// import { motion } from 'framer-motion'; // Uncomment if using framer-motion

const statusIcon = (status) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="text-green-500 animate-bounce" />;
        case 'in_progress':
            return <HourglassEmpty className="text-yellow-500 animate-pulse" />;
        case 'not_started':
        default:
            return <Cancel className="text-gray-400" />;
    }
};

const statusLabel = (status) => {
    switch (status) {
        case 'completed':
            return <Chip label="Completed" color="success" size="small" />;
        case 'in_progress':
            return <Chip label="In Progress" color="warning" size="small" />;
        case 'not_started':
        default:
            return <Chip label="Not Started" color="default" size="small" />;
    }
};

const Grades = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentCourse } = useSelector((state) => state.course);
    const { grade } = useSelector(state => state.progress);

    const modules = currentCourse?.data?.modules || [];

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

    const {
        gradedQuizItems,
        programmingItems,
        gradedQuizIds,
        programmingItemIds
    } = extractModuleItems(modules);
    const ids = [...gradedQuizIds, ...programmingItemIds];

    useEffect(() => {
        dispatch(getGradeProgress({ courseId: courseId, ids: ids }));
    }, [courseId]);

    const [gradeList, setGradeList] = useState([]);
    useEffect(() => {
        setGradeList(grade);
    }, [grade]);

    const getResults = (id) => {
        if (Array.isArray(gradeList)) {
            return gradeList.find(item => item.moduleItemId === id);
        }
        return undefined;
    };

    // Animation for table rows (optional, requires framer-motion)
    // const MotionTableRow = motion(TableRow);

    return (
        <div className="pb-6 mb-6">
            <Typography variant='h4' className='font-bold pb-4 text-blue-700'>
                Course Grades Overview
            </Typography>
            <Typography variant="subtitle1" className="pb-2 text-gray-600">
                Track your progress and scores for all graded quizzes and programming assignments.
            </Typography>
            <TableContainer component={Paper} className='shadow-lg rounded-xl'>
                <Table className='min-w-full'>
                    <TableHead>
                        <TableRow className="bg-blue-50">
                            <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Completed At</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...gradedQuizItems, ...programmingItems].map((item, index) => {
                            const result = getResults(item._id);
                            // Determine status
                            let status = 'not_started';
                            if (result?.status === 'completed') status = 'completed';
                            else if (result?.status === 'in_progress') status = 'in_progress';

                            // Animation wrapper (optional)
                            // return (
                            //   <MotionTableRow
                            //     key={index}
                            //     initial={{ opacity: 0, y: 20 }}
                            //     animate={{ opacity: 1, y: 0 }}
                            //     transition={{ delay: index * 0.05 }}
                            //     className="hover:bg-blue-50 transition-all"
                            //   >
                            return (
                                <TableRow key={index} className="hover:bg-blue-50 transition-all">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {item.type === 'quiz'
                                                ? <Tooltip title="Quiz"><AccessTime className="text-yellow-500" /></Tooltip>
                                                : <Tooltip title="Programming"><Code className="text-blue-500" /></Tooltip>
                                            }
                                            <span
                                                onClick={() =>
                                                    item.type === 'quiz'
                                                        ? navigate(`/learns/lessons/quiz/${item._id.toLowerCase().replace(/\s+/g, '/')}`)
                                                        : navigate(`/learns/lessons/programming/${item._id.toLowerCase().replace(/\s+/g, '/')}`)
                                                }
                                                className="text-blue-700 font-medium hover:underline cursor-pointer"
                                            >
                                                {item.title}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                            color={item.type === 'quiz' ? 'warning' : 'primary'}
                                            size="small"
                                            icon={item.type === 'quiz' ? <AccessTime /> : <Code />}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            {statusIcon(status)}
                                            {statusLabel(status)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {result && result.completedAt
                                            ? <span className="text-green-700">{new Date(result.completedAt).toLocaleString()}</span>
                                            : <span className="text-gray-400">--</span>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {result
                                            ? (
                                                <Tooltip title="Score">
                                                    <span className={
                                                        (item.type === 'quiz'
                                                            ? result.result?.quiz?.score
                                                            : result.result?.programming?.score
                                                        ) >= 80
                                                            ? "text-green-600 font-bold"
                                                            : "text-orange-600 font-semibold"
                                                    }>
                                                        {item.type === 'quiz'
                                                            ? result.result?.quiz?.score ?? '--'
                                                            : result.result?.programming?.score ?? '--'
                                                        }
                                                    </span>
                                                </Tooltip>
                                            )
                                            : <span className="text-gray-400">--</span>
                                        }
                                        {/* Progress bar animation for completed */}
                                        {status === 'completed' && (
                                            <LinearProgress
                                                variant="determinate"
                                                value={
                                                    item.type === 'quiz'
                                                        ? result.result?.quiz?.score ?? 0
                                                        : result.result?.programming?.score ?? 0
                                                }
                                                sx={{ height: 6, borderRadius: 4, mt: 1 }}
                                                color={
                                                    (item.type === 'quiz'
                                                        ? result.result?.quiz?.score
                                                        : result.result?.programming?.score
                                                    ) >= 80 ? "success" : "warning"
                                                }
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Grades;


