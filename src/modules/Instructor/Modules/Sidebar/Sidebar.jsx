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
import NoticeToastify from '~/Components/Common/NoticeToastify';
import { useNotification } from '~/Hooks/useNotification';


const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseId, moduleId } = useParams();
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
        console.log('first state: ', courseId, moduleId, modules, moduleData);
    }, [currentCourse, courseId, moduleId]);
    const { showNotice } = useNotification();
    useEffect(() => {
        if (error) {
            showNotice('error', error.message);
            // Có thể clear error sau khi đã hiển thị
            dispatch(clearError());
        }
    }, [error, showNotice]);
    const findModuleData = (index) => {
        const findModuleData = courseData?.modules.find(module => module.index === String(index));
        setModuleData(findModuleData)
    }


    const handleButtonClick = (buttonId) => {
        setActiveButton(`${buttonId.toLowerCase()}`);
        navigate(`${buttonId.toLowerCase().replace(/\s+/g, '/')}`);


    };
    const handleModuleItemClick = (itemId, module) => {
        setActiveButton(`${itemId.toLowerCase()}`);
        navigate(`${itemId.toLowerCase().replace(/\s+/g, '-')}`, { state: { module } });

        showNotice('success', 'Create a new module successfully')
    };


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

    const CustomButton = styled(Button)(({ theme, isActive }) => ({
        justifyContent: 'flex-start',
        paddingLeft: theme.spacing(4),
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
        gap: "8px",

    }));
    return (
        <div>
            <div className="w-full bg-transparent h-full flex justify-start items-center py-8 ">
                <Typography variant='h4' fontSize="bold" sx={{ textTransform: "none" }}>{courseData?.title}</Typography>
            </div>
            {modules?.map((module, index) => (
                <div key={index}>
                    <CustomAccordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                        <CustomAccordionSummary
                            expandIcon={<ExpandMoreIcon style={{ width: '24px', height: '24px', color: 'black' }} />}
                            // expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                        >
                            Module {module.index}
                        </CustomAccordionSummary>
                        <CustomAccordionDetails>
                            {module.moduleItems.map((item, idx) => (
                                <CustomButton
                                    key={idx}
                                    fullWidth
                                    onClick={() => handleModuleItemClick(item._id, item)}
                                    isActive={activeButton === item.id} >
                                    <Circle sx={{ color: '#c1cad9' }} />
                                    {item.title}

                                </CustomButton>
                            ))}
                        </CustomAccordionDetails>
                    </CustomAccordion>
                </div>
            ))}
        </div>
    )
}

export default Sidebar
