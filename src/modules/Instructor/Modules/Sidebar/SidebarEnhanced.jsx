import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion, AccordionSummary, AccordionDetails, Button,
  Typography, Box, Tooltip, Chip, Badge, Divider, Avatar
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon, School as SchoolIcon,
  VideoLibrary, Description, Quiz, Code, Add as AddIcon,
  MenuBook, Assignment, ArrowForward, Edit as EditIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { getCourseByID } from '~/store/slices/Course/action';
import { clearError } from '~/store/slices/Course/courseSlice';
import { useNotification } from '~/Hooks/useNotification';
import { getAllModules } from '~/store/slices/Module/action';
import IconComponent from '../../../../Components/Common/Button/IconComponent';

// Styled components with enhanced visual effects
const SidebarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflowY: 'auto',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  transition: 'all 0.3s ease',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.primary.main, 0.2),
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: alpha(theme.palette.primary.main, 0.5),
  }
}));

const CourseTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  color: theme.palette.text.primary,
  position: 'relative',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateX(4px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
    transition: 'width 0.3s ease',
  }
}));

const ModuleAccordion = styled(Accordion)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  margin: theme.spacing(1, 0),
  borderRadius: '10px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: theme.spacing(1.5, 0),
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    background: alpha(theme.palette.primary.main, 0.03),
  },
  '&:hover': {
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    background: alpha(theme.palette.background.paper, 0.9),
  }
}));

const ModuleHeader = styled(AccordionSummary)(({ theme }) => ({
  minHeight: '60px',
  padding: theme.spacing(0, 2),
  borderRadius: '10px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '4px',
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease',
  },
  
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.08),
    '&::before': {
      backgroundColor: theme.palette.primary.main,
    }
  },
  
  '&.Mui-expanded': {
    background: alpha(theme.palette.primary.main, 0.12),
    minHeight: '60px',
    '&::before': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0 8px ${theme.palette.primary.main}`,
    }
  },
  
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.primary.main,
    transition: 'transform 0.3s ease',
  },
  
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  }
}));

const ModuleNumberCircle = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  width: 36,
  height: 36,
  fontSize: '1rem',
  fontWeight: 'bold',
  marginRight: theme.spacing(2),
  transition: 'all 0.2s ease',
  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'scale(1.08)',
  }
}));

const ModuleContent = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1.5),
  paddingLeft: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  background: alpha(theme.palette.background.paper, 0.8),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
}));

const ModuleItemButton = styled(Button)(({ theme, isActive, contentType }) => {
  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'lecture': return theme.palette.info.main;
      case 'quiz': return theme.palette.warning.main;
      case 'assignment': return theme.palette.success.main;
      case 'code': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };
  
  const color = getTypeColor(contentType);
  
  return {
    width: '100%',
    minHeight: '50px',
    padding: theme.spacing(1, 2, 1, 1),
    justifyContent: 'flex-start',
    textAlign: 'left',
    textTransform: 'none',
    color: isActive ? color : theme.palette.text.primary,
    backgroundColor: isActive ? alpha(color, 0.1) : 'transparent',
    borderRadius: '6px',
    position: 'relative',
    transition: 'all 0.2s ease',
    border: isActive ? `1px solid ${alpha(color, 0.5)}` : '1px solid transparent',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '3px',
      backgroundColor: isActive ? color : 'transparent',
      transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
      borderRadius: '4px 0 0 4px',
    },
    
    '&:hover': {
      backgroundColor: alpha(color, 0.08),
      '&::before': {
        backgroundColor: color,
        boxShadow: `0 0 8px ${alpha(color, 0.5)}`,
      }
    },
    
    '&:active': {
      transform: 'scale(0.98)',
    },
  };
});

const AddNewButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '50px',
  marginTop: theme.spacing(1),
  padding: theme.spacing(1, 2),
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: '8px',
  border: `1px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
  transition: 'all 0.2s ease',
  
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
    transition: 'transform 0.2s ease',
  },
  
  '&:hover .MuiButton-startIcon': {
    transform: 'rotate(90deg)',
  },
  
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

// Function to get the appropriate icon based on content type
const getItemIcon = (contentType) => {
  switch(contentType?.toLowerCase()) {
    case 'lecture': return <VideoLibrary fontSize="small" />;
    case 'quiz': return <Quiz fontSize="small" />;
    case 'assignment': return <Assignment fontSize="small" />;
    case 'code': return <Code fontSize="small" />;
    default: return <Description fontSize="small" />;
  }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId, moduleId } = useParams();
  const { refresh } = useSelector((state) => state.module);
  const allModules = useSelector((state) => state.module.modules);
  const { currentCourse, loading, error } = useSelector((state) => state.course);
  const [courseData, setCourseData] = useState();
  const [modules, setModules] = useState();
  const [moduleData, setModuleData] = useState();
  const [activeButton, setActiveButton] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const { showNotice } = useNotification();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        await dispatch(getCourseByID(courseId));
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchCourse();
  }, [dispatch, courseId]);

  useEffect(() => {
    if (currentCourse?.data) {
      setCourseData(currentCourse.data);
      setModules(currentCourse?.data.modules);
      findModuleData(moduleId);
    }
  }, [currentCourse, courseId, moduleId]);

  useEffect(() => {
    if (error) {
      showNotice('error', error.message);
      dispatch(clearError());
    }
  }, [error, showNotice, dispatch]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        await dispatch(getAllModules(courseId));
      } catch (error) {
        showNotice('error', error.message);
      }
    };
    fetchModules();
  }, [courseId, moduleId, refresh, dispatch, showNotice]);

  useEffect(() => {
    findModuleData(moduleId);
    // Auto expand the current module when page loads
    if (moduleId) {
      const moduleIndex = allModules.findIndex(
        module => module.index === String(moduleId)
      );
      if (moduleIndex !== -1) {
        setExpandedModule(`panel${moduleIndex}`);
      }
    }
  }, [allModules, courseId, moduleId]);

  const findModuleData = (index) => {
    const findModuleData1 = allModules.find(module => module.index === String(index));
    setModuleData(findModuleData1);
  };

  const handleNewModuleClick = () => {
    setActiveButton(null);
    navigate(`/course-management/${courseId}/module/new-module`);
  };

  const handleNewModuleItemClick = (moduleIndex) => {
    setActiveButton(null);
    navigate(`/course-management/${courseId}/module/${moduleIndex}/new-module-item`);
  };

  const handleEditModuleClick = (currentModule, moduleIndex) => {
    setActiveButton(null);
    navigate(`/course-management/${courseId}/module/${moduleIndex}`, {
      state: {
        currentModule: currentModule,
      }
    });
  };

  const handleEditModuleItemClick = (curretnModuleItem, moduleIndex, moduleItemId) => {
    setActiveButton(`${moduleItemId}`);
    navigate(`/course-management/${courseId}/module/${moduleIndex}/moduleitem/${moduleItemId}`, { 
      state: { curretnModuleItem: curretnModuleItem } 
    });
  };

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpandedModule(isExpanded ? panel : false);
  };

  const navigateModuleSession = () => {
    navigate(`/course-management/${courseId}/module`);
  };

  return (
    <SidebarContainer>
      <CourseTitle 
        variant="h5" 
        onClick={navigateModuleSession}
      >
        {courseData?.title}
        <Tooltip title="Go to course overview" placement="right" arrow>
          <ArrowForward fontSize="small" sx={{ ml: 1, opacity: 0.6 }} />
        </Tooltip>
      </CourseTitle>
      
      <Box sx={{ mb: 3 }}>
        <Chip 
          icon={<FolderIcon />} 
          label={`${allModules?.length || 0} Modules`} 
          color="primary" 
          variant="outlined"
          sx={{ mr: 1 }}
        />
        
        <Tooltip title="Add a new module" placement="right" arrow>
          <AddNewButton
            startIcon={<AddIcon />}
            onClick={handleNewModuleClick}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            New Module
          </AddNewButton>
        </Tooltip>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {allModules && allModules.map((module, index) => (
        <ModuleAccordion 
          key={index}
          expanded={expandedModule === `panel${index}`}
          onChange={handleChangeAccordion(`panel${index}`)}
          TransitionProps={{ unmountOnExit: false }}
        >
          <Tooltip 
            title={`${expandedModule === `panel${index}` ? 'Collapse' : 'Expand'} module`}
            placement="right"
            arrow
            enterDelay={500}
          >
            <ModuleHeader
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              onClick={(e) => {
                // Stop propagation so we don't navigate when just expanding
                e.stopPropagation(); 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} onClick={(e) => {
                e.stopPropagation();
                handleEditModuleClick(module, module.index);
              }}>
                <ModuleNumberCircle>{module.index}</ModuleNumberCircle>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {module.title || `Module ${module.index}`}
                  </Typography>
                  {module.moduleItems && (
                    <Typography variant="caption" color="text.secondary">
                      {module.moduleItems.length} items
                    </Typography>
                  )}
                </Box>
              </Box>
            </ModuleHeader>
          </Tooltip>
          
          <ModuleContent>
            {module.moduleItems && module.moduleItems.length > 0 ? (
              module.moduleItems.map((item, idx) => (
                <Tooltip
                  key={idx}
                  title={item.contentType}
                  placement="right"
                  arrow
                  enterDelay={500}
                >
                  <ModuleItemButton
                    fullWidth
                    onClick={() => handleEditModuleItemClick(item, module.index, item._id)}
                    isActive={activeButton === item._id}
                    contentType={item.contentType}
                    startIcon={item.icon ? <IconComponent icon={item.icon} /> : getItemIcon(item.contentType)}
                  >
                    <Box sx={{ ml: 1, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={activeButton === item._id ? 700 : 600} noWrap>
                          {item.title}
                        </Typography>
                        <Chip 
                          label={item.contentType} 
                          size="small" 
                          color={activeButton === item._id ? "primary" : "default"}
                          variant="outlined"
                          sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                        />
                      </Box>
                      {item.note && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ display: 'block', mt: 0.5 }}
                        >
                          {item.note}
                        </Typography>
                      )}
                    </Box>
                    
                    {activeButton === item._id && (
                      <EditIcon fontSize="small" sx={{ ml: 1, opacity: 0.6 }} />
                    )}
                  </ModuleItemButton>
                </Tooltip>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No items in this module yet
              </Typography>
            )}
            
            <AddNewButton 
              startIcon={<AddIcon />}
              onClick={() => handleNewModuleItemClick(module.index)}
              variant="outlined"
            >
              Add New Item
            </AddNewButton>
          </ModuleContent>
        </ModuleAccordion>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
