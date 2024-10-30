import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Select as MuiSelect, MenuItem, FormControl, InputLabel } from '@mui/material';

import { useDispatch } from 'react-redux'
import SelectContentType from '../Component/SelectContentType';
import Supplement from '../Component/Supplement';
import Lecture from '../Component/Lecture';
import Quiz from '../Component/Quiz';
import Programming from '../Component/Programming';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '~/Hooks/useNotification';
import { ShowChart } from '@mui/icons-material';

const NewModuleItem = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [contentType, setContentType] = useState('');
    const { showNotice } = useNotification();
    useEffect(() => { }, [contentType])
    const { courseId, moduleId } = useParams();

    const handleChange = (event) => {
        setContentType(event.target.value);
    };


    const [moduleItemData, setModuleItemData] = useState({
        moduleId: moduleId,
        title: '',
        description: '',
        type: '',
        contentType: '',
        icon: '',
        isGrade: false,
        references: {
            title: '',
            link: ''
        }
    });

    const contentTypeMapping = {
        'Reading': {
            type: 'supplement',
            icon: 'read'
        },
        'Video': {
            type: 'lecture',
            icon: 'video'
        },
        'Practice Quiz': {
            type: 'quiz',
            icon: 'quiz'
        },
        'Programming Assignment': {
            type: 'programming',
            icon: 'code'
        }
    };

    const handleContentTypeChange = (event) => {
        const selectedContentType = event.target.value;
        const mappedType = contentTypeMapping[selectedContentType];

        setModuleItemData(prev => ({
            ...prev,
            contentType: selectedContentType,
            type: mappedType.type,
            icon: mappedType.icon
        }));
    };
    const handleSubmit = async () => {
        try {
            // Validation
            if (!moduleItemData.title) {
                showNotice("error", 'Please enter a title');
                return;
            }
            if (!moduleItemData.contentType) {
                showNotice("error", 'Please select a content type');
                return;
            }
            console.log("module item data: ", moduleItemData)
            // Add API call to create new module item
            // await dispatch(createModuleItem(moduleItemData));
            showNotice("success", 'Module item created successfully');
            navigate(-1);
        } catch (error) {
            showNotice("error", 'Error creating module item');
            console.error('Error creating module item:', error);
        }
    };

    const renderContentComponent = () => {
        const commonProps = {
            moduleItemData: moduleItemData,
            onUpdateData: (data) => setModuleItemData(prev => ({ ...prev, ...data })),
            handleSubmit: handleSubmit
        };

        switch (moduleItemData.contentType) {
            case 'Reading':
                return <Supplement {...commonProps} />;
            case 'Video':
                return <Lecture {...commonProps} />;
            case 'Practice Quiz':
                return <Quiz {...commonProps} />;
            case 'Programming Assignment':
                return <Programming {...commonProps} />;
            default:
                return <Typography>Please choose content type</Typography>;
        }
    };

    return (
        <div className="p-6">
            <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                Create New Module Item
            </Typography>

            <div className='flex flex-col gap-4'>
                <FormControl sx={{ width: '30%' }}>
                    <InputLabel id="content-type-select-label">
                        Content Type
                    </InputLabel>
                    <MuiSelect
                        labelId="content-type-select-label"
                        id="content-type-select"
                        value={moduleItemData.contentType}
                        label="Content Type"
                        onChange={handleContentTypeChange}
                    >
                        <MenuItem value="Reading">Reading</MenuItem>
                        <MenuItem value="Video">Video</MenuItem>
                        <MenuItem value="Practice Quiz">Practice Quiz</MenuItem>
                        <MenuItem value="Programming Assignment">Programming Assignment</MenuItem>
                    </MuiSelect>
                </FormControl>

                {renderContentComponent()}
            </div>
        </div>
    )
}

export default NewModuleItem
