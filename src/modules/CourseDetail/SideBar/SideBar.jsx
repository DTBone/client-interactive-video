import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Circle, Lock, CheckCircle, PlayCircle } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Typography, Tooltip, Box } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { getAllModules } from "~/store/slices/Module/action.js";
import { getProgress } from '~/store/slices/Progress/action';
import { motion } from 'framer-motion';

// Enum cho trạng thái module
const MODULE_STATUS = {
  LOCKED: 'locked',
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Wrapper để animation
const MotionBox = styled(motion.div)({
  width: '100%'
});

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse } = useSelector((state) => state.course);
    const [course, setCourse] = useState();
    const [activeButton, setActiveButton] = useState(null);
    const [modules, setModules] = useState(useSelector(state => state.module.modules) || []);
    const { courseId, moduleId } = useParams();
    const [moduleDatas, setModuleDatas] = useState([]);
    const [expanded, setExpanded] = useState(true); // Mặc định mở rộng

    useEffect(() => {
        if (currentCourse) {
            setCourse(currentCourse);
        }
    }, [currentCourse]);

    localStorage.setItem('courseId', courseId);
    localStorage.setItem('moduleId', moduleId);

    const fetchProgress = async () => {
        try {
            const rep = await dispatch(getProgress(courseId));
            if (rep.payload?.success) {
                setModuleDatas(rep.payload.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dispatch(getAllModules(courseId));
                if (getAllModules.fulfilled.match(result)) {
                    // Xử lý và gán trạng thái cho các module
                    const processedModules = result.payload.map((module, index) => {
                        // Giả định: Module đầu tiên luôn mở khóa, các module sau phụ thuộc vào việc hoàn thành module trước
                        let status = MODULE_STATUS.NOT_STARTED;
                        
                        // Nếu là module đầu tiên hoặc module trước đã hoàn thành
                        if (index === 0 || (index > 0 && moduleDatas[index-1]?.status === 'completed')) {
                            // Kiểm tra trạng thái từ dữ liệu tiến độ
                            if (moduleDatas[index]?.status === 'completed') {
                                status = MODULE_STATUS.COMPLETED;
                            } else if (moduleDatas[index]?.status === 'in_progress') {
                                status = MODULE_STATUS.IN_PROGRESS;
                            }
                        } else {
                            status = MODULE_STATUS.LOCKED;
                        }
                        
                        return {
                            ...module,
                            status
                        };
                    });
                    
                    setModules(processedModules);
                }
            } catch (e) {
                console.log(e);
            }
        };

        if (courseId) {
            fetchData();
            fetchProgress();
        }
    }, [courseId, moduleDatas.length]);

    const handleButtonClick = (buttonId) => {
        setActiveButton(`${buttonId.toLowerCase()}`);
        navigate(`${buttonId.toLowerCase().replace(/\s+/g, '/')}`, { state: { course } });
    };

    const handleModuleItemClick = (buttonId, module) => {
        // Chỉ cho phép click nếu module không bị khóa
        if (module.status !== MODULE_STATUS.LOCKED) {
            setActiveButton(`${buttonId.toLowerCase()}`);
            navigate(`module/${buttonId.toLowerCase().replace(/\s+/g, '/')}`, { state: { module, course } });
        }
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleCourseTitleClick = (courseId) => {
        navigate(`/learns/${courseId}`);
    };

    // Styled Components
    const CustomAccordion = styled(Accordion)(({ theme }) => ({
        background: 'transparent',
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        fontWeight: 'bold',
        marginBottom: theme.spacing(1),
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(0,0,0,0.1)',
        }
    }));

    const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
        height: '64px',
        background: expanded ? 'rgba(0, 86, 210, 0.05)' : 'transparent',
        justifyContent: 'flex-start',
        paddingLeft: '24px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(0, 86, 210, 0.1)',
        },
        '&.Mui-expanded': {
            background: 'rgba(0, 86, 210, 0.08)',
            borderRadius: '8px 8px 0 0',
        },
        fontWeight: 'bold',
        textTransform: "none",
        color: "#000000",
        fontSize: "16px",
        display: "flex",
    }));

    const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
        padding: 0,
        paddingLeft: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.5),
        background: 'rgba(0, 86, 210, 0.02)',
        borderRadius: '0 0 8px 8px',
        paddingBottom: theme.spacing(1),
    }));

    const CustomButton = styled(Button)(({ theme, isActive, status }) => ({
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(1),
        width: '100%',
        height: '56px',
        textTransform: "none",
        color: status === MODULE_STATUS.LOCKED ? theme.palette.text.disabled : "#000000",
        fontSize: "15px",
        background: isActive ? "rgba(0, 86, 210, 0.08)" : "transparent",
        borderLeftColor: isActive ? theme.palette.primary.main : "transparent",
        borderLeftWidth: isActive ? "4px" : "0",
        borderRadius: "8px",
        borderLeftStyle: isActive ? 'solid' : 'none',
        fontWeight: isActive ? 600 : 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        opacity: status === MODULE_STATUS.LOCKED ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',

        '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '70%',
            borderRadius: '0 2px 2px 0',
            backgroundColor: (() => {
                switch (status) {
                    case MODULE_STATUS.COMPLETED: return theme.palette.success.main;
                    case MODULE_STATUS.IN_PROGRESS: return theme.palette.warning.main;
                    case MODULE_STATUS.NOT_STARTED: return theme.palette.info.light;
                    default: return 'transparent';
                }
            })(),
            transition: 'all 0.3s ease',
        },

        '&:hover': {
            background: status !== MODULE_STATUS.LOCKED ? "rgba(0, 86, 210, 0.05)" : "transparent",
            cursor: status !== MODULE_STATUS.LOCKED ? 'pointer' : 'not-allowed',
        },

        gap: theme.spacing(1),
    }));

    const NavButton = styled(Button)(({ theme, isActive }) => ({
        width: '100%',
        height: '50px',
        justifyContent: 'flex-start',
        paddingLeft: '24px',
        fontWeight: isActive ? 600 : 400,
        textTransform: "none",
        color: "#000000",
        fontSize: "15px",
        background: isActive ? "rgba(0, 86, 210, 0.08)" : "transparent",
        borderRadius: "8px",
        marginBottom: theme.spacing(0.5),
        transition: 'all 0.2s ease',

        '&:hover': {
            background: "rgba(0, 86, 210, 0.05)",
        },
    }));

    // Helper function để hiển thị icon trạng thái module
    const getModuleStatusIcon = (status) => {
        switch (status) {
            case MODULE_STATUS.COMPLETED:
                return <CheckCircle color="success" />;
            case MODULE_STATUS.IN_PROGRESS:
                return <PlayCircle color="warning" />;
            case MODULE_STATUS.NOT_STARTED:
                return <Circle sx={{ color: 'rgba(0, 0, 0, 0.3)' }} />;
            case MODULE_STATUS.LOCKED:
                return <Lock fontSize="small" />;
            default:
                return <Circle sx={{ color: 'rgba(0, 0, 0, 0.3)' }} />;
        }
    };

    // Helper function để hiển thị tooltip cho từng trạng thái
    const getModuleStatusTooltip = (status) => {
        switch (status) {
            case MODULE_STATUS.COMPLETED:
                return "completion";
            case MODULE_STATUS.IN_PROGRESS:
                return "in-progress";
            case MODULE_STATUS.NOT_STARTED:
                return "not-started";
            case MODULE_STATUS.LOCKED:
                return "locked";
            default:
                return "";
        }
    };

    return (
        <MotionBox 
            className="flex flex-col pl-4 pr-2 py-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                    onClick={() => navigate(`/course/${courseId}`)} 
                    className="flex items-center gap-2 mb-4"
                    variant="text"
                    startIcon="⇽"
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    Back to Courses
                </Button>
            </motion.div>

            <motion.div 
                className="w-full bg-transparent cursor-pointer py-6 px-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCourseTitleClick(courseId)}
            >
                <Typography 
                    variant='h5' 
                    fontWeight="600" 
                    sx={{ 
                        textTransform: "none",
                        color: '#0056d2',
                        paddingBottom: '8px',
                        borderBottom: '1px solid rgba(0, 86, 210, 0.2)',
                     }}
                >
                    {course?.title || "Khóa học của bạn"}
                </Typography>
            </motion.div>

            <Box my={2}>
                <CustomAccordion expanded={expanded === 'panel'} onChange={handleChange('panel')}>
                    <CustomAccordionSummary
                        expandIcon={<ExpandMoreIcon style={{ width: '24px', height: '24px', color: '#0056d2' }} />}
                        aria-controls="panel-content"
                        id="panel-header"
                    >
                        <Typography fontWeight={600} fontSize={16} color="#0056d2">Course Material</Typography>
                    </CustomAccordionSummary>
                    
                    <CustomAccordionDetails>
                        {modules.map((item, index) => (
                            <motion.div 
                                key={index} 
                                whileHover={{ x: item.status !== MODULE_STATUS.LOCKED ? 4 : 0 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Tooltip title={getModuleStatusTooltip(item.status)} placement="right" arrow>
                                    <div>
                                        <CustomButton
                                            fullWidth
                                            onClick={() => handleModuleItemClick(item.index, item)}
                                            isActive={activeButton === item.index}
                                            status={item.status}
                                            startIcon={getModuleStatusIcon(item.status)}
                                            disableRipple={item.status === MODULE_STATUS.LOCKED}
                                        >
                                            <Typography 
                                                noWrap 
                                                textOverflow="ellipsis" 
                                                width="100%" 
                                                textAlign="left"
                                            >
                                                Module {index + 1}: {item.title}
                                            </Typography>
                                        </CustomButton>
                                    </div>
                                </Tooltip>
                            </motion.div>
                        ))}
                    </CustomAccordionDetails>
                </CustomAccordion>
            </Box>

            <Box display="flex" flexDirection="column" gap={1} mt={2}>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <NavButton 
                        onClick={() => handleButtonClick("assignments")} 
                        isActive={activeButton === 'assignments'}
                        startIcon={<motion.div whileHover={{ rotate: 10 }} transition={{ duration: 0.2 }}>📊</motion.div>}
                    >
                        Grades
                    </NavButton>
                </motion.div>
                
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <NavButton 
                        onClick={() => handleButtonClick("course-inbox")} 
                        isActive={activeButton === 'course-inbox'}
                        startIcon={<motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>✉️</motion.div>}
                    >
                        Messages
                    </NavButton>
                </motion.div>
                
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <NavButton 
                        onClick={() => handleButtonClick("info")} 
                        isActive={activeButton === 'info'}
                        startIcon={<motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>ℹ️</motion.div>}
                    >
                        Course Info
                    </NavButton>
                </motion.div>
            </Box>
        </MotionBox>
    );
};

export default SideBar;
