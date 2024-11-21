// RoadmapForm.js
import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Divider,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Code as CodeIcon,
    DataThresholding as DatabaseIcon,
    Cloud as CloudIcon,
    Security as SecurityIcon,
    Phone as PhoneIcon,
    Web as WebIcon,
    Psychology as AIIcon,
    Token as BlockchainIcon,
    Help as HelpIcon
} from '@mui/icons-material';

const EXPERIENCE_LEVELS = [
    { value: 'Beginner', label: 'Beginner', color: '#4CAF50' },
    { value: 'Intermediate', label: 'Intermediate', color: '#2196F3' },
    { value: 'Advanced', label: 'Advanced', color: '#9C27B0' }
];

const GOALS = [
    {
        id: 'web',
        label: 'Web Development',
        icon: <WebIcon />,
        color: '#2196F3',
        description: 'Frontend & Backend Development'
    },
    {
        id: 'mobile',
        label: 'Mobile Development',
        icon: <PhoneIcon />,
        color: '#4CAF50',
        description: 'iOS & Android Development'
    },
    {
        id: 'data',
        label: 'Data Science',
        icon: <DatabaseIcon />,
        color: '#FF9800',
        description: 'Data Analysis & Visualization'
    },
    {
        id: 'devops',
        label: 'DevOps',
        icon: <CodeIcon />,
        color: '#F44336',
        description: 'CI/CD & Infrastructure'
    },
    {
        id: 'cloud',
        label: 'Cloud Computing',
        icon: <CloudIcon />,
        color: '#00BCD4',
        description: 'AWS, Azure & GCP'
    },
    {
        id: 'ml',
        label: 'Machine Learning',
        icon: <AIIcon />,
        color: '#9C27B0',
        description: 'AI & Deep Learning'
    },
    {
        id: 'blockchain',
        label: 'Blockchain',
        icon: <BlockchainIcon />,
        color: '#FF5722',
        description: 'Web3 & Smart Contracts'
    },
    {
        id: 'security',
        label: 'Cyber Security',
        icon: <SecurityIcon />,
        color: '#607D8B',
        description: 'Security & Penetration Testing'
    }
];

function RoadmapForm({ onGenerateRoadmap, isLoading }) {
    const [formData, setFormData] = useState({
        currentSkills: '',
        experienceLevel: 'Beginner',
        learningGoal: '',
        timeCommitment: '',
        additionalInfo: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoalsChange = (_, newGoal) => {
        setFormData(prev => ({
            ...prev,
            learningGoal: newGoal
        }));
    };

    const handleExperienceChange = (_, newLevel) => {
        if (newLevel !== null) {
            setFormData(prev => ({
                ...prev,
                experienceLevel: newLevel
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onGenerateRoadmap(formData);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                width: '100%',
                maxWidth: 1000,
                mx: 'auto',
                my: 4,
                borderRadius: 2,
                backgroundColor: '#FFFFFF'
            }}
        >
            <Typography variant="h4" gutterBottom sx={{
                fontWeight: 600,
                color: '#1a237e',
                textAlign: 'center',
                mb: 4
            }}>
                Create Your Learning Roadmap
            </Typography>

            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    {/* Current Skills Section */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                            Current Skills <Chip label="Optional" color="success" size="small" />
                        </Typography>
                        <TextField
                            fullWidth
                            name="currentSkills"
                            multiline
                            rows={3}
                            value={formData.currentSkills}
                            onChange={handleChange}
                            placeholder="What technologies and skills do you already know?"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#F5F5F5'
                                }
                            }}
                        />
                    </Box>

                    {/* Experience Level Section */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                            Experience Level <Chip label="Required" color="error" size="small" />
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            fullWidth
                            value={formData.experienceLevel}
                            onChange={handleExperienceChange}
                            sx={{ mb: 2 }}
                        >
                            {EXPERIENCE_LEVELS.map(level => (
                                <ToggleButton
                                    key={level.value}
                                    value={level.value}
                                    sx={{
                                        py: 1.5,
                                        color: level.color,
                                        '&.Mui-selected': {
                                            backgroundColor: `${level.color}20`,
                                            color: level.color,
                                            '&:hover': {
                                                backgroundColor: `${level.color}30`,
                                            }
                                        }
                                    }}
                                >
                                    {level.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>

                    {/* Learning Goals Section */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            Learning Goals
                            <Tooltip title="Select multiple goals you want to achieve">
                                <IconButton size="small">
                                    <HelpIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip label="Required" color="error" size="small" />
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                gap: 2
                            }}
                        >
                            {GOALS.map((goal) => (
                                <Paper
                                    key={goal.id}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        border: '2px solid',
                                        borderColor: formData.learningGoal?.id === goal.id
                                            ? goal.color
                                            : 'transparent',
                                        backgroundColor: formData.learningGoal?.id === goal.id
                                            ? `${goal.color}10`
                                            : '#F5F5F5',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: `${goal.color}20`,
                                        }
                                    }}
                                    onClick={() => {
                                        handleGoalsChange(null, goal);
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box
                                            sx={{
                                                color: goal.color,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {goal.icon}
                                        </Box>
                                        <Stack spacing={0.5}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {goal.label}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {goal.description}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            ))}
                        </Box>
                    </Box>

                    {/* Time Commitment Section */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                            Time Commitment
                            <Chip label="Required" sx={{
                                ml: 1,
                            }} color="error" size="small" />
                        </Typography>
                        <TextField
                            fullWidth
                            required={true}
                            name="timeCommitment"
                            value={formData.timeCommitment}
                            onChange={handleChange}
                            placeholder="How many hours per week can you dedicate to learning?"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#F5F5F5'
                                }
                            }}
                        />
                    </Box>

                    {/* Additional Information Section */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                            Additional Information
                            <Chip label="Optional" sx={{
                                ml: 1,
                            }} color="success" size="small" />
                        </Typography>
                        <TextField
                            fullWidth
                            name="additionalInfo"
                            multiline
                            rows={3}
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            placeholder="Any specific areas of interest or requirements?"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#F5F5F5'
                                }
                            }}
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            backgroundColor: '#1a237e',
                            '&:hover': {
                                backgroundColor: '#0d47a1'
                            },
                            borderRadius: 2
                        }}
                    >
                        {isLoading ? 'Generating...' : 'Generate My Roadmap'}
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}

export default RoadmapForm;