import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Typography,
    Switch,
    FormControlLabel,

} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNotification } from '~/hooks/useNotification';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleRefresh } from '~/store/slices/Module/moduleSlice';
import { createModuleItemQuiz } from '~/store/slices/ModuleItem/action';

const EditQuiz = ({ moduleItem }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showNotice } = useNotification();
    const { courseId, moduleId } = useParams();
    const [quizData, setQuizData] = useState({
        title: '',
        type: 'quiz',
        contentType: 'Practice Quiz',
        icon: 'quiz',
        description: '',
        duration: 1200, // 20 minutes in seconds
        passingScore: 70,
        isGrade: false,
        questions: [{
            orderNumber: 1,
            content: '',
            type: 'only-choice',
            points: 1,
            answers: [
                { content: '', isCorrect: true },
                { content: '', isCorrect: false }
            ],
            explanation: ''
        }]
    });
    useEffect(() => {
        if (moduleItem) {
            setQuizData(prev => ({
                ...prev,
                title: moduleItem.title,
                description: moduleItem.description,
                type: moduleItem.type,
                contentType: moduleItem.contentType,
                icon: moduleItem.icon,
                duration: moduleItem.quiz.duration,
                passingScore: moduleItem.quiz.passingScore,
                isGrade: moduleItem.isGrade,
                questions: moduleItem.quiz.questions

            }));
        }
    }, [moduleItem])
    // Handle basic quiz info changes
    const handleQuizChange = (field) => (event) => {
        const updatedQuizData = {
            ...quizData,
            [field]: event.target.value
        };
        setQuizData(updatedQuizData);

    };

    // Add new question
    const addQuestion = () => {
        const newQuestion = {
            orderNumber: quizData.questions.length + 1,
            content: '',
            type: 'only-choice',
            points: 1,
            answers: [
                { content: '', isCorrect: true },
                { content: '', isCorrect: false }
            ],
            explanation: ''
        };

        setQuizData({
            ...quizData,
            questions: [...quizData.questions, newQuestion]
        });
    };

    // Remove question
    const removeQuestion = (index) => {
        const updatedQuestions = quizData.questions.filter((_, i) => i !== index)
            .map((q, i) => ({ ...q, orderNumber: i + 1 }));

        setQuizData({
            ...quizData,
            questions: updatedQuestions
        });
    };

    // Handle question changes
    const handleQuestionChange = (questionIndex, field) => (event) => {
        const updatedQuestions = quizData.questions.map((question, index) => {
            if (index === questionIndex) {
                return { ...question, [field]: event.target.value };
            }
            return question;
        });

        setQuizData({
            ...quizData,
            questions: updatedQuestions
        });
    };

    // Add new answer to a question
    const addAnswer = (questionIndex) => {
        const updatedQuestions = quizData.questions.map((question, index) => {
            if (index === questionIndex) {
                return {
                    ...question,
                    answers: [...question.answers, { content: '', isCorrect: false }]
                };
            }
            return question;
        });

        setQuizData({
            ...quizData,
            questions: updatedQuestions
        });
    };

    // Remove answer from a question
    const removeAnswer = (questionIndex, answerIndex) => {
        const updatedQuestions = quizData.questions.map((question, index) => {
            if (index === questionIndex) {
                const updatedAnswers = question.answers.filter((_, i) => i !== answerIndex);
                return { ...question, answers: updatedAnswers };
            }
            return question;
        });

        setQuizData({
            ...quizData,
            questions: updatedQuestions
        });
    };

    // Handle answer changes
    const handleAnswerChange = (questionIndex, answerIndex, field) => (event) => {
        const updatedQuestions = quizData.questions.map((question, qIndex) => {
            if (qIndex === questionIndex) {
                const updatedAnswers = question.answers.map((answer, aIndex) => {
                    if (aIndex === answerIndex) {
                        const value = field === 'isCorrect' ? event.target.checked : event.target.value;
                        return { ...answer, [field]: value };
                    }
                    return answer;
                });
                return { ...question, answers: updatedAnswers };
            }
            return question;
        });

        setQuizData({
            ...quizData,
            questions: updatedQuestions
        });
    };
    const handleGradeChange = (event) => {
        setQuizData({ ...quizData, isGrade: event.target.checked });
    };
    const handleSubmit = async () => {
        try {
            if (!quizData.title) {
                showNotice('error', 'Please enter title');
                return;
            }
            if (!quizData.duration) {
                showNotice('error', 'Please enter duration');
                return;
            }
            if (!quizData.passingScore) {
                showNotice('error', 'Please enter passing score');
                return;
            }
            await dispatch(createModuleItemQuiz({ courseId, moduleId, quizData }));
            dispatch(toggleRefresh());
            showNotice('success', 'Successfully created quiz');
            navigate(`/course-management/${courseId}/module/${moduleId}`)
        }
        catch {
            showNotice('error', 'Error submitting form');
        }
    }

    return (
        <div className="space-y-6">
            {/* Quiz Basic Information */}
            <Card className="p-4">
                <CardContent>
                    <div className='flex justify-between'>
                        <Typography variant="h6" className="mb-4">Quiz Information</Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={quizData.isGrade}
                                    onChange={handleGradeChange}
                                />
                            }
                            label="Grade"
                        />
                    </div>
                    <div className="space-y-4">
                        <TextField
                            fullWidth
                            label="Quiz Title"
                            value={quizData.title}
                            onChange={handleQuizChange('title')}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Quiz Description"
                            value={quizData.description}
                            onChange={handleQuizChange('description')}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                type="number"
                                label="Duration (minutes)"
                                value={quizData.duration / 60}
                                onChange={(e) => handleQuizChange('duration')({ target: { value: e.target.value * 60 } })}
                            />
                            <TextField
                                type="number"
                                label="Passing Score (%)"
                                value={quizData.passingScore}
                                onChange={handleQuizChange('passingScore')}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions */}
            {quizData.questions.map((question, questionIndex) => (
                <Card key={questionIndex} className="p-4">
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h6">Question {question.orderNumber}</Typography>

                            <IconButton
                                onClick={() => removeQuestion(questionIndex)}
                                disabled={quizData.questions.length === 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>

                        <div className="space-y-4">
                            <TextField
                                fullWidth
                                label="Question Content"
                                value={question.content}
                                onChange={handleQuestionChange(questionIndex, 'content')}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormControl fullWidth>
                                    <InputLabel>Question Type</InputLabel>
                                    <Select
                                        value={question.type}
                                        label="Question Type"
                                        onChange={handleQuestionChange(questionIndex, 'type')}
                                    >
                                        <MenuItem value="only-choice">Only Choice</MenuItem>
                                        <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                                        <MenuItem value="true-false">True/False</MenuItem>

                                    </Select>
                                </FormControl>

                                <TextField
                                    type="number"
                                    label="Points"
                                    min="1"
                                    value={question.points}
                                    onChange={handleQuestionChange(questionIndex, 'points')}
                                />
                            </div>

                            {/* Answers */}
                            <Typography variant="subtitle1" className="mt-4">Answers</Typography>
                            {question.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="flex items-center gap-4">
                                    <TextField
                                        fullWidth
                                        label={`Answer ${answerIndex + 1}`}
                                        value={answer.content}
                                        onChange={handleAnswerChange(questionIndex, answerIndex, 'content')}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={answer.isCorrect}
                                                onChange={handleAnswerChange(questionIndex, answerIndex, 'isCorrect')}
                                            />
                                        }
                                        label="Correct"
                                    />
                                    <IconButton
                                        onClick={() => removeAnswer(questionIndex, answerIndex)}
                                        disabled={question.answers.length <= 2}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            ))}

                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => addAnswer(questionIndex)}
                                variant="outlined"
                                size="small"
                            >
                                Add Answer
                            </Button>

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Explanation"
                                value={question.explanation}
                                onChange={handleQuestionChange(questionIndex, 'explanation')}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-between">
                <Button
                    startIcon={<AddIcon />}
                    onClick={addQuestion}
                    variant="contained"
                    color="primary"
                >
                    Add Question
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Create Quiz
                </Button>
            </div>
        </div>
    )
}

export default EditQuiz
