/* eslint-disable react/prop-types */
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal({ error }) {
  const [open, setOpen] = React.useState(true);
  const [prevError, setPrevError] = React.useState(null);  
  const navigate = useNavigate();

  React.useEffect(() => {
    if (error && error !== prevError) {
      setPrevError(error);
      setOpen(true);
    } else if (error === prevError) {
      setOpen(true);
    }
  }, [error, prevError]);

  if (!error) return null; 

  var title = 'Error';
  if (error.split(' ')[0] === 'Success') title = 'Success';

  const handleClose = () => {
    setOpen(false);
    if (error === 'You must login again to continue') {
      navigate('/login');
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              {error}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
