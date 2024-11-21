import {LinearProgress, Typography} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Select as MuiSelect, MenuItem, FormControl, InputLabel } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux'
import SelectContentType from '../Component/SelectContentType';
import Supplement from '../Component/Supplement';
import Lecture from '../Component/Lecture';
import Quiz from '../Component/Quiz';
import Programming from '../Component/Programming';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '~/Hooks/useNotification';
import { ShowChart } from '@mui/icons-material';
import { getAllModules } from '~/store/slices/Module/action';
import {createLecture} from "~/store/slices/ModuleItem/action.js";
import {ChunkUploader} from "~/services/fileUpload/chunkUploadToMiniO.js";

const NewModuleItem = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [contentType, setContentType] = useState('');
    const { showNotice } = useNotification();
    useEffect(() => { }, [contentType])
    const { courseId, moduleId } = useParams();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleChange = (event) => {
        setContentType(event.target.value);
    };
    const { modules, loading, error } = useSelector((state) => state.module);
    const [module, setModule] = useState(null);
    useEffect(() => {
        dispatch(getAllModules(courseId));

    }, [courseId, moduleId])

    useEffect(() => {
        const foundModule = modules.find(module => module.index === moduleId);
        setModule(foundModule);
        console.log("Module ", foundModule);
    }, [modules, moduleId])

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
            file: '',
            size: '',
            fileName: ''
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

            // Add API call to create new module item
            // await dispatch(createModuleItem(moduleItemData));
            switch (moduleItemData.contentType) {
                case 'Reading':
                    //await dispatch(createSupplement(moduleItemData));
                    console.log("module item data reading: ", moduleItemData)
                    break;
                case 'Video':
                    { console.log("module item data video: ", moduleItemData.references.file.get('file'))
                        setUploading(true);
                        const uploader = new ChunkUploader(
                            {
                                moduleId: '67387230192f25da8f49c968',
                                title: moduleItemData.title,
                                description: moduleItemData.description,
                            },
                            moduleItemData.references.file.get('file'),
                            {
                                onProgress: (progress) => {
                                    setUploadProgress(progress);
                                },
                                onComplete: () => {
                                    setUploading(false);
                                    setUploadProgress(0);
                                },
                                onError: (error) => {
                                    setUploading(false);
                                    setUploadProgress(0);
                                    showNotice("error", 'Error uploading video');
                                    console.error('Error uploading video:', error);
                                }
                            }
                        );
                        await uploader.start();
                    break; }
                case 'Practice Quiz':
                    //await dispatch(createQuiz(moduleItemData));
                    console.log("module item data quiz: ", moduleItemData)
                    break;
                case 'Programming Assignment':
                    //await dispatch(createProgramming(moduleItemData));
                    console.log("module item data programming: ", moduleItemData)
                    break;
                default:
                    break;
            }
            showNotice("success", 'Module item created successfully');
            //navigate(-1);
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
            {module ? (
                <>
                    {/* Display the module title with Tailwind CSS */}
                    <div className="text-xl font-semibold text-gray-800">
                        Module {module.index}: {module.title}
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                        Create New Module Item
                    </div>
                </>
            ) : (
                <div className="text-lg font-medium text-red-500">
                    Module not found
                </div>
            )}

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
                {uploading && (
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{ height: '0.5rem' }}
                    />
                )}
            </div>
        </div>
    )
}

export default NewModuleItem
