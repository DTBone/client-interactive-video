/* eslint-disable react/prop-types */
import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
    IconButton,
    LinearProgress,
    Paper,
    Collapse,
    styled,
    useTheme
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from '@mui/lab';
import {
    Person,
    Schedule,
    Tag,
    CheckCircle as CheckIcon,
    ExpandMore as ExpandMoreIcon,
    Star as StarIcon,
    Navigation as NavigationIcon, CheckCircleOutline
} from '@mui/icons-material';

// Styled components with enhanced aesthetics
const StyledTimelineDot = styled(TimelineDot)(({ theme, completed, active }) => ({
    boxShadow: 'none',
    padding: 8,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: active
        ? theme.palette.warning.main
        : completed
            ? theme.palette.success.main
            : theme.palette.grey[300],
    borderWidth: active ? 3 : 1,
    borderStyle: 'solid',
    borderRadius: '50%',
    borderColor: active
        ? theme.palette.warning.light
        : completed
            ? theme.palette.success.light
            : theme.palette.grey[400],
}));

const StyledCard = styled(Card)(({ theme, active }) => ({
    transition: 'all 0.3s ease',
    borderLeft: active ? `4px solid ${theme.palette.warning.main}` : 'none',
    backgroundColor: active ? theme.palette.warning.lighter : theme.palette.background.paper,
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const ExpandButton = styled(IconButton)(({ expanded }) => ({
    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease',
}));

const UserProgressIndicator = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: 20,
    width: '40%',
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    border: `1px solid ${theme.palette.divider}`,
}));

const ProgressChip = styled(Chip)(({ theme, completed }) => ({
    backgroundColor: completed ? theme.palette.success.light : theme.palette.grey[200],
    color: completed ? theme.palette.success.contrastText : theme.palette.text.primary,
    '& .MuiChip-icon': {
        color: 'inherit',
    },
}));


const RoadMapDisplay = ({ data, userProgress }) => { // userProgress indicates current phase
    const [expandedPhase, setExpandedPhase] = React.useState(null);
    const theme = useTheme();

    const handleClickItem = (phase, item) => {
        console.log('Clicked on item:', item);
    };

    const handleExpandPhase = (phaseNumber) => {
        setExpandedPhase(expandedPhase === phaseNumber ? null : phaseNumber);
    };

    const calculatePhaseProgress = (phase) => {
        const completedItems = phase.items.filter(item => item.completed).length;
        return (completedItems / phase.items.length) * 100;
    };

    const isPhaseActive = (phaseNumber) => phaseNumber === userProgress;
    const isPhaseCompleted = (phaseNumber) => phaseNumber < userProgress;

    return (
        <Box sx={{
            maxWidth: 1400,
            margin: 'auto',
            p: 3,
            display: 'flex',
            gap: 4,
            width: '100%',
        }}>
            {/* Main content */}
            <Box sx={{ flex: 1 }}>
                {/* Header Card */}
                <StyledCard sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h4" sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.warning.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {data?.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {data?.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                icon={<Person />}
                                label={`Difficulty: ${data?.difficulty}`}
                                color="primary"
                                sx={{ backgroundColor: theme.palette.primary.light }}
                            />
                            <Chip
                                icon={<Schedule />}
                                label={`${data?.estimatedTimeInMonths} months`}
                                color="primary"
                                sx={{ backgroundColor: theme.palette.primary.light }}
                            />
                            {data?.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    icon={<Tag />}
                                    label={tag}
                                    variant="outlined"
                                    size="small"
                                    sx={{ borderColor: theme.palette.primary.light }}
                                />
                            ))}
                        </Box>
                    </CardContent>
                </StyledCard>
                {/* Left sidebar with user progress */}
                <Box sx={{ width: '100%',
                    display: 'flex',
                    flexDirection: 'row'
                    , flexShrink: 0 }}>
                    <UserProgressIndicator>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NavigationIcon color="warning" />
                            <Typography variant="h6" color="warning.main">
                                Your Progress
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Current Phase
                            </Typography>
                            <Typography variant="h5" color="warning.main" gutterBottom>
                                Phase {userProgress}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data?.phases[userProgress - 1]?.name}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Overall Progress
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={(userProgress - 1) / data?.phases.length * 100}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: theme.palette.grey[200],
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: theme.palette.warning.main,
                                        borderRadius: 5,
                                    }
                                }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                                {Math.round((userProgress - 1) / data?.phases.length * 100)}% Complete
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Phase Status
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {data?.phases.map((phase) => (
                                    <ProgressChip
                                        key={phase.phase}
                                        icon={isPhaseActive(phase.phase) ? <StarIcon /> : <CheckCircleOutline />}
                                        label={`Phase ${phase.phase}`}
                                        completed={isPhaseCompleted(phase.phase)}
                                        variant={isPhaseActive(phase.phase) ? "outlined" : "filled"}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </UserProgressIndicator>
                {/* Timeline */}
                <Timeline sx={{ p: '0 1', width:'50%' }}>
                    {data?.phases.map((phase, index) => (
                        <TimelineItem key={phase.phase}
                        sx={{
                            mb: index === data.phases.length - 1 ? 0 : 4,
                            '&:before': { display: 'none' }
                        }}
                        >
                            <TimelineSeparator>
                                <StyledTimelineDot
                                    completed={isPhaseCompleted(phase.phase)}
                                    active={isPhaseActive(phase.phase)}
                                >
                                    {isPhaseCompleted(phase.phase) ? (
                                        <CheckIcon color="inherit" />
                                    ) : isPhaseActive(phase.phase) ? (
                                        <NavigationIcon color="inherit" />
                                    ) : (
                                        <Typography variant="subtitle2" color="inherit">
                                            {phase.phase}
                                        </Typography>
                                    )}
                                </StyledTimelineDot>
                                {index !== data.phases.length - 1 && (
                                    <TimelineConnector sx={{
                                        backgroundColor: isPhaseCompleted(phase.phase)
                                            ? theme.palette.success.light
                                            : theme.palette.grey[300]
                                    }} />
                                )}
                            </TimelineSeparator>

                            <TimelineContent>
                                <StyledCard active={isPhaseActive(phase.phase)}>
                                    <CardContent>
                                        {/* Phase Header */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Box>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 'bold',
                                                    color: isPhaseActive(phase.phase)
                                                        ? theme.palette.warning.dark
                                                        : theme.palette.text.primary
                                                }}>
                                                    Phase {phase.phase}: {phase.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Duration: {phase.duration} months
                                                </Typography>
                                            </Box>
                                            <ExpandButton
                                                expanded={expandedPhase === phase.phase}
                                                onClick={() => handleExpandPhase(phase.phase)}
                                                size="small"
                                            >
                                                <ExpandMoreIcon />
                                            </ExpandButton>
                                        </Box>

                                        {/* Progress Bar */}
                                        <Box sx={{ mb: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={calculatePhaseProgress(phase)}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: theme.palette.grey[200],
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        backgroundColor: isPhaseActive(phase.phase)
                                                            ? theme.palette.warning.main
                                                            : isPhaseCompleted(phase.phase)
                                                                ? theme.palette.success.main
                                                                : theme.palette.primary.main
                                                    },
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                                                {Math.round(calculatePhaseProgress(phase))}% Complete
                                            </Typography>
                                        </Box>

                                        {/* Phase Items */}
                                        <Collapse in={expandedPhase === phase.phase}>
                                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {phase.items.map((item, itemIndex) => (
                                                    <Paper
                                                        key={itemIndex}
                                                        elevation={0}
                                                        onClick={() => handleClickItem(phase, item)}
                                                        sx={{
                                                            p: 2,
                                                            bgcolor: isPhaseActive(phase.phase)
                                                                ? 'rgba(255, 167, 38, 0.05)'
                                                                : 'rgba(0, 0, 0, 0.02)',
                                                            border: '1px solid',
                                                            borderColor: isPhaseActive(phase.phase)
                                                                ? 'warning.light'
                                                                : 'divider',
                                                            borderRadius: 2,
                                                            transition: 'all 0.3s ease',
                                                            ":hover": { boxShadow: 2,
                                                                        scale: 1.01
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                            <Box
                                                                sx={{
                                                                    width: 28,
                                                                    height: 28,
                                                                    borderRadius: '50%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    bgcolor: item.completed
                                                                        ? theme.palette.success.main
                                                                        : isPhaseActive(phase.phase)
                                                                            ? theme.palette.warning.light
                                                                            : theme.palette.grey[100],
                                                                    color: item.completed || isPhaseActive(phase.phase)
                                                                        ? 'white'
                                                                        : theme.palette.text.secondary,
                                                                }}
                                                            >
                                                                {item.completed ? (
                                                                    <CheckIcon fontSize="small" />
                                                                ) : (
                                                                    <Typography variant="body2">{item.order}</Typography>
                                                                )}
                                                            </Box>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography variant="subtitle1" sx={{
                                                                    fontWeight: 500,
                                                                    color: isPhaseActive(phase.phase)
                                                                        ? theme.palette.warning.dark
                                                                        : theme.palette.text.primary
                                                                }}>
                                                                    {item.name}
                                                                    {item.tags && item.tags.map((tag, index) => (
                                                                        <Chip
                                                                        key={index}
                                                                        variant='outlined'
                                                                        color='primary'
                                                                        size='small'
                                                                        label={`#${tag}`}
                                                                        sx={{ ml: 1 }}
                                                                        ></Chip>
                                                                    ))}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {item.description}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        </Collapse>
                                    </CardContent>
                                </StyledCard>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
                </Box>
            </Box>
        </Box>
    );
};

export default RoadMapDisplay;