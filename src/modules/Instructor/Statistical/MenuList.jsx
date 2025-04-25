import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, ListItemIcon, styled } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import { useSelector } from "react-redux";

const StyledList = styled(List)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    minWidth: 220,
    transition: "all 0.3s ease",
}));

const StyledListItem = styled(ListItem)(({ theme, isactive, ishovered }) => ({
    cursor: "pointer",
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    backgroundColor: isactive === 'true'
        ? theme.palette.primary.main
        : ishovered === 'true'
            ? theme.palette.action.hover
            : "transparent",
    color: isactive === 'true'
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
    boxShadow: isactive === 'true' ? theme.shadows[3] : "none",
    transform: ishovered === 'true' || isactive === 'true' ? "scale(1.02)" : "scale(1)",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
    },
    transition: "all 0.3s ease",
}));

const MenuList = () => {
    const [hoveredButton, setHoveredButton] = useState(null);
    const navigate = useNavigate();
    const { courseId } = useParams();
    const courses = useSelector((state) => state.course.courses);
    const menuItems = courses.map(courseItem => ({
        id: courseItem._id,
        label: courseItem.title,
        path: `/instructor/student-management/course/${courseItem._id}`,
        icon: <FolderSharedIcon />
    }));

    const handleItemClick = (item) => {
        navigate(item.path);
    };

    return (
        <StyledList>
            {menuItems.map((item) => (
                <StyledListItem
                    key={item.id}
                    isactive={(courseId === item.id).toString()}
                    ishovered={(hoveredButton === item.id).toString()}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredButton(item.id)}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    <ListItemIcon
                        sx={{
                            color: courseId === item.id ? "inherit" : "text.primary",
                            minWidth: "40px",
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
