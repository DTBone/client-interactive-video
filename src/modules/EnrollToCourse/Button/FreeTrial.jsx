import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    IconButton
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


const FreeTrial = ({ onClose, onSubmit }) => {



    const features = [
        {
            title: 'Unlimited access to all courses in the Specialization',
            description: 'Watch lectures, try assignments, participate in discussion forums, and more.'
        },
        {
            title: 'Cancel anytime.',
            description: 'No penalties - simply cancel before the trial ends if its not right for you.'
        },
        {
            title: '$49 USD per month to continue learning after your trial ends',
            description: 'Go as fast as you can - the faster you go, the more you save.'
        },
        {
            title: 'Certificate when you complete after your trial ends',
            description: 'Share on your resume, LinkedIn, and CV.'
        }
    ];

    return (
        <Paper elevation={3} sx={{ maxWidth: 800, m: 'auto', p: 3, position: 'relative' }}>
            <IconButton sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon onClick={onClose} />
            </IconButton>
            <Typography variant="h5" gutterBottom>
                7-day Free Trial
            </Typography>
            <List>
                {features.map((feature, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        <ListItemIcon>
                            <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography variant="subtitle1" color="text.primary">{feature.title}</Typography>}
                            secondary={feature.description}
                        />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" fullWidth onClick={onSubmit}>
                    Start Free Trial
                </Button>


            </Box>
        </Paper>
    );
};

export default FreeTrial;