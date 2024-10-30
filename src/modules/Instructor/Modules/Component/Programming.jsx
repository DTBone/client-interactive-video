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
    Box,
    Switch,
    FormControlLabel,
    Divider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const Programming = ({ moduleItemData, onUpdateData, handleSubmit }) => {
    const [problemData, setProblemData] = useState({
        problemId: '',
        title: '',
        description: '',
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
        onUpdateData({ programming: updatedProblemData });
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

    return (
        <div className="space-y-6">
            {/* Basic Problem Information */}
            <Card className="p-4">
                <CardContent>
                    <Typography variant="h6" className="mb-4">Problem Information</Typography>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                fullWidth
                                label="Problem ID"
                                value={problemData.problemId}
                                onChange={handleProblemChange('problemId')}
                                helperText="Unique identifier for the problem"
                            />
                            <TextField
                                fullWidth
                                label="Title"
                                value={problemData.title}
                                onChange={handleProblemChange('title')}
                            />
                        </div>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            value={problemData.description}
                            onChange={handleProblemChange('description')}
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
                    <Typography variant="h6" className="mb-4">Problem Details</Typography>
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
                    <Typography variant="h6" className="mb-4">Scoring Configuration</Typography>
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
                    Save Programming Problem
                </Button>
            </div>
        </div>
    );
};

export default Programming;