import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomMenuItemButton = styled(Button)(({ isActive }) => ({
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '32px',
    textTransform: "capitalize",
    color: "#000000",
    fontSize: "13px",
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
        //borderLeftColor: "#0056d2",

    },
    '&: hover:: before': {
        borderLeftColor: "#0056d2",
        borderLeftWidth: isActive ? "0" : "4px",
        //borderRadius: "0 4px 4px 0",
    }

}));


export default CustomMenuItemButton
