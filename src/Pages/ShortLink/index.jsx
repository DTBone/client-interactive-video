import { Container, Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '~/Config/api';
import { useNavigate } from 'react-router-dom';
function ShortLink() {
    const [shortLink, setShortLink] = useState(null);
    const { code } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isExpired, setIsExpired] = useState(false);
    useEffect(() => {
        const fetchShortLink = async () => {
            try {
                const res = await api.get(`/shortlinks/info/${code}`);
                setShortLink(res.data.data);
                setIsLoading(false);
                if (res.data.data.expiredAt < new Date()) {
                    setIsExpired(true);
                }
            } catch (error) {
                setIsExpired(true);
                setIsLoading(false);
            }
        };
        fetchShortLink();
    }, [code]);

    if (shortLink && !isLoading) {
        navigate(`/course/${shortLink.courseId._id}`);
    }

    return ( 
        <Container maxWidth="md" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            {isLoading && (
                <Box>
                    <CircularProgress />
                </Box>
            )}
            {isExpired && (
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
                >
                    <img className='w-full' src="/error-oop.svg" alt="error" />
                    <Typography variant='h6' color='error'>Your link has expired or not found</Typography>
                </Box>
            )}
        </Container>
     );
}

export default ShortLink;