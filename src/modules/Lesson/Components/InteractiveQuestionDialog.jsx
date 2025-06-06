import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { QuestionAnswer, Close } from "@mui/icons-material";
import PropTypes from "prop-types";

const InteractiveQuestionDialog = ({
  open,
  loading,
  currentQuestion,
  selectedAnswer,
  handleMultipleChoiceChange,
  handleSingleChoiceChange,
  handleAnswerSubmit,
  handleCloseDialog,
  alert,
}) => (
  <Dialog
    open={open}
    onClose={() => {}}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        bgcolor: "background.paper",
        borderRadius: 2,
      },
    }}
  >
    <DialogTitle
      sx={{
        bgcolor: "primary.main",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <QuestionAnswer /> Interactive Question
      </span>
      <Button
        onClick={handleCloseDialog}
        sx={{
          color: "white",
          ":hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <Tooltip title="Close" placement="bottom">
          <Close />
        </Tooltip>
      </Button>
    </DialogTitle>
    {loading ? (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.5)",
        }}
      >
        <CircularProgress />
      </div>
    ) : (
      <div>
        <DialogContent sx={{ mt: 2, minHeight: "300px" }}>
          {alert && typeof alert === "string" && (
            <Alert
              severity={
                alert.includes("Correct! You can continue watching the video")
                  ? "success"
                  : "error"
              }
              sx={{ mb: 2 }}
              onClose={() => {}}
            >
              {alert}
            </Alert>
          )}

          {currentQuestion && (
            <FormControl className="w-full">
              <Typography variant="h6" className="mb-4">
                {currentQuestion.question}
                {/* {currentQuestion.status && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "0.8rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor:
                        currentQuestion.status === "completed"
                          ? "#e8f5e9"
                          : currentQuestion.status === "in-progress"
                            ? "#fff8e1"
                            : "#f3e5f5",
                      color:
                        currentQuestion.status === "completed"
                          ? "#2e7d32"
                          : currentQuestion.status === "in-progress"
                            ? "#f57f17"
                            : "#6a1b9a",
                    }}
                  >
                    {currentQuestion.status === "unanswered"
                      ? "New"
                      : currentQuestion.status === "in-progress"
                        ? "In Progress"
                        : "Completed"}
                  </span>
                )} */}
              </Typography>
              {/* True/False Questions */}
              {currentQuestion.questionType === "true-false" && (
                <>
                  <Typography variant="subtitle1" className="mb-2">
                    Select the box if{" "}
                    <span className="text-green-600 font-bold uppercase">
                      True
                    </span>
                    , leave blank if{" "}
                    <span className="text-red-600 font-bold uppercase">
                      False
                    </span>
                    .
                  </Typography>
                  <RadioGroup
                    value={selectedAnswer?.[0] || ""}
                    onChange={handleSingleChoiceChange}
                  >
                    <Stack className="space-y-4">
                      {currentQuestion.answers.map((answer) => (
                        <FormControlLabel
                          key={answer._id}
                          value={answer._id}
                          control={<Radio />}
                          label={answer.content}
                        />
                      ))}
                    </Stack>
                  </RadioGroup>
                </>
              )}
              {/* Multiple Choice Questions */}
              {currentQuestion.questionType === "multiple-choice" && (
                <>
                  <Typography variant="subtitle1" className="mb-2">
                    Select all that apply:
                  </Typography>
                  <Stack className="space-y-4">
                    {currentQuestion.answers.map((answer) => (
                      <FormControlLabel
                        key={answer._id}
                        control={
                          <Checkbox
                            checked={selectedAnswer?.includes(answer._id)}
                            onChange={() =>
                              handleMultipleChoiceChange(answer._id)
                            }
                          />
                        }
                        label={answer.content}
                      />
                    ))}
                  </Stack>
                </>
              )}
              {/* Single Choice Questions */}
              {currentQuestion.questionType === "single-choice" && (
                <>
                  <Typography variant="subtitle1" className="mb-2">
                    Select one:
                  </Typography>
                  <RadioGroup
                    value={selectedAnswer?.[0] || ""}
                    onChange={handleSingleChoiceChange}
                  >
                    <Stack className="space-y-4">
                      {currentQuestion.answers.map((answer) => (
                        <FormControlLabel
                          key={answer._id}
                          value={answer._id}
                          control={<Radio />}
                          label={answer.content}
                        />
                      ))}
                    </Stack>
                  </RadioGroup>
                </>
              )}
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              console.log("Submit Answer clicked");
              handleAnswerSubmit();
            }}
            disabled={!selectedAnswer || selectedAnswer.length === 0}
            startIcon={<QuestionAnswer />}
          >
            Submit Answer
          </Button>
        </DialogActions>
      </div>
    )}
  </Dialog>
);

InteractiveQuestionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  currentQuestion: PropTypes.shape({
    _id: PropTypes.string,
    question: PropTypes.string,
    questionType: PropTypes.string,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        content: PropTypes.string,
        isCorrect: PropTypes.bool,
      })
    ),
  }),
  selectedAnswer: PropTypes.array.isRequired,
  handleMultipleChoiceChange: PropTypes.func.isRequired,
  handleSingleChoiceChange: PropTypes.func.isRequired,
  handleAnswerSubmit: PropTypes.func.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  alert: PropTypes.string, // Thêm prop alert
};

InteractiveQuestionDialog.defaultProps = {
  loading: false,
  currentQuestion: null,
  alert: "",
};

export default InteractiveQuestionDialog;
