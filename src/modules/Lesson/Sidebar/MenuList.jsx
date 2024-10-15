import { Button, Typography } from "@mui/material"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomMenuItemButton from "../Button/CustomMenuItemButton";
import IconComponent from "~/Components/Common/Button/IconComponent";

const MenuList = ({ module }) => {
    const navigate = useNavigate();

    const [activeButton, setActiveButton] = useState(null);

    const handleModuleItemClick = (buttoName, buttonNavigation, buttonID, module) => {
        setActiveButton(`${buttonID.toLowerCase().trim()}`);
        navigate(`${buttonNavigation.trim().toLowerCase().replace(/\s+/g, '-')}` + "/" + `${buttoName.trim().toLowerCase().replace(/\s+/g, '-')}`, { state: { module } });


    };
    return (
        <div className="flex flex-col  items-start ml-4  pr-2">
            <Typography sx={{ fontWeight: "bold", fontSize: "medium", paddingLeft: "32px" }} >{module.title}</Typography>
            {module.moduleItem.map((item, index) => (
                <CustomMenuItemButton
                    key={index}
                    fullWidth
                    onClick={() => handleModuleItemClick(item.title, item.type, item.id, item)}
                    isActive={activeButton === item.id}
                    icon={<IconComponent icon={item.icon} />}
                //sx={{ display: 'flex', alignItems: 'flex-start' }}
                >
                    <Typography fontWeight="bold" fontSize='12px' sx={{ display: 'inline', textTransform: 'capitalize' }}> {item.contentType}</Typography>
                    <Typography fontSize='12px' sx={{ display: 'inline', textTransform: 'capitalize', marginLeft: '8px' }}>{item.title}</Typography>
                    <Typography fontSize='10px' sx={{ textTransform: 'lowercase', }} color='#5b6790'> {item.note}</Typography>

                </CustomMenuItemButton>
            ))}
        </div>
    )
}

export default MenuList
