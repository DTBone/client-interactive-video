import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    LinearProgress,
    Alert,
    AlertTitle,
    Box,
    Stack, CircularProgress,
} from '@mui/material';
import { TimerOutlined, CheckCircle, Cancel } from '@mui/icons-material';
import { useDispatch } from "react-redux";
import {getQuizById, submitQuiz} from "~/store/slices/Quiz/action.js";
import {useParams} from "react-router-dom";
import {updateModuleItemStatus} from "~/store/slices/Quiz/quizSlice.js";


const Quiz = () => {
    const dispatch = useDispatch();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [quizProgress, setQuizProgress] = useState(null);
    const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
    const [score, setScore] = useState(0);
    const [isPassed, setIsPassed] = useState(false);
    const [quiz, setQuiz] = useState({
        duration: 1200,
        passingScore: 70,
        questions: [
            {
                orderNumber: 1,
                content: "Sample question",
                type: "only-choice",
                points: 1,
                answers: [
                    {
                        content: "Answer 1",
                        isCorrect: true,
                        _id: "1"
                    },
                    {
                        content: "Answer 2",
                        isCorrect: false,
                        _id: "2"
                    }
                ],
                _id: "q1"
            }
        ],
        totalQuestions: 1,
        totalPoints: 1
    });
    const [isLoading, setIsLoading] = useState(false);

    const { quizId } = useParams();

    useEffect(() => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setIsSubmitted(false);
        setQuizProgress(null);
        setScore(0);
        getQuizByQuizId();
    }, [quizId]);
    // Fetch quiz data
    const getQuizByQuizId = async () => {
        setIsLoading(true);
        try {
            const result = await dispatch(getQuizById(quizId));
            if (result.payload.quizProgress && result.payload.quizProgress.status === 'completed') {

                setQuiz(result.payload.data);
                setQuizProgress(result.payload.quizProgress);
                setSelectedAnswers(result.payload.quizProgress.result.quiz.answers.map(answer => answer.selectedAnswer));
                setTimeLeft(1200)
                setIsSubmitted(true);
                setIsLoading(false);
            }
            else if (result.payload.success) {
                setQuiz(result.payload.data);
                setTimeLeft(result.payload.data.duration);
                setIsSubmitted(false);
                setIsLoading(false);
                setQuizProgress(null)
            }
        } catch (error) {
            console.error('Failed to fetch quiz:', error);
            setIsLoading(false);
        }
    };


    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (event) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion]: event.target.value
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const result = await dispatch(submitQuiz({answers: Object.entries(selectedAnswers).map(([key, value]) => value), timeSpent:quiz.duration - timeLeft , quizId}));
        if(result.payload.success){
            setScore(result.payload.data.score);
            setIsPassed(result.payload.data.passed);
            setIsSubmitted(true);
        }
        else {
            console.error('Failed to submit quiz:', result.payload.error);
        }
        setIsLoading(false);
    };

    const question = quiz.questions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];
    const isLastQuestion = currentQuestion === quiz.questions.length - 1;
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>

            <Card elevation={3}>
                <CardHeader
                    title={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            {quizProgress ? (
                                <Box>
                                    <Typography variant="h5">Quiz Completed</Typography>
                                    <CheckCircle color="success" />
                                    <Typography variant="body2">{`Explanation: ${quizProgress.result.quiz.answers[currentQuestion].explanation}`}</Typography>
                                </Box>
                            ) : (<Typography variant="h5">Quiz</Typography>)}
                            <Box display="flex" alignItems="center" gap={1}>
                                <TimerOutlined />
                                <Typography variant="subtitle1">
                                    {formatTime(timeLeft)}
                                </Typography>
                            </Box>
                        </Stack>
                    }
                    subheader={
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                    }
                                }}
                            />
                        </Box>
                    }
                />

                <CardContent>
                    {isSubmitted && !quizProgress ? (
                        <Stack spacing={2}>
                            <Alert
                                severity={isPassed ? "success" : "error"}
                                icon={isPassed ? <CheckCircle /> : <Cancel />}
                                sx={{ '& .MuiAlert-message': { width: '100%' } }}
                            >
                                <AlertTitle>
                                    {isPassed ? "Congratulations! You passed!" : "Sorry! You failed."}
                                </AlertTitle>
                                <Typography>
                                    Your score: {score.toFixed(1)}% (Passing score: {quiz.passingScore}%)
                                </Typography>
                            </Alert>
                        </Stack>
                    ) : (
                        <Stack spacing={3}>
                            <Typography variant="h6">
                                Question {currentQuestion + 1} of {quiz.questions.length}
                            </Typography>
                            <Typography variant="body1">
                                {question.content}
                            </Typography>
                            <RadioGroup
                                value={selectedAnswer || ''}
                                onChange={handleAnswerSelect}
                            >
                                <Stack spacing={2}>
                                    {question.answers.map((answer) => (
                                        <FormControlLabel
                                            key={answer._id}
                                            value={answer._id}
                                            control={<Radio />}
                                            label={answer.content}
                                        />
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </Stack>
                    )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    {!isSubmitted && (
                        <>
                            <Button
                                variant="outlined"
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                                disabled={currentQuestion === 0}
                            >
                                Previous
                            </Button>
                            {isLastQuestion ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!selectedAnswer}
                                    color="primary"
                                >
                                    Submit
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                                    disabled={!selectedAnswer}
                                    color="primary"
                                >
                                    Next
                                </Button>
                            )}
                        </>
                    )}
                </CardActions>
            </Card>
            {isLoading && <CircularProgress size={40} />}

        </Container>
    );
};

export default Quiz;