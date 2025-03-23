﻿import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  useTheme,
  styled
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import ScheduleIcon from '@mui/icons-material/Schedule';
import UpdateIcon from '@mui/icons-material/Update';
import LaptopIcon from '@mui/icons-material/Laptop';
import StorageIcon from '@mui/icons-material/Storage';
import BoltIcon from '@mui/icons-material/Bolt';

// Styled components for enhanced UI
const RoadmapHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status) {
    case 'completed':
      color = theme.palette.success.main;
      break;
    case 'in-progress':
      color = theme.palette.info.main;
      break;
    case 'not-started':
    default:
      color = theme.palette.text.disabled;
  }
  
  return {
    backgroundColor: color,
    color: '#fff',
    fontWeight: 'bold',
    '& .MuiChip-icon': {
      color: '#fff',
    },
  };
});

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const PhaseCard = styled(Paper)(({ theme, status }) => {
  let borderColor;
  switch (status) {
    case 'completed':
      borderColor = theme.palette.success.main;
      break;
    case 'in-progress':
      borderColor = theme.palette.info.main;
      break;
    case 'not-started':
    default:
      borderColor = theme.palette.text.disabled;
  }
  
  return {
    marginBottom: theme.spacing(3),
    borderRadius: 12,
    borderLeft: `6px solid ${borderColor}`,
    overflow: 'hidden',
    boxShadow: theme.shadows[2],
  };
});

const TagChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 6,
  },
}));

const ItemPaper = styled(Paper)(({ theme, completed }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 8,
  transition: 'transform 0.2s ease-in-out',
  backgroundColor: completed ? 'rgba(76, 175, 80, 0.08)' : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[3],
  },
}));

const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
  }),
}));

// Custom Step Icon component
function CustomStepIcon(props) {
  const { active, completed, className } = props;
  const icons = {
    1: <LaptopIcon />,
    2: <CodeIcon />,
    3: <StorageIcon />,
    4: <BoltIcon />,
  };

  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </StepIconRoot>
  );
}

const WebDevelopmentRoadmap = () => {
  const [expanded, setExpanded] = useState('panel0');
  const theme = useTheme();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // Sample data from the provided JSON
  const roadmapData = {
    "_id": "67cd462d1d2bd9c4279780ec",
    "title": "Web Development Roadmap",
    "description": "A 1-year roadmap for beginners to learn front-end and back-end web development with a focus on JavaScript, React, and Node.js.",
    "phases": [
      {
        "phase": 1,
        "name": "Foundation of Frontend Development",
        "duration": 4,
        "items": [
          {
            "name": "Enhance HTML & CSS",
            "tags": ["HTML", "CSS"],
            "description": "Deepen your understanding of HTML5 and CSS3. Learn responsive design using CSS Grid and Flexbox.",
            "completed": true,
            "order": 1
          },
          {
            "name": "JavaScript Essentials",
            "tags": ["JavaScript"],
            "description": "Master JavaScript basics, including ES6 features like arrow functions, destructuring, and modules.",
            "completed": true,
            "order": 2
          },
          {
            "name": "Introduction to React",
            "tags": ["React"],
            "description": "Learn React basics, including components, props, state, and the component lifecycle.",
            "completed": true,
            "order": 3
          }
        ],
        "status": "completed",
        "startDate": "2025-03-09T07:41:38.363Z",
        "endDate": "2025-03-09T08:17:50.818Z"
      },
      {
        "phase": 2,
        "name": "Advanced Frontend Development",
        "duration": 4,
        "items": [
          {
            "name": "React Hooks",
            "tags": ["React"],
            "description": "Learn how to use React Hooks like useState, useEffect, useContext, and more.",
            "completed": false,
            "order": 1
          },
          {
            "name": "Advanced JavaScript",
            "tags": ["JavaScript"],
            "description": "Explore asynchronous JavaScript with Promises, async/await, and advanced topics like event loop and scope.",
            "completed": false,
            "order": 2
          },
          {
            "name": "React Router",
            "tags": ["React"],
            "description": "Implement routing in React applications using React Router.",
            "completed": false,
            "order": 3
          }
        ],
        "status": "in-progress",
        "startDate": "2025-03-09T08:16:30.538Z",
        "endDate": null
      },
      {
        "phase": 3,
        "name": "Introduction to Backend Development",
        "duration": 3,
        "items": [
          {
            "name": "Node.js Basics",
            "tags": ["Node.js"],
            "description": "Learn server-side JavaScript with Node.js, including the Node.js runtime environment and NPM.",
            "completed": false,
            "order": 1
          },
          {
            "name": "Express.js",
            "tags": ["Node.js", "Express"],
            "description": "Build RESTful APIs using Express.js, a minimal and flexible Node.js web application framework.",
            "completed": false,
            "order": 2
          },
          {
            "name": "Databases",
            "tags": ["Database", "MongoDB"],
            "description": "Learn how to work with databases in your web applications. Start with MongoDB for its flexibility and ease of use.",
            "completed": false,
            "order": 3
          }
        ],
        "status": "not-started",
        "startDate": null,
        "endDate": null
      },
      {
        "phase": 4,
        "name": "Full Stack Project",
        "duration": 1,
        "items": [
          {
            "name": "Build a Full Stack Application",
            "tags": ["React", "Node.js", "MongoDB"],
            "description": "Apply everything you've learned by building a full-stack project. Examples include a social media app, e-commerce platform, or a personal blog.",
            "completed": false,
            "order": 1
          }
        ],
        "status": "not-started",
        "startDate": null,
        "endDate": null
      }
    ],
    "progress": 30,
    "tags": ["web development", "frontend", "backend", "javascript", "react", "node.js"],
    "difficulty": "beginner",
    "estimatedTimeInMonths": 12,
    "createdAt": "2025-03-09T07:41:33.663Z",
    "updatedAt": "2025-03-09T08:17:50.818Z"
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'in-progress':
        return <AccessTimeIcon />;
      case 'not-started':
      default:
        return <RadioButtonUncheckedIcon />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
      default:
        return 'Not Started';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not started';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTagColor = (tag) => {
    const tagColors = {
      "HTML": "error",
      "CSS": "info",
      "JavaScript": "warning",
      "React": "primary",
      "Node.js": "success",
      "Express": "secondary",
      "Database": "default",
      "MongoDB": "info"
    };
    return tagColors[tag] || "default";
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      <RoadmapHeader elevation={0}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          {roadmapData.title}
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          {roadmapData.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ minWidth: 35, mr: 2 }}>
            <Typography variant="h4" color="inherit">
              {roadmapData.progress}%
            </Typography>
          </Box>
          <Box sx={{ width: '100%', mr: 1 }}>
            <ProgressBar 
              variant="determinate" 
              value={roadmapData.progress} 
              color="secondary"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {roadmapData.tags.map((tag, index) => (
            <TagChip 
              key={index} 
              label={tag} 
              color="secondary" 
              variant="outlined"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </Box>
      </RoadmapHeader>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.light, mb: 2, mx: 'auto' }}>
                <StarIcon />
              </Avatar>
              <Typography color="text.secondary" gutterBottom>
                Difficulty
              </Typography>
              <Typography variant="h5" component="div" fontWeight="medium">
                Beginner
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: theme.palette.warning.light, mb: 2, mx: 'auto' }}>
                <ScheduleIcon />
              </Avatar>
              <Typography color="text.secondary" gutterBottom>
                Estimated Time
              </Typography>
              <Typography variant="h5" component="div" fontWeight="medium">
                12 months
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: theme.palette.success.light, mb: 2, mx: 'auto' }}>
                <SchoolIcon />
              </Avatar>
              <Typography color="text.secondary" gutterBottom>
                Created
              </Typography>
              <Typography variant="h5" component="div" fontWeight="medium">
                {formatDate(roadmapData.createdAt)}
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: theme.palette.info.light, mb: 2, mx: 'auto' }}>
                <UpdateIcon />
              </Avatar>
              <Typography color="text.secondary" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="h5" component="div" fontWeight="medium">
                {formatDate(roadmapData.updatedAt)}
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Your Learning Path
      </Typography>

      <Stepper orientation="vertical" sx={{ mb: 4 }} connector={null}>
        {roadmapData.phases.map((phase, index) => (
          <Step key={index} active={true}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6" fontWeight="bold">
                  Phase {phase.phase}: {phase.name}
                </Typography>
                <StatusChip 
                  label={getStatusText(phase.status)} 
                  status={phase.status}
                  icon={getStatusIcon(phase.status)}
                  size="medium"
                />
              </Box>
            </StepLabel>
            <StepContent sx={{ ml: 0.5 }}>
              <PhaseCard status={phase.status} sx={{ mt: 2, p: 0 }}>
                <Box sx={{ p: 2, bgcolor: phase.status === 'completed' ? 'rgba(76, 175, 80, 0.04)' : 
                               phase.status === 'in-progress' ? 'rgba(33, 150, 243, 0.04)' : 
                               'transparent' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      <Box component="span" sx={{ fontWeight: 'bold' }}>{phase.duration}</Box> weeks duration
                    </Typography>
                    {phase.status === 'completed' ? (
                      <Typography variant="subtitle1" color="success.main">
                        Completed on {formatDate(phase.endDate)}
                      </Typography>
                    ) : phase.status === 'in-progress' ? (
                      <Typography variant="subtitle1" color="info.main">
                        Started on {formatDate(phase.startDate)}
                      </Typography>
                    ) : null}
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={phase.items.filter(item => item.completed).length / phase.items.length * 100} 
                    sx={{ height: 6, borderRadius: 3, mb: 2 }}
                    color={phase.status === 'completed' ? 'success' : 'primary'}
                  />
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {phase.items.filter(item => item.completed).length} of {phase.items.length} items completed
                  </Typography>
                </Box>
              
                <Accordion 
                  expanded={expanded === `panel${index}`} 
                  onChange={handleChange(`panel${index}`)}
                  disableGutters
                  elevation={0}
                  sx={{ 
                    '&:before': { display: 'none' },
                    borderTop: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ px: 2 }}
                  >
                    <Typography fontWeight="medium">
                      View Learning Items
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    {phase.items.map((item, itemIndex) => (
                      <ItemPaper key={itemIndex} completed={item.completed} elevation={1}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box sx={{ mr: 2, pt: 0.5 }}>
                            {item.completed ? 
                              <CheckCircleIcon color="success" fontSize="large" /> : 
                              <RadioButtonUncheckedIcon color="disabled" fontSize="large" />
                            }
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
                              <Typography variant="h6" sx={{ mr: 2, fontWeight: 'medium' }}>
                                {item.name}
                              </Typography>
                              {item.tags.map((tag, tagIndex) => (
                                <Chip 
                                  key={tagIndex} 
                                  label={tag} 
                                  size="small" 
                                  color={getTagColor(tag)}
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {item.description}
                            </Typography>
                            {item.test && !item.completed && (
                              <Button 
                                variant="contained" 
                                color="primary"
                                size="small"
                                startIcon={<SchoolIcon />}
                                sx={{ borderRadius: 8 }}
                              >
                                Take Assessment
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </ItemPaper>
                    ))}
                    
                    {phase.status === 'not-started' && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<BoltIcon />}
                          sx={{ borderRadius: 28, px: 4 }}
                        >
                          Start Phase
                        </Button>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </PhaseCard>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default WebDevelopmentRoadmap;