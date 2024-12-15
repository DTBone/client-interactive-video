import React, { useState } from 'react';
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
import ModuleItemProgress from './ModuleItemProgress';

const StudentDetailsModal = ({ open, onClose, studentData }) => {
    if (!studentData) return null;
    const studentProgress = studentData.progress;
    const studentInfo = studentData.user;

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
    };

    // Determine avatar source
    const avatarSrc = studentInfo.profile?.picture
        ? studentInfo.profile.picture
        : null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="student-details-modal"
        >
            <Box sx={modalStyle}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" component="h2">
                        Detailed Student Progress
                    </Typography>
                    <CloseIcon
                        onClick={onClose}
                        className="cursor-pointer hover:text-gray-600 transition-colors"
                    />
                </div>

                {/* Student Overview */}
                <div className="flex flex-col items-center mb-4">
                    <Avatar
                        alt={studentInfo.username}
                        src={avatarSrc}
                        className="w-24 h-24 mb-3 object-cover"
                        sx={{
                            width: 96,
                            height: 96,
                            ...(avatarSrc ? {} : { fontSize: '2rem' })
                        }}
                    >
                        {!avatarSrc ? studentInfo.username.charAt(0).toUpperCase() : null}
                    </Avatar>
                    <Typography variant="h6">{studentInfo.profile.fullname}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {studentInfo.email}
                    </Typography>
                </div>

                {/* Overall Course Progress */}
                <div className="mb-4">
                    <Typography variant="subtitle1" className="font-semibold">
                        Course Progress
                    </Typography>
                    <div className="flex items-center space-x-3">
                        <LinearProgress
                            variant="determinate"
                            value={studentProgress.completionPercentage}
                            className="flex-grow"
                        />
                        <Typography variant="body2">
                            {studentProgress.completionPercentage}%
                        </Typography>
                    </div>
                    <div className="mt-2 flex space-x-3">
                        <Chip
                            label={`Average Score: ${studentProgress.averageScore}`}
                            color="primary"
                            variant="outlined"
                        />
                        <Chip
                            label={`Status: ${studentProgress.status.replace('-', ' ').toUpperCase()}`}
                            color={
                                studentProgress.status === 'completed' ? 'success' :
                                    studentProgress.status === 'not-started' ? 'default' : 'warning'
                            }
                        />
                    </div>
                </div>

                {/* Module Items Progress */}
                <Typography variant="subtitle1" className="font-semibold mb-2">
                    Module Items Progress
                </Typography>
                <div className="space-y-2">
                    {studentProgress.moduleItemProgresses.map((item, index) => (
                        <ModuleItemProgress key={index} item={item} />
                    ))}
                </div>
            </Box>
        </Modal>
    );
};
export default StudentDetailsModal;