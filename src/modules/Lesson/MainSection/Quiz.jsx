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
    Stack,
    CircularProgress,
    Checkbox,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { TimerOutlined, CheckCircle, Cancel, QuizOutlined } from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { getQuizById, submitQuiz } from "~/store/slices/Quiz/action.js";
import { useLocation } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const Quiz = () => {
    const dispatch = useDispatch();
    const { onQuizSubmit } = useOutletContext();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [quizProgress, setQuizProgress] = useState(null);
    const [timeLeft, setTimeLeft] = useState(1200);
    const [score, setScore] = useState(0);
    const [isPassed, setIsPassed] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isButton, setIsButton] = useState(true);

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
    const location = useLocation();
    const quizId = location?.state?.item?.quiz._id || '';

    useEffect(() => {
        setIsStarted(false);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setQuizProgress(null);
        setScore(0);
        getQuizByQuizId();
    }, [quizId]);

    const getQuizByQuizId = async () => {
        setIsLoading(true);
        try {
            const result = await dispatch(getQuizById(quizId));
            console.log('result', result);
            if (result.payload.quizProgress && result.payload.quizProgress.status === 'completed') {
                setQuiz(result.payload.data);
                setQuizProgress(result.payload.quizProgress);
                setSelectedAnswers(
                    result.payload.quizProgress.result.quiz.answers.reduce((acc, answer, index) => {
                        acc[index] = answer.selectedAnswer;
                        return acc;
                    }, {})
                );
                setTimeLeft(1200);
                setIsSubmitted(true);
            } else if (result.payload.success) {
                setQuiz(result.payload.data);
                setTimeLeft(result.payload.data.duration);
                setIsSubmitted(false);
                setQuizProgress(null);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch quiz:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted && isStarted) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted, isStarted]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (event) => {
        const currentAnswers = selectedAnswers[currentQuestion] || [];
        if (quiz.questions[currentQuestion].type === 'multiple-choice') {
            setSelectedAnswers(prev => ({
                ...prev,
                [currentQuestion]: currentAnswers.includes(event.target.value)
                    ? currentAnswers.filter(answer => answer !== event.target.value)
                    : [...currentAnswers, event.target.value]
            }));
        } else {
            setSelectedAnswers(prev => ({
                ...prev,
                [currentQuestion]: event.target.value
            }));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setIsButton(false);
        const result = await dispatch(submitQuiz({
            answers: Object.values(selectedAnswers),
            timeSpent: quiz.duration - timeLeft,
            quizId
        }));
        if (result.payload.success) {
            setQuizProgress(result.payload.data.moduleItemProgress);
            setScore(result.payload.data.currentScore);
            setIsPassed(result.payload.data.moduleItemProgress?.result.quiz.score >= quiz.passingScore);
            setIsSubmitted(true);
            if (onQuizSubmit) {
                console.log('onQuizSubmit', onQuizSubmit);
                onQuizSubmit(true);
            }
        } else {
            console.error('Failed to submit quiz:', result.payload.error);
        }
        setIsLoading(false);
    };

    const handleStartQuiz = () => {
        setIsStarted(true);
    };

    const getQuestionStatus = (index) => {
        if (!selectedAnswers[index]) return 'unanswered';
        if (!isSubmitted) return 'answered';
        const isCorrect = quizProgress?.result.quiz.answers[index].isCorrect;
        return isCorrect ? 'correct' : 'incorrect';
    };

    const handleRemakeQuiz = () => {
        handleStartQuiz();
        setTimeLeft(quiz.duration)
        setIsButton(true)
        setIsReviewing(false);
        setIsSubmitted(false);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setQuizProgress(null);
        setScore(0);
    };

    const renderQuestion = () => {
        console.log('quiz', isStarted);
        if (!isStarted) return null;
        const question = quiz.questions[currentQuestion];
        const selectedAnswer = selectedAnswers[currentQuestion];
        const isAnswerCorrect = isSubmitted && quizProgress?.result.quiz.answers[currentQuestion].isCorrect;

        return (
            <Stack spacing={3}>
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                }}>
                    Question {currentQuestion + 1} of {quiz.questions.length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    {question.type === 'multiple-choice' && '(Select all that apply)'}
                    {question.type === 'only-choice' && '(Select one)'}
                    {question.type === 'true-false' && '(True or False)'}
                </Typography>
                <Typography variant="body1" sx={{
                    fontWeight: 'bold'
                }}>
                    {question.content}
                </Typography>

                {isSubmitted && (
                    <Alert severity={isAnswerCorrect ? "success" : "error"}>
                        <Typography variant="body2">
                            {quizProgress?.result.quiz.answers[currentQuestion].explanation}
                        </Typography>
                    </Alert>
                )}

                {(question.type === 'only-choice' || question.type === 'true-false') && (
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
                                    disabled={isSubmitted}
                                />
                            ))}
                        </Stack>
                    </RadioGroup>
                )}

                {question.type === 'multiple-choice' && (
                    <Stack spacing={2}>
                        {question.answers.map((answer) => (
                            <FormControlLabel
                                key={answer._id}
                                control={
                                    <Checkbox
                                        checked={selectedAnswer?.includes(answer._id)}
                                        onChange={handleAnswerSelect}
                                        value={answer._id}
                                        disabled={isSubmitted}
                                    />
                                }
                                label={answer.content}
                            />
                        ))}
                    </Stack>
                )}
            </Stack>
        );
    };

    const question = quiz.questions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];
    const isLastQuestion = currentQuestion === quiz?.questions?.length - 1;
    const progress = ((currentQuestion + 1) / quiz?.questions?.length) * 100;

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {!isStarted && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: "50%",
                    height: "80%",
                    gap: 2,
                    backgroundColor: '#E6EEFC',
                    padding: 4,
                    boxShadow: 3

                }}>
                    <QuizOutlined sx={{ fontSize: 100, color: 'primary.main', m: 2 }} />
                    <Typography>Start Quiz</Typography>
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            This quiz contains {quiz.totalQuestions} questions.
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            Time limit: {formatTime(quiz.duration)}
                        </Typography>
                        <Typography variant="h5">
                            Passing score: {quiz.passingScore}%
                        </Typography>
                        {quizProgress?.status === 'completed' && (
                            <Typography variant="h5" color='success' sx={{ mt: 2 }} gminBottom>
                                Your highest score: {quizProgress?.result.quiz.score.toFixed(1) || '0'}%
                            </Typography>
                        )}
                    </Box>
                    <Box>

                        {(quizProgress?.status === 'completed' || quizProgress?.status === 'in-progress') ? (
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                            }}>
                                <Button onClick={handleRemakeQuiz} variant="outlined" color="primary">
                                    Remake Quiz
                                </Button>
                                <Button onClick={() => {
                                    setIsReviewing(true)
                                    setIsButton(true)
                                    handleStartQuiz()
                                }} variant="contained" color="primary">
                                    Review Quiz
                                </Button>
                            </Box>
                        ) : (
                            <Button onClick={handleStartQuiz} variant="contained" color="primary">
                                Start Quiz
                            </Button>
                        )}

                    </Box>
                </Box>
            )}

            {isStarted && (
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={9}>
                            <Card elevation={3}>
                                <CardHeader
                                    title={
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h5">Quiz</Typography>
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
                                    {isSubmitted && !isReviewing ? (
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
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    setIsReviewing(true)
                                                    setIsButton(true)
                                                }}
                                            >
                                                Review Answers
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleRemakeQuiz()}
                                            >
                                                Remake Quiz
                                            </Button>
                                        </Stack>
                                    ) : (
                                        renderQuestion()
                                    )}
                                </CardContent>
                                {isButton && (
                                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setCurrentQuestion(prev => prev - 1)}
                                            disabled={currentQuestion === 0}
                                        >
                                            Previous
                                        </Button>
                                        {isLastQuestion && !isSubmitted ? (
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
                                                disabled={!selectedAnswer || currentQuestion === quiz.questions.length - 1}
                                                color="primary"
                                            >
                                                Next
                                            </Button>
                                        )}
                                    </CardActions>
                                )}

                            </Card>
                        </Grid>
                        {/* Overview */}
                        <Grid item xs={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Questions Overview
                                </Typography>
                                {isReviewing && (
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleRemakeQuiz()}
                                            sx={{ mb: 2 }}
                                        >
                                            Remake Quiz
                                        </Button>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Last score: {quizProgress?.result.quiz.score.toFixed(1) || '0'}%
                                        </Typography>
                                    </Box>
                                )}


                                <List>
                                    {quiz.questions.map((q, index) => (
                                        <ListItem key={q._id} disablePadding>
                                            <ListItemButton
                                                onClick={() => setCurrentQuestion(index)}
                                                selected={currentQuestion === index}
                                                sx={{
                                                    borderRadius: 1,
                                                    mb: 1,
                                                    backgroundColor: isSubmitted
                                                        ? getQuestionStatus(index) === 'correct'
                                                            ? 'success.light'
                                                            : getQuestionStatus(index) === 'incorrect'
                                                                ? 'error.light'
                                                                : 'inherit'
                                                        : getQuestionStatus(index) === 'answered'
                                                            ? 'action.selected'
                                                            : 'inherit'
                                                }}
                                            >
                                                <ListItemText
                                                    primary={`Question ${index + 1}`}
                                                    secondary={q.type}
                                                />
                                                {getQuestionStatus(index) === 'answered' && !isSubmitted && (
                                                    <CheckCircle color="action" />
                                                )}
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </>
    );
};

export default Quiz;