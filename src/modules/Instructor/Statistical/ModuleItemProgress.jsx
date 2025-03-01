import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    Modal,
    Box,
    Typography,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as NotStartedIcon,
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    Quiz as QuizIcon,
    Code as CodeIcon,
    PlayCircleOutline as VideoIcon,
    MenuBook as ReadingIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getModuleItemById } from '~/store/slices/ModuleItem/action';

const ModuleItemProgress = ({ item }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getModuleItemById(item.moduleItemId));
            } catch (error) {
                console.error('Error fetching module item:', error);
            }
        };
        fetchData();
    }, [item, dispatch]);

    const { currentItem } = useSelector((state) => state.moduleItem);
    console.log("currentItem:", currentItem);
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'not-started': return 'default';
            case 'in-progress': return 'warning';
            default: return 'default';
        }
    };

    const getIcon = (status) => {
        switch (status) {
            case 'code': return <CodeIcon fontSize="small" />;
            case 'quiz': return <QuizIcon fontSize="small" />;
            case 'video': return <VideoIcon fontSize="small" />;
            case 'reading': return <ReadingIcon fontSize="small" />;
            default: return <CloseIcon />;
        }
    }

    const renderItemDetails = () => {
        if (item.result?.quiz) {
            return (
                <div className="space-y-2">
                    <Typography variant="body2">
                        <QuizIcon fontSize="small" className="mr-2" />
                        Quiz Results:
                    </Typography>
                    <Typography variant="body2">
                        Total Questions: {item.result.quiz.totalQuestions}
                    </Typography>
                    <Typography variant="body2">
                        Correct Answers: {item.result.quiz.correctAnswers}
                    </Typography>
                    <Typography variant="body2">
                        Score: {item.result.quiz.score}%
                    </Typography>
                    <Typography variant="body2">
                        Time Spent: {item.result.quiz.timeSpent} minutes
                    </Typography>
                </div>
            );
        }

        if (item.result?.programming) {
            return (
                <div className="space-y-2">
                    <Typography variant="body2">
                        <CodeIcon fontSize="small" className="mr-2" />
                        Programming Assignment:
                    </Typography>
                    <Typography variant="body2">
                        Language: {item.result.programming.language}
                    </Typography>
                    <Typography variant="body2">
                        Test Cases: {item.result.programming.testCasesPassed} / {item.result.programming.totalTestCases}
                    </Typography>
                    <Typography variant="body2">
                        Score: {item.result.programming.score}%
                    </Typography>
                    <Typography variant="body2">
                        Memory Used: {item.result.programming.memory}
                    </Typography>
                </div>
            );
        }

        return null;
    };

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="bg-gray-100"
            >
                <div className="flex items-center space-x-2 w-full">
                    {/* {item.result?.quiz && <QuizIcon fontSize="small" />}
                    {item.result?.programming && <CodeIcon fontSize="small" />}
                    {item.result?.video && <VideoIcon fontSize="small" />}
                    {item.result?.reading && <ReadingIcon fontSize="small" />} */}
                    {getIcon(currentItem?.data?.icon)}
                    <Typography variant="body2">
                        Title: {currentItem.data?.title}
                    </Typography>
                    <Chip
                        label={item.status.replace('-', ' ').toUpperCase()}
                        size="small"
                        color={getStatusColor(item.status)}
                        className="ml-auto"
                    />
                </div>
            </AccordionSummary>
            <AccordionDetails>
                {renderItemDetails()}
                {item.result?.programming?.code && (
                    <div className="mt-2">
                        <Typography variant="body2" className="font-semibold">
                            Submitted Code:
                        </Typography>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {item.result.programming.code}
                        </pre>
                    </div>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default ModuleItemProgress;