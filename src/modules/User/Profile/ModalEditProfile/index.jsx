/* eslint-disable react/prop-types */
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
// import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, TextField } from '@mui/material';
import axiosInstance from '~/services/api/axiosInstance';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
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

export default function ModalEditProfile({user, setOpen}) {
  const [openModal, setOpenModal] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [loading, setLoading] = React.useState(false);

  const [file, setFile] = React.useState(null);
  const [fullname, setFullname] = React.useState(user.profile.fullname);
  const [bio, setBio] = React.useState(user.profile.bio);
  const [phone, setPhone] = React.useState(user.profile.phone);
  const btnSend = React.useRef(null);
  const image = React.useRef(null);
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  // const navigate = useNavigate();

  const handleSubmit = async () => {
    btnSend.current.disabled = true;
    btnSend.current.style.backgroundColor = 'gray';
    //Tạo form data
    const data = new FormData();
    data.append('fullname', fullname);
    data.append('bio', bio);
    data.append('phone', phone);
    data.append('avatar', file);
    setLoading(true);
    try {
      const response = await axiosInstance.put(`${user._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setLoading(false);
      setError('Update successfully');
    }
    catch(err){
      setError(err.message);
      setLoading(false);
    }
  };
  const handleSelectFile = async (e) => {
    setFile(e.target.files[0]);
    image.current.src = URL.createObjectURL(e.target.files[0]);
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpen(false);
  };

  return (
    <div >
      <Modal
      
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
          
            <Typography id="transition-modal-title" color='success' variant="h4" component="h1">
              Edit Profile
            </Typography>
            <div className="flex flex-col justify-center items-center w-2/5">
                    <img ref={image} src={user.profile.picture || 'https://i.pinimg.com/564x/bc/43/98/bc439871417621836a0eeea768d60944.jpg'} alt={user.username} className="size-10 object-cover rounded-full "/>
            </div>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                >
                Upload files
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleSelectFile}
                    accept='image/*'
                />
            </Button>
            <TextField
              
              autoComplete='off'
              variant='filled'
              label="Fullname"
              value={fullname}
              type='text'
              onChange={(e) => setFullname(e.target.value)}
              sx={{
                  width:'100%',
                  backgroundColor:'white',
                  borderRadius:'5px',
              }}
              />
            <TextField
              autoComplete='off'
              variant='filled'
              label="Bio"
              type='text'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              sx={{
                  width:'100%',
                  backgroundColor:'white',
                  borderRadius:'5px',
              }}
              color='primary'
              />
              <TextField
              
              autoComplete='off'
              variant='filled'
              label="Phone Number"
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{
                  width:'100%',
                  backgroundColor:'white',
                  borderRadius:'5px',
              }}
              color='primary'
              />
              {error && <Typography variant='subtitle1' color='error'>{error}</Typography>}
            <Button ref={btnSend} onClick={handleSubmit} variant="contained" color="primary">
                Update
            </Button>
                {loading && <CircularProgress />}

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
