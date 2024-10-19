import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axiosInstance from '~/services/api/axiosInstance';

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
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  'justify-content': 'center',
  'align-items': 'center',
};

export default function ModalForm() {
  const [open, setOpen] = React.useState(true);
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const btnSend = React.useRef(null);
  const navigate = useNavigate();
  const validatePassword = (password) => {
    if(password.length < 8) {
      setError('Password must be at least 8 characters' + Date.now().toString().slice(-4));
      return false;
  }
    if((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/).test(password) === false) {
        setError('Password must contain at least one uppercase letter, one lowercase letter, one special letter and one number' + Date.now().toString().slice(-4));
        return false;
    }
  return true;
  };
  const handleSubmit = async () => {
    if (!validatePassword(password)) {
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match' + Date.now().toString().slice(-4));
      return;
    }
    btnSend.current.disabled = true;
    btnSend.current.style.backgroundColor = 'gray';
    try {
      const response = await axiosInstance.post('/reset-password', {
        password,
        code
      });
      if (response.data.status === 'success') {
        setError('Success Please login with your new password');
      }
    }
    catch (error) {
      setError(error.message + Date.now().toString().slice(-4));
    }
  };

  const handleClose = () => {
    setOpen(false);
    if(error === 'Success Please login with your new password')
      navigate('/login');
  };

  return (
    <div >
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
            <Typography id="transition-modal-title" color='success' variant="h4" component="h1">
              Form
            </Typography>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Please enter your new password and confirm it
            </Typography>
            <TextField
              required
              autoComplete='off'
              variant='filled'
              label="Code"
              type='Text'
              onChange={(e) => setCode(e.target.value)}
              sx={{
                  width:'100%',
                  backgroundColor:'white',
                  borderRadius:'5px',
              }}
              />
            <TextField
              required
              autoComplete='off'
              variant='filled'
              label="Password"
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                  width:'100%',
                  backgroundColor:'white',
                  borderRadius:'5px',
              }}
              color='primary'
              />
              <TextField
              required
              autoComplete='off'
              variant='filled'
              label="Confirm Password"
              type='password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                  width:'100%',
                  backgroundColor:'white',
                  borderRadius:'5px',
              }}
              color='primary'
              />
              {error && <Typography variant='subtitle1' color='error'>{error}</Typography>}
            <Button ref={btnSend} onClick={handleSubmit} variant="contained" color="primary">
                Send
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
