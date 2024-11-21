import Accordion from '@mui/material/Accordion';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';


import { Circle } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseByID } from '~/store/slices/Course/action';

import { clearError } from '~/store/slices/Course/courseSlice';
import { useNotification } from '~/hooks/useNotification';
import AddIcon from '@mui/icons-material/Add';
import IconComponent from './../../../../Components/Common/Button/IconComponent';
import { getAllModules } from '~/store/slices/Module/action';
import CustomMenuItemButton from '~/modules/Lesson/Button/CustomMenuItemButton';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseId, moduleId } = useParams();
    const { refresh } = useSelector((state) => state.module);
    const allModules = useSelector((state) => state.module.modules);
    const { currentCourse, loading, error } = useSelector((state) => state.course);
    const [courseData, setCourseData] = useState();
    const [modules, setModules] = useState()
    const [moduleData, setModuleData] = useState()
    const [activeButton, setActiveButton] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getCourseByID(courseId));
            }
            catch (err) {
                console.error('Error:', err);
            }

        };
        fetchData()
    }, [dispatch, courseId])

    useEffect(() => {
        if (currentCourse?.data) {
            setCourseData(currentCourse.data);
            setModules(currentCourse?.data.modules)
            findModuleData(moduleId);

        }
    }, [currentCourse, courseId, moduleId]);
    const { showNotice } = useNotification();

    useEffect(() => {
        if (error) {
            showNotice('error', error.message);
            // Có thể clear error sau khi đã hiển thị
            dispatch(clearError());
        }
    }, [error, showNotice]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getAllModules(courseId));
                console.log('fetch data')
            }
            catch (error) {
                showNotice('error', error.message);
            }
        }
        fetchData();
        //console.log('modules', allModules)
    }, [courseId, moduleId, refresh])

    useEffect(() => {
        findModuleData(moduleId);
    }, [allModules, courseId, moduleId])
    const findModuleData = (index) => {
        const findModuleData1 = allModules.find(module => module.index === String(index));
        setModuleData(findModuleData1)
        //console.log("findModuleData", findModuleData1);
    }



    const handleNewModuleClick = () => {
        setActiveButton(null);
        navigate(`/course-management/${courseId}/module/new-module`);
    }
    const handleNewModuleItemClick = (moduleIndex) => {
        setActiveButton(null);
        navigate(`/course-management/${courseId}/module/${moduleIndex}/new-module-item`);
    }

    const handleEditModuleClick = (currentModule, moduleIndex) => {
        setActiveButton(null);
        navigate(`/course-management/${courseId}/module/${moduleIndex}`, {
            state: {
                currentModule: currentModule,
            }
        });
    }
    const handleEditModuleItemClick = (curretnModuleItem, moduleIndex, moduleItemId) => {
        setActiveButton(`${moduleItemId}`);
        //console.log("handle ", curretnModuleItem, moduleIndex, moduleItemId);
        navigate(`/course-management/${courseId}/module/${moduleIndex}/moduleitem/${moduleItemId}`, { state: { curretnModuleItem: curretnModuleItem } });

    }


    const handleChange = (panel) => (event, isExpanded) => {

        setExpanded(isExpanded ? panel : false);
    };

    const CustomAccordion = styled(Accordion)(() => ({
        background: 'transparent',
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: '1 rem',
        },
        fontWeight: 'bold'
    }));


    const CustomAccordionSummary = styled(AccordionSummary)(() => ({
        height: '64px',
        background: 'transparent',
        justifyContent: 'flex-start',
        paddingLeft: '48px',
        borderRadius: '0 4px 4px 0',

        '&:hover': {
            background: '#f0f6ff',
        },
        '&.Mui-expanded': {
            background: '#f2f5fa',
            //borderLeft: '4px solid #0056d2',
            borderRadius: '0 4px 4px 0',
        },
        '& .MuiAccordionSummary-expandIconWrapper': {
            //marginLeft: 'auto',
        },
        fontWeight: 'bold',
        textTransform: "none",
        color: "#000000",
        fontSize: "16px",
        display: "flex",
        // flexDirection: 'row-reverse',
        // alignItems: 'center',
    }));


    const CustomAccordionDetails = styled(AccordionDetails)(() => ({
        padding: 0,
        paddingLeft: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,


    }));


    const AddButton = styled(Button)(({ theme, isActive }) => ({

        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(2),
        width: '100%',
        height: '64px',
        //fontWeight: 'bold',
        textTransform: "capitalize",
        color: "#000000",
        fontSize: "16px",
        background: isActive ? "#f2f5fa" : "transparent",
        borderLeftColor: isActive ? "#0056d2" : "transparent",
        borderLeftWidth: isActive ? "4px" : "0",
        borderRadius: isActive ? "4px" : "0 4px 4px 0",
        borderLeftStyle: isActive ? 'solid' : 'none',
        textDecoration: isActive ? 'underline' : 'none',

        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            backgroundColor: 'transparent',
            transition: 'background-color 0.3s',
        },
        '&:hover': {
            background: "#f0f6ff",
            //textDecoration: 'underline',
        },

        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",
        gap: "8px",

    }));

    const navigateModuleSession = () => {
        navigate(`/course-management/${courseId}/module`)
    }
    return (
        <div>
            <div className="w-full bg-transparent h-full flex justify-start items-center py-8 ">
                <Typography onClick={() => navigateModuleSession()} variant='h4' fontSize="bold" sx={{ textTransform: "none" }}>{courseData?.title}</Typography>
            </div>
            {allModules && allModules?.map((module, index) => (
                <div key={index}>
                    <CustomAccordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                        <CustomAccordionSummary
                            expandIcon={<ExpandMoreIcon style={{ width: '24px', height: '24px', color: 'black' }} />}
                            // expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                            onClick={() => handleEditModuleClick(module, module.index)}
                        >
                            Module {module.index}
                        </CustomAccordionSummary>
                        <CustomAccordionDetails>
                            {module.moduleItems && module.moduleItems.map((item, idx) => (
                                <CustomMenuItemButton
                                    key={idx}
                                    fullWidth
                                    onClick={() => handleEditModuleItemClick(item, module.index, item._id)}
                                    isActive={activeButton === item._id}
                                    icon={<IconComponent icon={item.icon} />}
                                >

                                    <Typography fontWeight="bold" fontSize='12px' sx={{ display: 'inline', textTransform: 'capitalize' }}> {item.contentType}</Typography>
                                    <Typography fontSize='12px' sx={{ display: 'inline', textTransform: 'capitalize', marginLeft: '8px' }}>{item.title}</Typography>
                                    <Typography fontSize='10px' sx={{ textTransform: 'lowercase', }} color='#5b6790'> {item.note}</Typography>


                                </CustomMenuItemButton>
                            ))}
                            <AddButton onClick={() => handleNewModuleItemClick(module.index)}>New Module Item <AddIcon /></AddButton>
                        </CustomAccordionDetails>
                    </CustomAccordion>
                </div>
            ))}
            <AddButton onClick={() => handleNewModuleClick()} >
                New Module
                <AddIcon />
            </AddButton>

        </div>
    )
}

export default Sidebar
