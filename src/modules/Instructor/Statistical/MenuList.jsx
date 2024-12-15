import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, ListItemIcon, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, Message } from "@mui/icons-material"; // Import các icon từ MUI
import SettingsIcon from '@mui/icons-material/Settings';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import LogoutIcon from '@mui/icons-material/Logout';
import Person3Icon from '@mui/icons-material/Person3';
import GroupsIcon from '@mui/icons-material/Groups';
import { useSelector } from "react-redux";

const StyledList = styled(List)(({ theme }) => ({
    // width: "250px", // Tăng chiều rộng
    padding: theme.spacing(2), // Thêm padding
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius, // Bo góc
    //boxShadow: theme.shadows[2], // Shadow nhẹ
    transition: "all 0.3s ease",
}));

const StyledListItem = styled(ListItem)(({ theme, isActive, isHovered }) => ({
    cursor: "pointer",
    borderRadius: theme.shape.borderRadius, // Bo góc cho từng item
    padding: theme.spacing(1.5), // Thêm padding
    backgroundColor: isActive
        ? theme.palette.primary.main
        : isHovered
            ? theme.palette.action.hover
            : "transparent",
    color: isActive
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
    boxShadow: isActive ? theme.shadows[3] : "none", // Shadow khi active
    transform: isHovered || isActive ? "scale(1.02)" : "scale(1)", // Hiệu ứng phóng to nhẹ
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
    },
    transition: "all 0.3s ease", // Hiệu ứng mượt mà
}));

const MenuList = () => {
    const [hoveredButton, setHoveredButton] = useState(null);
    const navigate = useNavigate();
    const course = useSelector((state) => state.course.courses);
    console.log("course", course);
    const menuItems = course.map(courseItem => ({
        id: courseItem._id,
        label: courseItem.title,
        path: `course/${courseItem._id}`
    }));
    const [activeButton, setActiveButton] = useState(menuItems[0]?.id);
    useEffect(() => {
        if (menuItems.length > 0) {
            const firstItem = menuItems[0];
            handleItemClick(firstItem);
        }
    }, [course])
    const handleItemClick = (item) => {
        setActiveButton(item.id);
        navigate(item.path);
    };

    return (
        <StyledList>
            {menuItems.map((item) => (
                <StyledListItem
                    key={item.id}
                    isActive={activeButton === item.id}
                    isHovered={hoveredButton === item.id}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredButton(item.id)}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    <ListItemIcon
                        sx={{
                            color: activeButton === item.id ? "inherit" : "text.primary",
                            minWidth: "40px", // Đảm bảo khoảng cách giữa icon và text
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                </StyledListItem>
            ))}
        </StyledList>
    );
};

export default MenuList;
