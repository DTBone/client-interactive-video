import Accordion from '@mui/material/Accordion';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';


import { Circle } from '@mui/icons-material';
import { useState } from 'react';



const SideBar = ({ onSelectContent }) => {

    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId);
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
        fontSize: "20px",
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
        textTransform: "none",
        color: "#000000",
        fontSize: "20px",

        background: isActive ? "#f2f5fa" : "transparent",
        borderLeftColor: isActive ? "#0056d2" : "transparent",
        borderLeftWidth: isActive ? "4px" : "0",
        borderRadius: isActive ? "4px" : "0 4px 4px 0",
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
        '&:active': {
            background: "#f2f5fa",
            borderLeftColor: "#0056d2",
            borderLeftWidth: "4px",
            borderRadius: "0 4px 4px 0",
            borderLeftStyle: 'solid',
        }

    }));




    const CustomButton = styled(Button)(({ theme, isActive }) => ({
        justifyContent: 'flex-start',
        paddingLeft: theme.spacing(4),
        width: '100%',
        height: '64px',
        background: "transparent",

        borderRadius: "0 4px 4px 0",
        //fontWeight: 'bold',
        textTransform: "none",
        color: "#000000",
        fontSize: "20px",
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
            textDecoration: 'underline',


        },
        '&:active': {
            background: "#f2f5fa",
            borderLeftColor: "#0056d2",
            borderLeftWidth: "4px",
            borderRadius: "0 4px 4px 0",
            borderLeftStyle: 'solid',
            textDecoration: 'underline',
        },

        display: 'flex',
        alignItems: 'center',
        gap: "8px",

    }));
    const buttonItem = [
        'module 1',
        'module 2',
        'module 3',
        'module 4',
        'module 5',
    ]

    return (
        <div>
            <CustomAccordion>
                <CustomAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    Course Material
                </CustomAccordionSummary>
                <CustomAccordionDetails>
                    {buttonItem.map((item, index) => (
                        <CustomButton key={index} fullWidth onClick={() => { onSelectContent(item); handleButtonClick(item) }} isActive={activeButton === item} > <Circle sx={{ color: '#c1cad9' }} />
                            {item}
                        </CustomButton>
                    ))}
                </CustomAccordionDetails>
            </CustomAccordion>
            <CustomButton1 onClick={() => { onSelectContent("Grades"); handleButtonClick("Grades") }} isActive={activeButton === 'Grades'}>Grades</CustomButton1>
            <CustomButton1 onClick={() => { onSelectContent("Messages"); handleButtonClick("Messages") }} isActive={activeButton === 'Messages'}>Messages</CustomButton1>
            <CustomButton1 onClick={() => { onSelectContent("CourseInfo"); handleButtonClick("CourseInfo") }} isActive={activeButton === 'CourseInfo'}>Course Info</CustomButton1>
        </div >
    )
}

export default SideBar
