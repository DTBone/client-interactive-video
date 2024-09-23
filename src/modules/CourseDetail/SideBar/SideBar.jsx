import Accordion from '@mui/material/Accordion';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';


import { Circle } from '@mui/icons-material';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';
import Module from '../MainSection/Modules/Module';

const SideBar = () => {
    // const { id } = useParams();
    const navigate = useNavigate();

    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (buttonId) => {
        setActiveButton(`${buttonId.toLowerCase()}`);
        navigate(`${buttonId.toLowerCase().replace(/\s+/g, '/')}`);


    };
    const handleModuleItemClick = (buttonId, module) => {
        setActiveButton(`${buttonId.toLowerCase()}`);
        navigate(`${buttonId.toLowerCase().replace(/\s+/g, '/')}`, { state: { module } });


    };
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const CustomAccordion = styled(Accordion)(() => ({
        background: 'transparent',
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        flexDirection: 'row-reverse',
        // '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        //     transform: 'rotate(90deg)',
        // },
        // '& .MuiAccordionSummary-content': {
        //     // marginLeft: theme.spacing(1),
        // },
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
            marginLeft: 'auto',
        },
        fontWeight: 'bold',
        textTransform: "none",
        color: "#000000",
        fontSize: "16px",
    }));


    const CustomAccordionDetails = styled(AccordionDetails)(() => ({
        padding: 0,
        paddingLeft: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,


    }));
    const CustomButton1 = styled(Button)(({ isActive }) => ({
        width: '100%',
        height: '64px',
        justifyContent: 'flex-start',
        paddingLeft: '48px',
        fontWeight: 'bold',
        textTransform: "capitalize",
        color: "#000000",
        fontSize: "16px",
        background: isActive ? "#f2f5fa" : "transparent",
        borderLeftColor: isActive ? "#0056d2" : "transparent",
        borderLeftWidth: isActive ? "4px" : "0",
        borderRadius: isActive ? "0 4px 4px 0" : "4px",
        borderLeftStyle: isActive ? 'solid' : 'none',
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
        },
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
    const modules = [
        {
            id: 'module 1',
            name: 'Mergsort',
            description: 'We study the mergesort algorithm and show that it guarantees to sort any array of n items with at most n lg n compares. We also consider a nonrecursive, bottom-up version. We prove that any compare-based sorting algorithm must make at least n lg n compares in the worst case. We discuss using different orderings for the objects that we are sorting and the related concept of stability.',
            content: [
                {
                    icon: 'video',
                    title: '48 min of video left',
                },
                {
                    icon: 'read',
                    title: 'All readings completed',
                }, {
                    icon: 'assignment',
                    title: '1 graded assessment left',
                }],
            item: [
                {
                    icon: 'read',
                    title: 'Overview',
                    type: 'reading'
                },
                {
                    icon: 'read',
                    title: 'Lecture Slides',
                    type: 'reading'
                },
                {
                    icon: 'video',
                    title: 'Mergesort',
                    type: 'video'
                },
                {
                    icon: 'quiz',
                    title: 'Interview Questions',
                    type: 'practice quiz',
                },
                {
                    icon: 'code',
                    title: 'Collinear Points',
                    type: 'programming assignment',
                }]
        },
        {
            id: 'module 2',
            name: 'Quicksort',
            description: 'We introduce the quicksort algorithm and analyze its performance. We also consider randomized quicksort, a simple randomized algorithm that is guaranteed to have good performance.',
            content: [
                {
                    icon: 'video',
                    title: '48 min of video left',
                },
                {
                    icon: 'read',
                    title: 'All readings completed',
                }, {
                    icon: 'assignment',
                    title: '1 graded assessment left',
                }],
            item: [
                {
                    icon: 'read',
                    title: 'Overview',
                    type: 'reading'
                },
                {
                    icon: 'read',
                    title: 'Lecture Slides',
                    type: 'reading'
                },
                {
                    icon: 'video',
                    title: 'Quicksort',
                    type: 'video'
                },
                {
                    icon: 'quiz',
                    title: 'Interview Questions',
                    type: 'practice quiz',
                },
                {
                    icon: 'code',
                    title: 'Collinear Points',
                    type: 'programming assignment',
                }]
        },
        {
            id: 'module 3',
            name: 'Priority Queues',
            description: 'We introduce a queue abstraction that allows clients to insert keys into a collection and then remove the largest key. We consider two implementations: one based on an unordered array and the other based on a heap.',
            content: [
                {
                    icon: 'video',
                    title: '48 min of video left',
                },
                {
                    icon: 'read',
                    title: 'All readings completed',
                }, {
                    icon: 'assignment',
                    title: '1 graded assessment left',
                }],
            item: [
                {
                    icon: 'read',
                    title: 'Overview',
                    type: 'reading'
                },
                {
                    icon: 'read',
                    title: 'Lecture Slides',
                    type: 'reading'
                },
                {
                    icon: 'video',
                    title: 'Priority Queues',
                    type: 'video'
                },
                {
                    icon: 'quiz',
                    title: 'Interview Questions',
                    type: 'practice quiz',
                },
                {
                    icon: 'code',
                    title: 'Collinear Points',
                    type: 'programming assignment',
                }]
        },
        {
            id: 'module 4',
            name: 'Priority Queues',
            description: 'We introduce a queue abstraction that allows clients to insert keys into a collection and then remove the largest key. We consider two implementations: one based on an unordered array and the other based on a heap.',
            content: [
                {
                    icon: 'video',
                    title: '48 min of video left',
                },
                {
                    icon: 'read',
                    title: 'All readings completed',
                }, {
                    icon: 'assignment',
                    title: '1 graded assessment left',
                }],
            item: [
                {
                    icon: 'read',
                    title: 'Overview',
                    type: 'reading'
                },
                {
                    icon: 'read',
                    title: 'Lecture Slides',
                    type: 'reading'
                },
                {
                    icon: 'video',
                    title: 'Priority Queues',
                    type: 'video'
                },
                {
                    icon: 'quiz',
                    title: 'Interview Questions',
                    type: 'practice quiz',
                },
                {
                    icon: 'code',
                    title: 'Collinear Points',
                    type: 'programming assignment',
                }]
        },
        {
            id: 'module 5',
            name: 'Priority Queues',
            description: 'We introduce a queue abstraction that allows clients to insert keys into a collection and then remove the largest key. We consider two implementations: one based on an unordered array and the other based on a heap.',
            content: [
                {
                    icon: 'video',
                    title: '48 min of video left',
                },
                {
                    icon: 'read',
                    title: 'All readings completed',
                }, {
                    icon: 'assignment',
                    title: '1 graded assessment left',
                }],
            item: [
                {
                    icon: 'read',
                    title: 'Overview',
                    type: 'reading'
                },
                {
                    icon: 'read',
                    title: 'Lecture Slides',
                    type: 'reading'
                },
                {
                    icon: 'video',
                    title: 'Priority Queues',
                    type: 'video'
                },
                {
                    icon: 'quiz',
                    title: 'Interview Questions',
                    type: 'practice quiz',
                },
                {
                    icon: 'code',
                    title: 'Collinear Points',
                    type: 'programming assignment',
                }]
        },
        {
            id: 'module 6',
            name: 'Priority Queues',
            description: 'We introduce a queue abstraction that allows clients to insert keys into a collection and then remove the largest key. We consider two implementations: one based on an unordered array and the other based on a heap.',
            content: [
                {
                    icon: 'video',
                    title: '48 min of video left',
                },
                {
                    icon: 'read',
                    title: 'All readings completed',
                }, {
                    icon: 'assignment',
                    title: '1 graded assessment left',
                }],
            item: [
                {
                    icon: 'read',
                    title: 'Overview',
                    type: 'reading'
                },
                {
                    icon: 'read',
                    title: 'Lecture Slides',
                    type: 'reading'
                },
                {
                    icon: 'video',
                    title: 'Priority Queues',
                    type: 'video'
                },
                {
                    icon: 'quiz',
                    title: 'Interview Questions',
                    type: 'practice quiz',
                },
                {
                    icon: 'code',
                    title: 'Collinear Points',
                    type: 'programming assignment',
                }]
        }
    ]

    return (
        <div className="">
            <div className="w-full bg-transparent h-full flex justify-start items-center py-8 ">
                <Typography variant='h4' fontSize="bold" sx={{ textTransform: "none" }}>Course Name</Typography>

            </div>
            <CustomAccordion expanded={expanded === 'panel'} onChange={handleChange('panel')}>
                <CustomAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-content"
                    id="panel-header"
                >
                    Course Material
                </CustomAccordionSummary>
                <CustomAccordionDetails>
                    {modules.map((item, index) => (
                        <CustomButton
                            key={index}
                            fullWidth
                            onClick={() => handleModuleItemClick(item.id, item)}
                            isActive={activeButton === item.id} >
                            <Circle sx={{ color: '#c1cad9' }} />
                            {item.id}

                        </CustomButton>
                    ))}
                </CustomAccordionDetails>
            </CustomAccordion>
            <CustomButton1 onClick={() => handleButtonClick("assignments")} isActive={activeButton === 'assignments'}>Grades</CustomButton1>
            <CustomButton1 onClick={() => handleButtonClick("course-inbox")} isActive={activeButton === 'course-inbox'}>Messages</CustomButton1>
            <CustomButton1 onClick={() => handleButtonClick("info")} isActive={activeButton === 'info'}>Course Info</CustomButton1>

        </div >
    )
}

export default SideBar
