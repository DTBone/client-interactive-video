import React from 'react';
import {
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Lecture = ({ moduleItemData, onUpdateData, handleSubmit }) => {
    const navigate = useNavigate();
    const handleInputChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        onUpdateData({ [field]: value });
    };

    const handleReferenceChange = (field) => (event) => {
        onUpdateData({
            references: {
                ...moduleItemData.references,
                [field]: event.target.value
            }
        });
    };

    return (
        <Paper elevation={0} className="space-y-4">
            <TextField
                fullWidth
                label="Title"
                value={moduleItemData.title}
                onChange={handleInputChange('title')}
            />
            <div>
                <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={moduleItemData.description}
                    onChange={handleInputChange('description')}
                />
            </div>
            <div>
                <TextField
                    fullWidth
                    label="Reference Title"
                    value={moduleItemData.references.title}
                    onChange={handleReferenceChange('title')}
                />
            </div>

            <div>
                <TextField
                    fullWidth
                    label="Reference Link"
                    value={moduleItemData.references.link}
                    onChange={handleReferenceChange('link')}
                />
            </div>



            <div className="flex gap-2">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
            </div>
        </Paper>
    );
};

export default Lecture;