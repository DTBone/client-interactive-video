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
import { createPortal } from "react-dom";

const InteractiveDialogInFullscreen = ({
  open,
  loading,
  currentQuestion,
  selectedAnswer,
  handleMultipleChoiceChange,
  handleSingleChoiceChange,
  handleAnswerSubmit,
  handleCloseDialog,
  alert,
  containerRef,
}) => {
  if (!containerRef?.current) return null;

  // Xác định loại câu hỏi dựa trên cấu trúc dữ liệu
  const isMultipleChoice = currentQuestion?.type === "multiple-choice" || 
                          currentQuestion?.questionType === "multipleChoice";

  return createPortal(
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          borderRadius: 2,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        },
      }}
      BackdropProps={{
        sx: {
          bgcolor: "rgba(0, 0, 0, 0.8)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
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
            minWidth: "auto",
            padding: "4px",
            ":hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <Tooltip title="Close" placement="bottom">
            <Close />
          </Tooltip>
        </Button>
      </DialogTitle>
      
      {loading && (
        <div
          style={{
          
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </div>
      )}
      
      <DialogContent sx={{ mt: 2, minHeight: "300px" }}>
        {alert && typeof alert === "string" && (
          <Alert
            severity={alert.includes("correct") ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {alert}
          </Alert>
        )}

        {currentQuestion && (
          <FormControl className="w-full">
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentQuestion.question}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {isMultipleChoice
                ? "Select all that apply:"
                : "Select one:"}
            </Typography>
            
            {isMultipleChoice ? (
              <Stack spacing={2}>
                {/* Xử lý cho cả options và answers */}
                {(currentQuestion.options || currentQuestion.answers)?.map((item, index) => {
                  const content = typeof item === 'string' ? item : item.content;
                  const id = typeof item === 'string' ? index : item._id;
                  
                  return (
                    <FormControlLabel
                      key={id}
                      control={
                        <Checkbox
                          checked={Array.isArray(selectedAnswer) ? 
                            selectedAnswer.includes(id) || selectedAnswer.includes(index) : false}
                          onChange={(e) => handleMultipleChoiceChange(e, index)}
                        />
                      }
                      label={content}
                    />
                  );
                })}
              </Stack>
            ) : (
              <RadioGroup
                value={selectedAnswer || ""}
                onChange={handleSingleChoiceChange}
              >
                <Stack spacing={2}>
                  {(currentQuestion.options || currentQuestion.answers)?.map((item, index) => {
                    const content = typeof item === 'string' ? item : item.content;
                    const id = typeof item === 'string' ? index : item._id;
                    
                    return (
                      <FormControlLabel
                        key={id}
                        value={typeof item === 'string' ? index : id}
                        control={<Radio />}
                        label={content}
                      />
                    );
                  })}
                </Stack>
              </RadioGroup>
            )}
          </FormControl>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={handleCloseDialog}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAnswerSubmit}
          disabled={
            loading || 
            (!selectedAnswer && selectedAnswer !== 0) || 
            (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
          }
          startIcon={<QuestionAnswer />}
        >
          {loading ? "Submitting..." : "Submit Answer"}
        </Button>
      </DialogActions>
    </Dialog>,
    containerRef.current
  );
};

InteractiveDialogInFullscreen.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  currentQuestion: PropTypes.shape({
    _id: PropTypes.string,
    question: PropTypes.string,
    type: PropTypes.string,
    questionType: PropTypes.string,
    options: PropTypes.array, // Thêm support cho options
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        content: PropTypes.string,
        isCorrect: PropTypes.bool,
      })
    ),
  }),
  selectedAnswer: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  handleMultipleChoiceChange: PropTypes.func.isRequired,
  handleSingleChoiceChange: PropTypes.func.isRequired,
  handleAnswerSubmit: PropTypes.func.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  alert: PropTypes.string,
  containerRef: PropTypes.object.isRequired, // Sửa từ func thành object
};

InteractiveDialogInFullscreen.defaultProps = {
  loading: false,
  currentQuestion: null,
  alert: "",
};

export default InteractiveDialogInFullscreen;