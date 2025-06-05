/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  Divider, 
  LinearProgress,
  Card,
  CardContent,
  Stack,
  Alert,
  IconButton,
  Checkbox,
  FormControl
} from '@mui/material';
import Modal from '@mui/material/Modal';
import { 
  AccessTime as ClockIcon, 
  CheckCircle as CheckCircleIcon, 
  Cancel as CancelIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import { api } from '~/Config/api';
import { isFriday } from 'date-fns';

const exampleTest = {
    title: 'Test Title',
    description: 'Test Description',
    timeLimit: 60, // in minutes
    passingScore: 1, // points
    questions: [
        {
            _id: '1',
            question: 'Question 1?',
            points: 1,
            explanation: 'Explanation for Question 1',
            options: [
                { text: 'Option 1', correct: false },
                { text: 'Option 2', correct: true },
                { text: 'Option 3', correct: false },
                { text: 'Option 4', correct: false }
            ]
        },
        {
            _id: '2',
            question: 'Question 2?',
            points: 1,
            explanation: 'Explanation for Question 2',
            options: [
                { text: 'Option 1', correct: false },
                { text: 'Option 2', correct: true },
                { text: 'Option 3', correct: false },
                { text: 'Option 4', correct: false }
            ]
        }
    ]
};

const TestModal = ({ open = true, onClose, test = exampleTest, setTest, refreshRoadmap }) => {
  
  // Initialize state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(test.timeLimit * 60);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [testResult, setTestResult] = useState({});

  // Timer logic
  useEffect(() => {
    if (open && timeRemaining > 0 && !testSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !testSubmitted) {
      handleSubmitTest();
    }
  }, [timeRemaining, testSubmitted, open]);

  // Reset the test when opened
  useEffect(() => {
    if (open) {
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setTestSubmitted(false);
      setTimeRemaining(test.timeLimit * 60);
      setScore(0);
      handleReviewTest();
      if(test?.passed){
        setTestSubmitted(true);
      }
    }
  }, [open, test.timeLimit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSelectAnswer = (questionId, optionIndex) => {
    console.log("Answer selected", selectedAnswers[questionId]);
    if (test.questions[currentQuestion].type === 'multiple-choice') {
      // Đảm bảo selectedAnswers[questionId] là một mảng
      const selectedOptions = selectedAnswers[questionId] || [];
  
      if (selectedOptions.includes(optionIndex)) {
        // Nếu option đã chọn rồi thì bỏ chọn
        setSelectedAnswers({
          ...selectedAnswers,
          [questionId]: selectedOptions.filter((index) => index !== optionIndex),
        });
      } else {
        // Thêm option mới vào danh sách đã chọn
        setSelectedAnswers({
          ...selectedAnswers,
          [questionId]: [...selectedOptions, optionIndex],
        });
      }
    } else {
      // Dạng câu hỏi single-choice, chỉ chọn một đáp án duy nhất
      setSelectedAnswers({
        ...selectedAnswers,
        [questionId]: optionIndex,
      });
    }
  };
  
  const handleSubmitTest = () => {
    const submitTest = async () => {
        const result = await api.post(`/roadmap/submit-test`, {
            testId: test._id,
            answers: selectedAnswers,
            timeTaken: test.timeLimit * 60 - timeRemaining
        });
        console.log(result);
        if(result.status === 200){
            console.log('Test submitted successfully');
            // Calculate percentage score
            setTotalPoints(totalPoints);
            setScore(result.data.data.attempts[result.data.data.attempts.length - 1].score);
            setTestSubmitted(true);
            setTestResult(result.data.data);
            if(result.data.data.passed){
                setTest({...test, passed: true});
            }
            if(refreshRoadmap){
                refreshRoadmap();
            }
        }
        else{
            console.log('Test submission failed');

        }
    }
    submitTest();

  };

  const handleReviewTest = async () => {
    try {
      const data = await api.get(`/roadmap/review-test`, {
        params: {
          testId: test._id,
        },
      });
      if (data.status === 200) {
        setTestResult(data.data.data);
        setScore(data.data.data.attempts[data.data.data.attempts.length - 1].score);
      }
    }
    catch (error) {
      console.log('Error reviewing test', error);
    }
  };

  const getTotalPoints = () => {
    let totalPoints = 0;
    test.questions.forEach((question) => {
      totalPoints += question.points;
    });
    return totalPoints;
  };

  const handleNextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / test.questions.length) * 100;
  };

  const isPassing = score >= test.passingScore;

  return (
    <Modal
      open={open}
      onClose={testSubmitted ? onClose : undefined}
      BackdropProps={{ sx: { bgcolor: 'rgba(236, 222, 222, 0.1)'} }}
      onBackdropClick={onClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 800,
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        p: 0,
      }}>
        {/* Modal Header */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: '8px 8px 0 0'
        }}>
          <Typography variant="h6" component="h2" id="test-modal-title">
            {test.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClockIcon fontSize="small" />
            <Typography variant="body2" fontWeight="medium">
              {formatTime(timeRemaining)}
            </Typography>
            {testSubmitted && (
              <IconButton size="small" onClick={onClose} sx={{ color: 'primary.contrastText', ml: 1 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={testSubmitted ? 100 : getProgressPercentage()} 
          sx={{ height: 4 }} 
        />
        
        {/* Modal Body */}
        <Box sx={{ p: 3 }}>
          {!testSubmitted ? (
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {test.description}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Question {currentQuestion + 1} of {test.questions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Passing Score: {test.passingScore} {test.passingScore > 1 ? 'points' : 'point'}
                  </Typography>
                </Box>
              {testResult && testResult.attempts && testResult.attempts.length > 0 && (
                <Button
                  variant="outlined"
                  onClick={() => setTestSubmitted(true)}
                  sx={{ mt: 1 }}
                >
                    Your attempts: {testResult.attempts ? testResult.attempts.length : 0}
                </Button>
              )}
              </Box>
              <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {test.questions[currentQuestion].question}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Type: {test.questions[currentQuestion].type.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Points: {test.questions[currentQuestion].points}
                </Typography>
                
                {test.questions[currentQuestion].type === 'multiple-choice' ? (
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    {test.questions[currentQuestion].options.map((option, index) => (
                      <FormControlLabel
                        sx={{ 
                          p: 1, 
                          borderRadius: 1,
                          '&:hover': { 
                            bgcolor: 'action.hover' 
                          },
                          ...(selectedAnswers[test.questions[currentQuestion]._id]?.includes(index) && {
                            bgcolor: 'primary.lighter',
                          })
                        }}
                        key={index}
                        control={
                          <Checkbox 
                            value={index} 
                            onChange={(e) => handleSelectAnswer(
                              test.questions[currentQuestion]._id,
                              parseInt(e.target.value, 10)
                            )}  
                            checked={!!selectedAnswers[test.questions[currentQuestion]._id]?.includes(index)}
                          />
                        }
                        label={option.text}
                      />
                    ))}
                  </FormControl>
                ) : 
                (
                  <RadioGroup
                  value={selectedAnswers[test.questions[currentQuestion]._id] ?? ''}
                  onChange={(e) => handleSelectAnswer(
                    test.questions[currentQuestion]._id, 
                    parseInt(e.target.value)
                  )}
                >
                  {test.questions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={option.text}
                      sx={{ 
                        p: 1, 
                        borderRadius: 1,
                        '&:hover': { 
                          bgcolor: 'action.hover' 
                        },
                        ...(selectedAnswers[test.questions[currentQuestion]._id] === index && {
                          bgcolor: 'primary.lighter',
                        })
                      }}
                    />
                  ))}
                </RadioGroup>
                )
                }
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Previous
                </Button>
                
                {currentQuestion < test.questions.length - 1 ? (
                  <Button 
                    variant="contained"
                    onClick={handleNextQuestion}
                    endIcon={<NavigateNextIcon />}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    variant="contained"
                    color="success"
                    onClick={handleSubmitTest}
                  >
                    Submit Test
                  </Button>
                )}
              </Box>
            </Box>
          ) : (testResult && testResult.attempts && testResult.attempts.length > 0) && (
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                display: 'inline-flex', 
                borderRadius: '50%', 
                p: 2, 
                mb: 2,
                bgcolor: isPassing ? 'success.lighter' : 'error.lighter' 
              }}>
                {isPassing ? (
                  <CheckCircleIcon fontSize="large" color="success" />
                ) : (
                  <CancelIcon fontSize="large" color="error" />
                )}
              </Box>
              
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {isPassing ? 'Congratulations!' : 'Test Not Passed'}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {isPassing 
                  ? 'You have successfully passed the test!' 
                  : 'You did not achieve the passing score. Feel free to review and try again.'
                }
              </Typography>
              
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  display: 'inline-block', 
                  mb: 4,
                  bgcolor: isPassing ? 'success.lighter' : 'error.lighter'
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {score} / {getTotalPoints()} points
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Passing Score: {test.passingScore} {test.passingScore > 1 ? 'points' : 'point'}
                </Typography>
              </Paper>
              
              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="h6" align="left" gutterBottom>
                  Review Answers:
                </Typography>
                <Stack spacing={2}>
                  {test.questions.map((question, index) => {
                    const lastAttempt = testResult.attempts[testResult.attempts.length - 1];
                    let selectedOptionIndex = lastAttempt.answers.find(answer => answer.questionId === question._id).selectedOptions;
                    if(question.type === 'single-choice'){
                      selectedOptionIndex = selectedOptionIndex[0];
                    }
                    const isCorrect = lastAttempt.answers.find(answer => answer.questionId === question._id).isCorrect;
                    return (
                      <Card key={index} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            {isCorrect ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <CancelIcon color="error" />
                            )}
                            <Typography variant="subtitle1" fontWeight="medium">
                              {question.question}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ pl: 4, mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Your answer: {selectedOptionIndex !== undefined ? 
                                question.type === 'single-choice' ? question.options[selectedOptionIndex].text : selectedOptionIndex.map(index => question.options[index].text).join(' and ') :
                                'Not answered'}
                            </Typography>
                            
                            {/* <Typography variant="body2" color={isCorrect ? 'success.main' : 'error.main'} gutterBottom>
                              Correct answer: {question?.options[correctOptionIndex]?.text}
                            </Typography> */}
                          </Box>
                          
                          {isCorrect && <Alert severity="info" sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              {question.explanation}
                            </Typography>
                          </Alert>}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </Box>
              
              
              <Button 
                variant="contained" 
                color="primary" 
                onClick={onClose}
                sx={{ px: 4, py: 1 }}
              >
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default TestModal;