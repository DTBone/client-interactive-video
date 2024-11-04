import React from 'react';
import {
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';

const Supplement = ({ moduleItemData, onUpdateData, handleSubmit }) => {
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
    const handleFileChange = (file) => {
        if (file) {
            const fileData = new FormData();
            fileData.append('file', file);
            console.log('file selected: ', file)
            onUpdateData({
                ...moduleItemData,
                references: {
                    ...moduleItemData.references,
                    fileName: file.name,
                    size: file.size,
                    file: fileData
                }
            });
        }
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
                    multiline
                    rows={3}
                    label="Description"
                    value={moduleItemData.description}
                    onChange={handleInputChange('description')}
                />
            </div>
            <div >
                <TextField
                    fullWidth
                    label="Reference Title"
                    value={moduleItemData.references.title}
                    onChange={handleReferenceChange('title')}
                />
            </div>

            <div className="w-full">
                <FileUpload onFileChange={handleFileChange} />
            </div>



            <div className="flex justify-end gap-2">
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Create Module Item
                </Button>

            </div>
        </Paper>
    );
};

export default Supplement;