/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import FreeTrial from "./FreeTrial";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, Stack, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};

const EnrollCourseBtn = ({ course, submitCourse }) => {
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);

  // Direct enrollment for free courses without notification
  const handleDirectEnroll = () => {
    submitCourse(true);
  };

  // Enrollment through modal for paid courses
  const handleSubmit = () => {
    submitCourse(true);
    handleClose();
  };

  const convertPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div>
      {course.price > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-row items-center gap-2">
            <Typography variant="h4" color="error" fontWeight="bold">
              {convertPrice(course.price)} VND
            </Typography>
            <Chip
              label="fees"
              color="error"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </div>
          <Stack direction="row" spacing={2}>
            {/* <Button
                            variant='contained'
                            onClick={handleOpen}
                            sx={{
                                height: "3.5rem",
                                background: theme => theme.palette.primary.main,
                                fontWeight: 'bold'
                            }}
                        >
                            Try it for free
                        </Button> */}
            <Button
              variant="outlined"
              onClick={() =>
                navigate(
                  `/payment/${JSON.parse(localStorage.getItem("user"))._id}`,
                  { state: { course: course } }
                )
              }
              sx={{
                height: "3.5rem",
                fontWeight: "bold",
              }}
            >
              Register now ({convertPrice(course.price)} VND)
            </Button>
          </Stack>
        </div>
      ) : (
        <Button
          variant="contained"
          onClick={handleDirectEnroll}
          sx={{
            width: "18rem",
            height: "4rem",
            background: (theme) => theme.palette.primary.main,
          }}
        >
          Sign up for free
        </Button>
      )}

      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "100%" }}
      >
        <Box sx={style}>
          <FreeTrial
            course={course}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </Box>
      </Modal> */}
    </div>
  );
};

export default EnrollCourseBtn;
