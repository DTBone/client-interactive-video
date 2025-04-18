/* eslint-disable react/prop-types */
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomMenuItemButton from "../Button/CustomMenuItemButton";
import IconComponent from "~/Components/Common/Button/IconComponent";
import { useLocation } from "react-router-dom";

const MenuList = ({ module, onQuizSubmit }) => {
    const { itemId } = useParams();
    const location = useLocation();
    console.log('location', location)
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(itemId);
    const [showDialog, setShowDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState(module?.moduleItems?.find(item => item.quiz === itemId) || null);
    const [itemSelected, setItemSelected] = useState(null);
    console.log('module', module)

    useEffect(() => {
        if (currentItem?.type === "quiz" && currentItem?.status === "completed") {
            // Update the completion status in the menu
            const updatedModuleItems = module?.moduleItems?.map(item => {
                if (item.quiz === currentItem.quiz) {
                    return { ...item, status: "completed" };
                }
                return item;
            })
        }
    }, [currentItem, module?.moduleItems, module, itemId]);

    const navigateToItem = (item) => {
        if (item) {
            let navigationpath = `/learns/lessons/${item.type}/${item._id}`;
            navigate(navigationpath, { state: { module, item } });
        }

    }

    const handleConfirmNavigation = () => {
        setShowDialog(false);
        setCurrentItem(itemSelected);
        setActiveButton(itemSelected.quiz || itemSelected.programming || itemSelected.reading || itemSelected.video);
        navigateToItem(itemSelected);
    }

    const handleModuleItemClick = (item) => {
        console.log('Click module item')
        if (item) {
            let navigationpath = `/learns/lessons/${item.type}/${item._id}`;
            navigate(navigationpath, { state: { module, item } });
        }

    };

    return (
        <div className="flex flex-col items-start ml-4 pr-2">
            <Typography sx={{ fontWeight: "bold", fontSize: "medium", paddingLeft: "32px" }}>
                {`${module?.title} (${module?.completionPercentage || '0'}%)`}
            </Typography>
            {module?.moduleItems?.map((item, index) => (
                <CustomMenuItemButton
                    key={index}
                    fullWidth
                    onClick={() => {
                        setItemSelected(item);
                        handleModuleItemClick(item);
                        setActiveButton(item._id)
                    }}
                    isActive={activeButton === item._id}
                    isCompleted={item.status === "completed"}
                    icon={<IconComponent icon={item.icon} />}
                >
                    <Typography fontWeight="bold" fontSize='12px' sx={{ display: 'inline', textTransform: 'capitalize' }}>
                        {item.contentType}
                    </Typography>
                    <Typography fontSize='12px' sx={{ display: 'inline', textTransform: 'capitalize', marginLeft: '8px' }}>
                        {item.title}
                    </Typography>
                    <Typography fontSize='10px' sx={{ textTransform: 'lowercase' }} color='#5b6790'>
                        {item.note}
                    </Typography>
                </CustomMenuItemButton>
            ))}

            <Dialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                aria-labelledby="leave-quiz-dialog-title"
            >
                <DialogTitle id="leave-quiz-dialog-title">
                    Leave Quiz?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You haven't completed the quiz yet. All your answers will be lost if you leave.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDialog(false)} color="primary">
                        Stay
                    </Button>
                    <Button onClick={handleConfirmNavigation} color="error">
                        Leave
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MenuList