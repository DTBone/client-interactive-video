import { Button, Typography } from "@mui/material"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomMenuItemButton from "../Button/CustomMenuItemButton";
import IconComponent from "~/Components/Common/Button/IconComponent";

const MenuList = ({ module }) => {
    const navigate = useNavigate();

    const [activeButton, setActiveButton] = useState(null);

    const handleModuleItemClick = (buttoName, buttonNavigation, buttonID, module) => {
        setActiveButton(`${buttonID.toLowerCase()}`);
        navigate(`${buttonNavigation.toLowerCase().replace(/\s+/g, '-')}` + "/" + `${buttoName.toLowerCase().replace(/\s+/g, '-')}`, { state: { module } });


    };
    return (
        <div className="flex flex-col  items-start ml-6 text-wrap pr-2">
            <Typography sx={{ fontWeight: "bold", fontSize: "medium", paddingLeft: "32px" }} >{module.title}</Typography>
            {module.moduleItem.map((item, index) => (
                <CustomMenuItemButton
                    key={index}
                    fullWidth
                    onClick={() => handleModuleItemClick(item.name, item.navigation, item.id, item)}
                    isActive={activeButton === item.id}
                    sx={{

                    }}
                >
                    <IconComponent icon={item.icon} />
                    {item.name}
                </CustomMenuItemButton>
            ))}
        </div>
    )
}

export default MenuList
