/* eslint-disable react/prop-types */
import Accordion from '@mui/material/Accordion';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import IconComponent from '~/Components/Common/Button/IconComponent';
import CustomMenuItemButton from '~/modules/Lesson/Button/CustomMenuItemButton';
import { useState } from 'react';

const Modules = ({course}) => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const allModules = course.modules
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
    return (
        <div>
            {allModules && allModules?.map((module, index) => (
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
                            {module.moduleItems && module.moduleItems.map((item, idx) => (
                                <CustomMenuItemButton
                                    key={idx}
                                    fullWidth
                                    icon={<IconComponent icon={item.icon} />}
                                >

                                    <Typography fontWeight="bold" fontSize='12px' sx={{ display: 'inline', textTransform: 'capitalize' }}> {item.contentType}</Typography>
                                    <Typography fontSize='12px' sx={{ display: 'inline', textTransform: 'capitalize', marginLeft: '8px' }}>{item.title}</Typography>
                                    <Typography fontSize='10px' sx={{ textTransform: 'lowercase', }} color='#5b6790'> {item.note}</Typography>


                                </CustomMenuItemButton>
                            ))}
                            
                        </CustomAccordionDetails>
                    </CustomAccordion>
                </div>
            ))}
        </div>
    )
}

export default Modules
