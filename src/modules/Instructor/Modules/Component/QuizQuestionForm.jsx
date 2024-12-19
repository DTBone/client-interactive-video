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

const QuizQuestionForm = ({ questions, onUpdate, duration }) => {
    const [quizData, setQuizData] = useState([
        {
            index: 1,
            questionType: 'onlyChoice',
            question: '',
            startTime: 30,
            answers: [
                { content: '', isCorrect: true },
                { content: '', isCorrect: false },
            ],
        },
    ]);

    const addQuestion = () => {
        const newQuestion = {
            index: quizData.length + 1,
            questionType: 'onlyChoice',
            question: '',
            startTime: 30,
            answers: [
                { content: '', isCorrect: true },
                { content: '', isCorrect: false },
            ],
        };
        setQuizData([...quizData, newQuestion]);
    };

    useEffect(() => {
        if (questions) {
            setQuizData(questions);
        }
    }, [questions])
    const removeQuestion = (index) => {
        const updatedQuestions = quizData.filter((_, i) => i !== index);
        setQuizData(updatedQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = quizData.map((question, i) => {
            if (i === index) {
                return { ...question, [field]: value };
            }
            return question;
        });
        setQuizData(updatedQuestions);
        onUpdate(updatedQuestions);
    };

    const addAnswer = (questionIndex) => {
        const updatedQuestions = quizData.map((question, index) => {
            if (index === questionIndex) {
                return {
                    ...question,
                    answers: [
                        ...question.answers,
                        { content: '', isCorrect: false },
                    ],
                };
            }
            return question;
        });
        setQuizData(updatedQuestions);
        onUpdate(updatedQuestions);
    };

    const removeAnswer = (questionIndex, answerIndex) => {
        const updatedQuestions = quizData.map((question, index) => {
            if (index === questionIndex) {
                const updatedAnswers = question.answers.filter((_, i) => i !== answerIndex);
                return { ...question, answers: updatedAnswers };
            }
            return question;
        });
        setQuizData(updatedQuestions);
        onUpdate(updatedQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
        const updatedQuestions = quizData.map((question, qIndex) => {
            if (qIndex === questionIndex) {
                const updatedAnswers = question.answers.map((answer, aIndex) => {
                    if (aIndex === answerIndex) {
                        return { ...answer, [field]: value };
                    }
                    return answer;
                });
                return { ...question, answers: updatedAnswers };
            }
            return question;
        });
        setQuizData(updatedQuestions);
        onUpdate(updatedQuestions);
    };



    return (
        <div className=''>
            {quizData.map((question, questionIndex) => (
                <Card key={questionIndex} className="p-4">
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h6">Question {question.index}</Typography>
                            <IconButton
                                onClick={() => removeQuestion(questionIndex)}
                            //disabled={quizData.length === 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>

                        <div className="space-y-4">
                            <TextField
                                fullWidth
                                label="Question Content"
                                value={question.question}
                                onChange={(e) =>
                                    handleQuestionChange(questionIndex, 'question', e.target.value)
                                }
                            />

                            <FormControl fullWidth>
                                <InputLabel>Question Type</InputLabel>
                                <Select
                                    value={question.questionType}
                                    label="Question Type"
                                    onChange={(e) =>
                                        handleQuestionChange(questionIndex, 'questionType', e.target.value)
                                    }
                                >
                                    <MenuItem value="onlyChoice">Only Choice</MenuItem>
                                    <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
                                    <MenuItem value="trueFalse">True/False</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Start Time (seconds)"
                                type="number"
                                value={question.startTime}
                                onChange={(e) =>
                                    handleQuestionChange(questionIndex, 'startTime', Number(e.target.value))
                                }
                            />

                            <Typography variant="subtitle1" className="mt-4">Answers</Typography>
                            {question.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="flex items-center gap-4">
                                    <TextField
                                        fullWidth
                                        label={`Answer ${answerIndex + 1}`}
                                        value={answer.content}
                                        onChange={(e) =>
                                            handleAnswerChange(questionIndex, answerIndex, 'content', e.target.value)
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={answer.isCorrect}
                                                onChange={(e) =>
                                                    handleAnswerChange(questionIndex, answerIndex, 'isCorrect', e.target.checked)
                                                }
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
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={addQuestion}
                variant="contained"
                size="small"
                sx={{ marginTop: '10px' }}
            >
                Add Question
            </Button>
        </div>
    );
};

export default QuizQuestionForm;