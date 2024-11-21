import React, { useState } from 'react';
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,

    Switch,
    FormControlLabel,

} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '~/hooks/useNotification';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createModuleItemProgramming } from '~/store/slices/ModuleItem/action';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';

const programProblemSchema = Yup.object().shape({
    problemName: Yup.string()
        .required('Problem name is required')
        .max(100, 'Problem name cannot be more than 100 characters')
        .trim(),
    content: Yup.string()
        .required('Problem content is required')
        .max(5000, 'Problem content cannot be more than 5000 characters'),
    difficulty: Yup.string()
        .required('Difficulty is required')
        .oneOf(['Easy', 'Medium', 'Hard'], 'Difficulty must be one of: Easy, Medium, Hard'),
    tags: Yup.array()
        .of(Yup.string().trim())
        .max(10, 'Maximum of 10 tags allowed'),
    constraints: Yup.string()
        .required('Constraints are required'),
    inputFormat: Yup.string()
        .required('Input format is required'),
    outputFormat: Yup.string()
        .required('Output format is required'),
    sampleInput: Yup.string()
        .required('Sample input is required'),
    sampleOutput: Yup.string()
        .required('Sample output is required'),
    explanation: Yup.string(),

    editorial: Yup.string(),
    baseScore: Yup.number()

        .min(0, 'Base score must be at least 0'),
    timeBonus: Yup.number()
        .min(0, 'Time bonus must be at least 0'),
    memoryBonus: Yup.number()
        .min(0, 'Memory bonus must be at least 0'),
    testcases: Yup.array().of(
        Yup.object().shape({
            input: Yup.string()
                .required('Input is required'),
            expectedOutput: Yup.string()
                .required('Expected output is required'),
            executeTimeLimit: Yup.number()
                .required('Time limit is required')
                .min(100, 'Time limit must be at least 100ms')
                .max(15000, 'Time limit cannot exceed 15000ms'),
            weight: Yup.number()
                .required('Weight is required')
                .min(0, 'Weight must be at least 0')
                .max(100, 'Weight cannot exceed 100'),
            isHidden: Yup.boolean()
        })
    )
        .min(1, 'At least one testcase is required')
    // .test('total-weight', 'Total weight of all testcases must equal 100', function (testcases) {
    //     if (!testcases) return false;
    //     const totalWeight = testcases.reduce((sum, testcase) => sum + Number(testcase.weight), 0);
    //     return totalWeight === 100;
    // }),
});

const Programming = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showNotice } = useNotification();
    const { courseId, moduleId } = useParams();
    const [problemData, setProblemData] = useState({
        title: '',
        description: '',
        type: 'programming',
        contentType: 'Programming Assignment',
        icon: 'code',
        isGrade: false,
        problemName: '',
        content: '',
        difficulty: 'Easy',
        tags: [],
        constraints: '',
        inputFormat: '',
        outputFormat: '',
        sampleInput: '',
        sampleOutput: '',
        explanation: '',
        editorial: '',
        baseScore: 100,
        timeBonus: 0,
        memoryBonus: 0,
        testcases: [{
            input: '',
            expectedOutput: '',
            executeTimeLimit: 1000,
            isHidden: false,
            weight: 1
        }]
    });

    const [newTag, setNewTag] = useState('');

    // Handle basic problem info changes
    const handleProblemChange = (field) => (event) => {
        const updatedProblemData = {
            ...problemData,
            [field]: event.target.value
        };
        setProblemData(updatedProblemData);

    };

    // Handle tags
    const handleAddTag = () => {
        if (newTag && !problemData.tags.includes(newTag)) {
            const updatedTags = [...problemData.tags, newTag];
            setProblemData({
                ...problemData,
                tags: updatedTags
            });
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = problemData.tags.filter(tag => tag !== tagToRemove);
        setProblemData({
            ...problemData,
            tags: updatedTags
        });
    };

    // Handle testcases
    const addTestcase = () => {
        setProblemData({
            ...problemData,
            testcases: [
                ...problemData.testcases,
                {
                    input: '',
                    expectedOutput: '',
                    executeTimeLimit: 1000,
                    isHidden: false,
                    weight: 1
                }
            ]
        });
    };

    const removeTestcase = (index) => {
        const updatedTestcases = problemData.testcases.filter((_, i) => i !== index);
        setProblemData({
            ...problemData,
            testcases: updatedTestcases
        });
    };

    const handleTestcaseChange = (index, field) => (event) => {
        const value = field === 'isHidden' ? event.target.checked : event.target.value;
        const updatedTestcases = problemData.testcases.map((testcase, i) => {
            if (i === index) {
                return { ...testcase, [field]: value };
            }
            return testcase;
        });

        setProblemData({
            ...problemData,
            testcases: updatedTestcases
        });
    };

    const handleGradeChange = (event) => {
        setProblemData({ ...problemData, isGrade: event.target.checked });
    };
    const handleSubmit = async () => {

        try {
            // Validate the problemData object
            await programProblemSchema.validate(problemData, { abortEarly: false });
            dispatch(createModuleItemProgramming({ courseId, moduleId, formData: problemData }));
            // Submit programming problem
            dispatch(toggleRefresh());
            showNotice('success', 'Successfully created programming problem');
            navigate(`/course-management/${courseId}/module/${moduleId}`);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                // Display validation errors
                error.inner.forEach((validationError) => {
                    showNotice('error', validationError.message);
                });
                console.error('Validation errors:', error.errors);
            } else {
                console.error('Error submitting programming problem:', error);
            }
        }
    }
    return (
        <div className="space-y-6">
            {/* Basic Problem Information */}
            <Card className="p-4" >
                <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: '2rem' }}>Module Item</Typography>

                    <div className="space-y-4">
                        <TextField
                            fullWidth
                            label="Title"
                            value={problemData.title}
                            onChange={handleProblemChange('title')}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            value={problemData.description}
                            onChange={handleProblemChange('description')}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card className="p-4">
                <CardContent>
                    <div className='flex justify-between'>
                        <Typography variant="h6" sx={{ marginBottom: '2rem' }}>Problem Information</Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={problemData.isGrade}
                                    onChange={handleGradeChange}
                                />
                            }
                            label="Grade"
                        />
                    </div>

                    <div className="space-y-4">

                        <TextField
                            fullWidth
                            label="Problem Name"
                            value={problemData.problemName}
                            onChange={handleProblemChange('problemName')}
                            helperText="Unique identifier for the problem"
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Content"
                            value={problemData.content}
                            onChange={handleProblemChange('content')}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Difficulty</InputLabel>
                            <Select
                                value={problemData.difficulty}
                                label="Difficulty"
                                onChange={handleProblemChange('difficulty')}
                            >
                                <MenuItem value="Easy">Easy</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Hard">Hard</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Tags */}
                        <div>
                            <div className="flex gap-2 mb-2">
                                <TextField
                                    label="Add Tag"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    size="small"
                                />
                                <Button
                                    onClick={handleAddTag}
                                    variant="outlined"
                                    size="small"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {problemData.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Problem Details */}
            <Card className="p-4">
                <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: '2rem' }}>Problem Details</Typography>
                    <div className="space-y-4">

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Constraints"
                            value={problemData.constraints}
                            onChange={handleProblemChange('constraints')}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Input Format"
                            value={problemData.inputFormat}
                            onChange={handleProblemChange('inputFormat')}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Output Format"
                            value={problemData.outputFormat}
                            onChange={handleProblemChange('outputFormat')}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Sample Input"
                                value={problemData.sampleInput}
                                onChange={handleProblemChange('sampleInput')}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Sample Output"
                                value={problemData.sampleOutput}
                                onChange={handleProblemChange('sampleOutput')}
                            />
                        </div>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Explanation"
                            value={problemData.explanation}
                            onChange={handleProblemChange('explanation')}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Editorial"
                            value={problemData.editorial}
                            onChange={handleProblemChange('editorial')}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Scoring */}
            <Card className="p-4">
                <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: '2rem' }} >Scoring Configuration</Typography>
                    <div className="grid grid-cols-3 gap-4">

                        <TextField
                            type="number"
                            label="Base Score"
                            value={problemData.baseScore}
                            onChange={handleProblemChange('baseScore')}
                        />
                        <TextField
                            type="number"
                            label="Time Bonus"
                            value={problemData.timeBonus}
                            onChange={handleProblemChange('timeBonus')}
                        />
                        <TextField
                            type="number"
                            label="Memory Bonus"
                            value={problemData.memoryBonus}
                            onChange={handleProblemChange('memoryBonus')}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Testcases */}
            <Card className="p-4">
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6">Testcases</Typography>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addTestcase}
                            variant="outlined"
                        >
                            Add Testcase
                        </Button>
                    </div>

                    {problemData.testcases.map((testcase, index) => (
                        <div key={index} className="mb-6 p-4 border rounded">
                            <div className="flex justify-between items-center mb-4">
                                <Typography variant="subtitle1">Testcase {index + 1}</Typography>
                                <IconButton
                                    onClick={() => removeTestcase(index)}
                                    disabled={problemData.testcases.length === 1}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Input"
                                        value={testcase.input}
                                        onChange={handleTestcaseChange(index, 'input')}
                                    />
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Expected Output"
                                        value={testcase.expectedOutput}
                                        onChange={handleTestcaseChange(index, 'expectedOutput')}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <TextField
                                        type="number"
                                        label="Time Limit (ms)"
                                        value={testcase.executeTimeLimit}
                                        onChange={handleTestcaseChange(index, 'executeTimeLimit')}
                                    />
                                    <TextField
                                        type="number"
                                        label="Weight"
                                        value={testcase.weight}
                                        onChange={handleTestcaseChange(index, 'weight')}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={testcase.isHidden}
                                                onChange={handleTestcaseChange(index, 'isHidden')}
                                            />
                                        }
                                        label="Hidden Testcase"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Create Programming Problem
                </Button>
            </div>
        </div>
    );
};

export default Programming;