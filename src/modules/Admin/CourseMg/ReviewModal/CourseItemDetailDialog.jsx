import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Divider, Box } from '@mui/material';

const CourseItemDetailDialog = ({ open, onClose, item }) => {
    if (!item) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {item.title}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">Type:</Typography>
                    <Typography variant="body1" gutterBottom>{item.type}</Typography>
                </Box>
                {item.description && (
                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">Description:</Typography>
                        <Typography variant="body2">{item.description}</Typography>
                    </Box>
                )}
                {item.duration && (
                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">Duration:</Typography>
                        <Typography variant="body2">{item.duration} min</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

CourseItemDetailDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    item: PropTypes.object
};

export default CourseItemDetailDialog; 