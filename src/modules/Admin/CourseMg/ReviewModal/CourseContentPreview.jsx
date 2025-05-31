import PropTypes from 'prop-types';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VideoLibrary from '@mui/icons-material/VideoLibrary';
import FactCheck from '@mui/icons-material/FactCheck';
import Description from '@mui/icons-material/Description';
import { School } from '@mui/icons-material';
import { useState } from 'react';
import CourseItemDetailDialog from './CourseItemDetailDialog';

const CourseContentPreview = ({ modules }) => {
    console.log('modules', modules);
    const [openDialog, setOpenDialog] = useState(false);
    const [itemSelected, setItemSelected] = useState(null);

    const handleOpenDialog = (item) => {
        setItemSelected(item);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setItemSelected(null);
    };

    return (
        <div style={{ minHeight: '300px' }}>
            <Typography variant="h6" gutterBottom>Course Content</Typography>
            {modules?.length > 0 ? (
                modules.map((module, index) => (
                    <Accordion key={module._id || index} defaultExpanded={index === 0} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight="bold">{index + 1}. {module.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                {module.moduleItems?.map((item, itemIndex) => (
                                    <ListItem button key={item._id || itemIndex}>
                                        <ListItemIcon sx={{ minWidth: '30px' }}>
                                            {item.type === 'lecture' ?
                                                <VideoLibrary fontSize="small" /> :
                                                item.type === 'quiz' ?
                                                    <FactCheck fontSize="small" /> :
                                                item.type === 'supplement' ?
                                                    <Description fontSize="small" /> :
                                                    <School fontSize="small" />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${itemIndex + 1}. ${item.title}`}
                                            secondary={item.type}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Alert severity="info">
                    No content available for preview.
                </Alert>
            )}
            <CourseItemDetailDialog open={openDialog} onClose={handleCloseDialog} item={itemSelected} />
        </div>
    );
};

CourseContentPreview.propTypes = {
    modules: PropTypes.array
};

export default CourseContentPreview; 