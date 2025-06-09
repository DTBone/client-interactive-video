import {
    Box, Typography, TextField, Paper, Grid, Stack, Button,
    InputLabel, Divider
} from "@mui/material";
import { useRef, useState } from "react";
import logo from '~/assets/logo_codechef.png';
import { api } from "~/Config/api";
import { toast } from "react-toastify";

function CareerRegister() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [coverLetter, setCoverLetter] = useState(null);
    const [cv, setCv] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const coverLetterRef = useRef();
    const cvRef = useRef();

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isValidPhone = (phone) => /^\d{9,15}$/.test(phone);

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setCity('');
        setCoverLetter(null);
        setCv(null);
        coverLetterRef.current.value = '';
        cvRef.current.value = '';
    };

    const handleFileChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validate
        if (!isValidEmail(email)) {
            toast.error("Email is not valid");
            setIsLoading(false);
            return;
        }
        if (phone && !isValidPhone(phone)) {
            toast.error("Phone number is not valid");
            setIsLoading(false);
            return;
        }
        if (!coverLetter || !cv) {
            toast.error("Please attach CV and Cover Letter");
            setIsLoading(false);
            return;
        }
        const maxSize = 5 * 1024 * 1024;
        if (coverLetter.size > maxSize || cv.size > maxSize) {
            toast.error("File must be less than 5MB");
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('city', city);
            formData.append('coverLetter', coverLetter);
            formData.append('cv', cv);

            const response = await api.post('/users/register-as-instructor', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Register successfully');
                resetForm();
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            setError(error?.response?.data?.error || "Something went wrong");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ height: '100vh', bgcolor: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
            <Paper elevation={4} sx={{ p: 4, maxWidth: 900, width: '100%', height: '90%', overflow: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <img src={logo} alt="logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                    <Typography variant="h4" align="center" fontWeight={600} color="primary">
                        Welcome to Code Chef
                    </Typography>
                    <Typography variant="body1" align="center" color="primary" fontWeight={600}>
                        Become a part of our team and help us grow.
                    </Typography>
                    <Divider sx={{ width: '100%', my: 2 }} />
                </Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required type="email" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel shrink htmlFor="coverletter-upload">Cover Letter</InputLabel>
                            <input
                                ref={coverLetterRef}
                                id="coverletter-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                style={{ width: '100%' }}
                                onChange={e => handleFileChange(e, setCoverLetter)}
                            />
                            {coverLetter && <Typography variant="body2">Selected: {coverLetter.name}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel shrink htmlFor="cv-upload">CV</InputLabel>
                            <input
                                ref={cvRef}
                                id="cv-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                style={{ width: '100%' }}
                                onChange={e => handleFileChange(e, setCv)}
                            />
                            {cv && <Typography variant="body2">Selected: {cv.name}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                <Button variant="contained" color="primary" type="submit" disabled={isLoading} fullWidth>
                                    {isLoading ? 'Loading...' : 'Register'}
                                </Button>
                            </Stack>
                        </Grid>
                        {error && (
                            <Grid item xs={12}>
                                <Typography variant="body2" color="error" align="center">{error}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}

export default CareerRegister;
