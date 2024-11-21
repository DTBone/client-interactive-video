import Accordion from '@mui/material/Accordion';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';



import { Circle } from '@mui/icons-material';
import {useEffect, useState} from 'react';

import {useNavigate, useParams} from 'react-router-dom';
import { Typography } from '@mui/material';
import {useSelector, useDispatch} from "react-redux";
import {getAllModules} from "~/store/slices/Module/action.js";


const SideBar = () => {
    // const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (buttonId) => {
        setActiveButton(`${buttonId.toLowerCase()}`);
        navigate(`${buttonId.toLowerCase().replace(/\s+/g, '/')}`);


    };
    const handleModuleItemClick = (buttonId, module) => {
        setActiveButton(`${buttonId.toLowerCase()}`);
        console.log(`${buttonId.toLowerCase().replace(/\s+/g, '/')}`)
        navigate(`module/${buttonId.toLowerCase().replace(/\s+/g, '/')}`, { state: { module } });
        
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

    const [modules, setModules] = useState(useSelector(state => state.module.modules) || []);
    const { courseId, moduleId } = useParams();
    console.log(courseId)
    useEffect(() => {
        const fetchData = async () => {
            try{
                const result =await dispatch(getAllModules(courseId))
                if(getAllModules.fulfilled.match(result)){
                console.log(result.payload)
                    setModules(result.payload)
                }
            }
            catch (e)
            {
                console.log(e)
            }
        }
        if(courseId){
            fetchData()
        }
    }, [courseId]);
    return (
        <div className="">
            <div className="w-full bg-transparent h-full flex justify-start items-center py-8 ">
                <Typography variant='h4' fontSize="bold" sx={{ textTransform: "none" }}>Course Name</Typography>

            </div>
            <CustomAccordion expanded={expanded === 'panel'} onChange={handleChange('panel')}>
                <CustomAccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ width: '24px', height: '24px', color: 'black' }} />}
                    // expandIcon={<ExpandMoreIcon />}
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
                            onClick={() => handleModuleItemClick(item._id, item)}
                            isActive={activeButton === item._id} >
                            <Circle sx={{ color: '#c1cad9' }} />
                            {`Module ${index + 1}`}

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
